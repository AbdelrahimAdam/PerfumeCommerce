// src/stores/orders.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  runTransaction
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'
import { useCartStore } from './cart'
import { useProductsStore } from './products'
import { authNotification } from '@/utils/notifications'
import type { 
  Order, 
  OrderStatus, 
  OrderItem, 
  ShippingAddress, 
  PaymentMethod,
  PaymentStatus,
  StatusHistoryItem
} from '@/types'

export interface FirestoreOrder extends Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'shippedAt' | 'deliveredAt' | 'cancelledAt' | 'statusHistory'> {
  createdAt: Timestamp
  updatedAt: Timestamp
  shippedAt?: Timestamp | null
  deliveredAt?: Timestamp | null
  cancelledAt?: Timestamp | null
  statusHistory?: Array<{
    status: OrderStatus
    timestamp: Timestamp
    note?: string
    updatedBy?: string
  }>
}

export const useOrdersStore = defineStore('orders', () => {
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const productsStore = useProductsStore()

  // State
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastVisible = ref<QueryDocumentSnapshot<DocumentData> | null>(null)
  const hasMore = ref(true)
  const statsLoading = ref(false)
  const orderStats = ref<{
    totalOrders: number
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
    totalRevenue: number
    averageOrderValue: number
    monthlyRevenue: number
  } | null>(null)

  // Getters
  const pendingOrdersCount = computed(() => 
    orders.value.filter(order => order.status === 'pending').length
  )

  const completedOrdersCount = computed(() => 
    orders.value.filter(order => order.status === 'delivered').length
  )

  // ✅ Revenue counts only delivered AND paid orders
  const totalRevenue = computed(() => 
    orders.value
      .filter(order => order.status === 'delivered' && order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0)
  )

  const activeOrders = computed(() => 
    orders.value.filter(order => ['pending', 'processing', 'shipped'].includes(order.status))
  )

  const averageOrderValue = computed(() => {
    const paidOrders = orders.value.filter(o => o.paymentStatus === 'paid' && o.status !== 'cancelled')
    if (paidOrders.length === 0) return 0
    return paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length
  })

  // Helper functions
  const getStatusText = (status: OrderStatus): string => {
    const map: Record<OrderStatus, string> = {
      pending: 'Pending Confirmation',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
    return map[status]
  }

  const getStatusDescription = (status: OrderStatus): string => {
    const map: Record<OrderStatus, string> = {
      pending: 'Your order has been received and is waiting for confirmation',
      processing: 'Your order is being prepared for shipment',
      shipped: 'Your order has been shipped and is on its way',
      delivered: 'Your order has been delivered successfully',
      cancelled: 'This order has been cancelled'
    }
    return map[status]
  }

  const getPaymentStatusText = (paymentStatus: PaymentStatus): string => {
    const map: Record<PaymentStatus, string> = {
      pending: 'Pending Payment',
      paid: 'Paid',
      failed: 'Payment Failed',
      refunded: 'Refunded'
    }
    return map[paymentStatus]
  }

  const generateOrderNumber = (): string => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const timestamp = Date.now().toString().slice(-4)
    return `ORD-${year}${month}${day}-${random}-${timestamp}`
  }

  const generateGuestId = (): string => 
    `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

  const convertTimestampsToDates = (firestoreOrder: FirestoreOrder & { id: string }): Order => ({
    ...firestoreOrder,
    createdAt: firestoreOrder.createdAt?.toDate() || new Date(),
    updatedAt: firestoreOrder.updatedAt?.toDate() || new Date(),
    shippedAt: firestoreOrder.shippedAt?.toDate() || null,
    deliveredAt: firestoreOrder.deliveredAt?.toDate() || null,
    cancelledAt: firestoreOrder.cancelledAt?.toDate() || null,
    statusHistory: firestoreOrder.statusHistory?.map(h => ({
      ...h,
      timestamp: h.timestamp.toDate()
    }))
  })

  const getCurrentUserId = (): string | null => {
    if (!authStore.isAuthenticated) return null
    if (authStore.user?.id) return authStore.user.id
    if (authStore.customer?.id) return authStore.customer.id
    return null
  }

  const getCurrentUserEmail = (): string | null => {
    if (!authStore.isAuthenticated) return null
    if (authStore.user?.email) return authStore.user.email
    if (authStore.customer?.email) return authStore.customer.email
    return null
  }

  const getCurrentUserName = (): string | null => {
    if (!authStore.isAuthenticated) return null
    if (authStore.user?.displayName) return authStore.user.displayName
    if (authStore.customer?.displayName) return authStore.customer.displayName
    return null
  }

  // ========== SECURITY‑FIXED fetchOrders ==========
  const fetchOrders = async (options?: {
    limit?: number
    status?: OrderStatus
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
    userId?: string
    guestId?: string
    email?: string
    all?: boolean
  }) => {
    if (loading.value) return []

    loading.value = true
    error.value = null

    try {
      const ordersCollection = collection(db, 'orders')
      const constraints: any[] = [orderBy('createdAt', 'desc')]

      const currentUserId = getCurrentUserId()
      const isAdmin = authStore.isAdmin

      if (options?.userId) {
        if (!isAdmin && options.userId !== currentUserId) {
          console.warn('Permission denied: cannot fetch orders for another user')
          loading.value = false
          return []
        }
        constraints.push(where('userId', '==', options.userId))
      }
      else if (options?.guestId) {
        constraints.push(where('guestId', '==', options.guestId))
      }
      else if (options?.email) {
        constraints.push(where('customer.email', '==', options.email))
      }
      else if (options?.all && isAdmin) {
        // No user filter – fetch all
      }
      else if (authStore.isCustomer && currentUserId) {
        constraints.push(where('userId', '==', currentUserId))
      }
      else if (!isAdmin && !authStore.isCustomer) {
        // Guest – cannot fetch without identifier
        loading.value = false
        return []
      }

      if (options?.status) {
        constraints.push(where('status', '==', options.status))
      }

      if (options?.limit) {
        constraints.push(limit(options.limit))
      } else {
        constraints.push(limit(20))
      }

      if (options?.startAfterDoc) {
        constraints.push(startAfter(options.startAfterDoc))
      }

      const q = query(ordersCollection, ...constraints)
      const querySnapshot = await getDocs(q)

      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null
      hasMore.value = querySnapshot.docs.length === (options?.limit || 20)

      const fetchedOrders: Order[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreOrder
        return convertTimestampsToDates({ id: doc.id, ...data })
      })

      orders.value = fetchedOrders
      return fetchedOrders
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // ========== fetchOrderById ==========
  const fetchOrderById = async (orderId: string) => {
    loading.value = true
    error.value = null

    try {
      const orderDoc = doc(db, 'orders', orderId)
      const docSnapshot = await getDoc(orderDoc)

      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as FirestoreOrder
        const currentUserId = getCurrentUserId()

        if (authStore.isAdmin) {
          currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
          return currentOrder.value
        }

        if (currentUserId && data.userId && data.userId === currentUserId) {
          currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
          return currentOrder.value
        }

        if (data.guestId) {
          const guestId = localStorage.getItem('guest_order_id')
          const guestEmail = localStorage.getItem('last_order_email')
          if (guestId && data.guestId === guestId) {
            currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
            return currentOrder.value
          }
          if (guestEmail && data.customer?.email === guestEmail) {
            currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
            return currentOrder.value
          }
        }

        error.value = 'You do not have permission to view this order'
        return null
      } else {
        error.value = 'Order not found'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch order'
      console.error('Error fetching order:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // ========== fetchOrderByNumber ==========
  const fetchOrderByNumber = async (orderNumber: string, email: string) => {
    loading.value = true
    error.value = null

    try {
      const ordersCollection = collection(db, 'orders')
      const q = query(
        ordersCollection,
        where('orderNumber', '==', orderNumber),
        where('customer.email', '==', email)
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data() as FirestoreOrder
        currentOrder.value = convertTimestampsToDates({ id: doc.id, ...data })
        return currentOrder.value
      } else {
        error.value = 'Order not found'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch order'
      console.error('Error fetching order:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // ========== CORRECTED createOrder ==========
  const createOrder = async (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod = 'cash_on_delivery',
    notes?: string
  ) => {
    if (cartStore.items.length === 0) {
      authNotification.error('Your cart is empty')
      return null
    }

    loading.value = true
    error.value = null

    try {
      const newOrder = await runTransaction(db, async (transaction) => {
        const orderNumber = generateOrderNumber()
        const guestId = !authStore.isAuthenticated ? generateGuestId() : null

        const currentUserId = getCurrentUserId()
        const currentUserEmail = getCurrentUserEmail()
        const currentUserName = getCurrentUserName()

        const orderItems: OrderItem[] = cartStore.items.map(item => {
          const product = productsStore.products.find(p => p.id === item.id)
          return {
            id: item.id,
            productId: item.id,
            name: product?.name?.en || item.name?.en || 'Product',
            nameAr: product?.name?.ar || item.name?.ar,
            price: product?.price || item.price,
            quantity: item.quantity || 1,
            size: product?.size || item.size || '100ml',
            concentration: product?.concentration || item.concentration || 'Eau de Parfum',
            image: product?.imageUrl || item.imageUrl || '/images/default-product.jpg',
            brand: product?.brand || item.brand || ''
          }
        })

        const subtotal = cartStore.subtotal
        const shipping = cartStore.shipping || 50
        const tax = cartStore.tax || Math.round(subtotal * 0.14)
        const total = subtotal + shipping + tax

        const statusHistory: StatusHistoryItem[] = [{
          status: 'pending',
          timestamp: new Date(),
          note: 'Order placed successfully',
          updatedBy: authStore.isAuthenticated ? currentUserId || 'customer' : 'guest'
        }]

        const orderData: Omit<FirestoreOrder, 'id'> = {
          orderNumber,
          userId: currentUserId,
          guestId: guestId,
          userEmail: currentUserEmail || shippingAddress.email,
          customer: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            country: shippingAddress.country || 'Egypt'
          },
          items: orderItems,
          subtotal,
          shipping,
          tax,
          total,
          status: 'pending',
          paymentMethod,
          paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
          shippingAddress,
          notes: notes || '',
          statusHistory: statusHistory.map(h => ({
            ...h,
            timestamp: Timestamp.fromDate(h.timestamp)
          })),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        const ordersCollection = collection(db, 'orders')
        const docRef = await addDoc(ordersCollection, orderData)

        for (const item of orderItems) {
          const productRef = doc(db, 'products', item.productId)
          const productDoc = await getDoc(productRef)

          if (productDoc.exists()) {
            const currentStock = productDoc.data().stockQuantity || 0
            transaction.update(productRef, {
              stockQuantity: Math.max(0, currentStock - item.quantity),
              updatedAt: serverTimestamp()
            })
          }
        }

        return {
          id: docRef.id,
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
          statusHistory
        }
      })

      const createdOrder: Order = {
        ...newOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
        shippedAt: null,
        deliveredAt: null,
        cancelledAt: null
      }

      orders.value = [createdOrder, ...orders.value]
      currentOrder.value = createdOrder

      await cartStore.clearCart()

      if (createdOrder.guestId) {
        localStorage.setItem('guest_order_id', createdOrder.guestId)
        localStorage.setItem('last_order_email', createdOrder.customer.email)
        localStorage.setItem('last_order_number', createdOrder.orderNumber)

        sessionStorage.setItem('last_created_order', JSON.stringify({
          id: createdOrder.id,
          guestId: createdOrder.guestId,
          email: createdOrder.customer.email,
          orderNumber: createdOrder.orderNumber
        }))
      }

      authNotification.loggedIn(`Order #${createdOrder.orderNumber} placed successfully`)

      return createdOrder
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create order'
      console.error('Error creating order:', err)
      authNotification.error('Failed to place order. Please try again.')
      return null
    } finally {
      loading.value = false
    }
  }

  // ========== getGuestOrders ==========
  const getGuestOrders = async () => {
    const guestId = localStorage.getItem('guest_order_id')
    const guestEmail = localStorage.getItem('last_order_email')
    const guestOrderNumber = localStorage.getItem('last_order_number')

    if (!guestId && !guestEmail && !guestOrderNumber) return []

    loading.value = true

    try {
      const ordersCollection = collection(db, 'orders')
      let q

      if (guestId) {
        q = query(
          ordersCollection,
          where('guestId', '==', guestId),
          orderBy('createdAt', 'desc')
        )
      } else if (guestEmail) {
        q = query(
          ordersCollection,
          where('customer.email', '==', guestEmail),
          orderBy('createdAt', 'desc')
        )
      } else if (guestOrderNumber) {
        q = query(
          ordersCollection,
          where('orderNumber', '==', guestOrderNumber),
          orderBy('createdAt', 'desc')
        )
      } else {
        return []
      }

      const querySnapshot = await getDocs(q)

      const guestOrders: Order[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreOrder
        return convertTimestampsToDates({ id: doc.id, ...data })
      })

      if (guestOrders.length > 0) {
        const latestOrder = guestOrders[0]
        if (latestOrder.guestId) localStorage.setItem('guest_order_id', latestOrder.guestId)
        if (latestOrder.customer?.email) localStorage.setItem('last_order_email', latestOrder.customer.email)
        if (latestOrder.orderNumber) localStorage.setItem('last_order_number', latestOrder.orderNumber)
      }

      return guestOrders
    } catch (err) {
      console.error('Error fetching guest orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // ========== updateOrderStatus (already implemented) ==========
  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    note?: string
  ) => {
    if (!authStore.isAdmin) {
      authNotification.error('You do not have permission to update orders')
      return false
    }

    loading.value = true
    error.value = null

    try {
      const orderDocRef = doc(db, 'orders', orderId)
      const orderSnapshot = await getDoc(orderDocRef)

      if (!orderSnapshot.exists()) {
        throw new Error('Order not found')
      }

      const orderData = orderSnapshot.data() as FirestoreOrder
      const order = convertTimestampsToDates({ id: orderSnapshot.id, ...orderData })

      if (order.status === status) {
        console.log('Status already set to', status)
        return true
      }

      const currentUserId = getCurrentUserId()
      const currentUserName = getCurrentUserName()

      const statusHistory: StatusHistoryItem[] = order.statusHistory || []
      statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || getStatusDescription(status),
        updatedBy: currentUserName || currentUserId || 'admin'
      })

      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
        statusHistory: statusHistory.map(h => ({
          ...h,
          timestamp: Timestamp.fromDate(h.timestamp)
        }))
      }

      if (trackingNumber) updateData.trackingNumber = trackingNumber

      if (status === 'shipped') {
        updateData.shippedAt = serverTimestamp()
        if (!trackingNumber && order.paymentMethod === 'cash_on_delivery') {
          updateData.paymentStatus = 'paid'
        }
      } else if (status === 'delivered') {
        updateData.deliveredAt = serverTimestamp()
        updateData.paymentStatus = 'paid'
      } else if (status === 'cancelled') {
        updateData.cancelledAt = serverTimestamp()
        if (order.paymentStatus === 'paid') {
          updateData.paymentStatus = 'refunded'
        }
        for (const item of order.items) {
          const productRef = doc(db, 'products', item.productId)
          const productDoc = await getDoc(productRef)
          if (productDoc.exists()) {
            const currentStock = productDoc.data().stockQuantity || 0
            await updateDoc(productRef, {
              stockQuantity: currentStock + item.quantity,
              updatedAt: serverTimestamp()
            })
          }
        }
      }

      await updateDoc(orderDocRef, updateData)

      const updatedOrder: Order = {
        ...order,
        status,
        updatedAt: new Date(),
        statusHistory,
        ...(trackingNumber && { trackingNumber }),
        ...(status === 'shipped' && { shippedAt: new Date() }),
        ...(status === 'delivered' && { deliveredAt: new Date(), paymentStatus: 'paid' }),
        ...(status === 'cancelled' && { cancelledAt: new Date() })
      }

      if (updateData.paymentStatus) {
        updatedOrder.paymentStatus = updateData.paymentStatus
      }

      const orderIndex = orders.value.findIndex(o => o.id === orderId)
      if (orderIndex !== -1) {
        orders.value = [
          ...orders.value.slice(0, orderIndex),
          updatedOrder,
          ...orders.value.slice(orderIndex + 1)
        ]
      } else {
        orders.value = [updatedOrder, ...orders.value]
      }

      if (currentOrder.value?.id === orderId) {
        currentOrder.value = updatedOrder
      }

      const statusMessages: Partial<Record<OrderStatus, string>> = {
        processing: 'Your order is now being processed',
        shipped: `Your order has been shipped${trackingNumber ? ` with tracking #${trackingNumber}` : ''}`,
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled'
      }
      if (statusMessages[status]) {
        authNotification.loggedIn(statusMessages[status] as string)
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update order status'
      console.error('Error updating order status:', err)
      authNotification.error(error.value || 'Update failed')
      return false
    } finally {
      loading.value = false
    }
  }

  // ========== Other Actions (stubs – replace with your full implementations if needed) ==========
  const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    if (!authStore.isAdmin) {
      authNotification.error('You do not have permission to update payment status')
      return false
    }
    loading.value = true
    try {
      const orderDoc = doc(db, 'orders', orderId)
      await updateDoc(orderDoc, { paymentStatus, updatedAt: serverTimestamp() })
      // update local array...
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update payment status'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateOrder = async (orderId: string, updateData: Partial<Order>) => { /* ... */ }
  const cancelOrder = async (orderId: string, reason?: string) => { /* ... */ }
  const deleteOrder = async (orderId: string) => { /* ... */ }
  const searchOrders = async (searchTerm: string, status?: OrderStatus) => { /* ... */ }
  const getOrdersByEmail = async (email: string) => { /* ... */ }
  const reorder = async (orderId: string) => { /* ... */ }
  const downloadInvoice = async (orderId: string) => { /* ... */ }
  const getMonthlyRevenue = async (year: number, month: number) => { /* ... */ }
  const getOrderStats = async () => { /* ... */ }
  const loadMore = async () => { /* ... */ }

  const clearCurrentOrder = () => { currentOrder.value = null }
  const clearOrders = () => {
    orders.value = []
    lastVisible.value = null
    hasMore.value = true
    error.value = null
  }

  // Admin real-time helpers
  const setOrders = (newOrders: Order[]) => { orders.value = newOrders }
  const addOrder = (order: Order) => { orders.value.unshift(order) }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    lastVisible,
    hasMore,
    statsLoading,
    orderStats,

    // Getters
    pendingOrdersCount,
    completedOrdersCount,
    totalRevenue,
    activeOrders,
    averageOrderValue,
    getStatusText,
    getStatusDescription,
    getPaymentStatusText,

    // Actions
    fetchOrders,
    fetchOrderById,
    fetchOrderByNumber,
    createOrder,
    getGuestOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrder,
    cancelOrder,
    deleteOrder,
    searchOrders,
    getOrdersByEmail,
    reorder,
    downloadInvoice,
    getMonthlyRevenue,
    getOrderStats,
    loadMore,
    clearCurrentOrder,
    clearOrders,

    // Admin helpers
    setOrders,
    addOrder
  }
})