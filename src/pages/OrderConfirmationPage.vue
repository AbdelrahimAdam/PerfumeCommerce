<!-- src/pages/OrderConfirmationPage.vue -->
<template>
  <div class="order-confirmation-page min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        <p class="mt-4 text-gray-600">{{ t('Loading order details...') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 class="mt-4 text-xl font-medium text-gray-900">{{ t('Order Not Found') }}</h2>
        <p class="mt-2 text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <router-link to="/shop" class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600">
            {{ t('Continue Shopping') }}
          </router-link>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="order" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Success Header -->
        <div class="bg-green-50 px-4 sm:px-6 py-6 sm:py-8 text-center border-b border-green-100">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{{ t('Thank You for Your Order!') }}</h1>
          <p class="text-gray-600 text-sm sm:text-base">{{ t('Your order has been placed successfully') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ t('Order Number') }}: 
            <span class="font-mono font-medium">{{ order.orderNumber }}</span>
          </p>
          
          <!-- Guest Order Info -->
          <div v-if="order.guestId" class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p class="font-medium mb-1">{{ t('Save this information to track your order:') }}</p>
            <p>{{ t('Order Number') }}: {{ order.orderNumber }}</p>
            <p>{{ t('Email') }}: {{ order.customer.email }}</p>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="px-4 sm:px-6 py-6 sm:py-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">{{ t('Order Summary') }}</h2>
          
          <!-- Items - Mobile View -->
          <div class="sm:hidden space-y-4 mb-6">
            <div v-for="item in order.items" :key="item.id" class="flex items-start py-3 border-b border-gray-100">
              <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                <img :src="item.image || '/images/default-product.jpg'" :alt="item.name" class="w-full h-full object-cover">
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                <p class="text-xs text-gray-500">{{ item.size }} • {{ item.concentration }}</p>
                <div class="mt-1 flex justify-between items-center">
                  <span class="text-sm text-gray-900">{{ formatCurrency(item.price) }} EGP × {{ item.quantity }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }} EGP</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Items - Desktop View -->
          <div class="hidden sm:block space-y-4 mb-6">
            <div v-for="item in order.items" :key="item.id" class="flex items-center py-3 border-b border-gray-100">
              <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                <img :src="item.image || '/images/default-product.jpg'" :alt="item.name" class="w-full h-full object-cover">
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                <p class="text-xs text-gray-500">{{ item.size }} • {{ item.concentration }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-900">{{ formatCurrency(item.price) }} EGP</div>
                <div class="text-xs text-gray-500">{{ t('Qty') }}: {{ item.quantity }}</div>
              </div>
              <div class="ml-8 text-right">
                <span class="text-sm font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }} EGP</span>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-2 pt-4 border-t border-gray-200">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ t('Subtotal') }}</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(order.subtotal) }} EGP</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ t('Shipping') }}</span>
              <span class="font-medium text-gray-900">{{ order.shipping === 0 ? t('Free') : formatCurrency(order.shipping) + ' EGP' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ t('Tax') }}</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(order.tax) }} EGP</span>
            </div>
            <div class="flex justify-between text-base font-medium pt-4 border-t border-gray-200">
              <span class="text-gray-900">{{ t('Total') }}</span>
              <span class="text-gold-600">{{ formatCurrency(order.total) }} EGP</span>
            </div>
          </div>
        </div>

        <!-- Shipping Info -->
        <div class="bg-gray-50 px-4 sm:px-6 py-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-900 mb-3">{{ t('Shipping Information') }}</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p>{{ order.customer.name }}</p>
            <p>{{ order.customer.address }}</p>
            <p>{{ order.customer.city }}, {{ order.customer.country }}</p>
            <p>{{ t('Phone') }}: {{ order.customer.phone }}</p>
            <p>{{ t('Email') }}: {{ order.customer.email }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-4 sm:px-6 py-6 bg-white border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            @click="downloadInvoice"
            class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            {{ t('Download Invoice') }}
          </button>
          <router-link
            to="/shop"
            class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600"
          >
            {{ t('Continue Shopping') }}
          </router-link>
          <router-link
            :to="`/orders/${order.id}`"
            class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
          >
            {{ t('View Order Details') }}
          </router-link>
        </div>

        <!-- Guest Order Reminder -->
        <div v-if="order.guestId" class="px-4 sm:px-6 py-4 bg-yellow-50 border-t border-yellow-100">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="text-sm text-yellow-700">
              <p class="font-medium">{{ t('Guest Order Information') }}</p>
              <p class="mt-1">{{ t('Please save your order number and email to track this order in the future.') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import { useLanguageStore } from '@/stores/language'
import { showNotification } from '@/utils/notifications'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()
const { t } = useLanguageStore()

const order = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG').format(amount)
}

const downloadInvoice = async () => {
  if (order.value) {
    await ordersStore.downloadInvoice(order.value.id)
  }
}

onMounted(async () => {
  const orderId = route.params.orderId as string
  
  try {
    const fetchedOrder = await ordersStore.fetchOrderById(orderId)
    if (fetchedOrder) {
      order.value = fetchedOrder
      
      // Save to localStorage for guest tracking
      if (fetchedOrder.guestId) {
        localStorage.setItem('guest_order_id', fetchedOrder.guestId)
        localStorage.setItem('last_order_email', fetchedOrder.customer.email)
        localStorage.setItem('last_order_number', fetchedOrder.orderNumber)
      }
    } else {
      error.value = t('Order not found')
    }
  } catch (err) {
    error.value = t('Failed to load order details')
    console.error('Error loading order:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.order-confirmation-page {
  min-height: calc(100vh - 200px);
}
</style>