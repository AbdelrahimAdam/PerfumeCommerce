<!-- src/pages/OrderConfirmationPage.vue -->
<template>
  <div class="order-confirmation-page min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12 sm:py-16">
        <div class="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gold-500"></div>
        <p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">{{ t('Loading order details...') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <svg class="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 class="mt-4 text-lg sm:text-xl font-medium text-gray-900">{{ t('Order Not Found') }}</h2>
        <p class="mt-2 text-sm sm:text-base text-gray-500">{{ error }}</p>
        <div class="mt-6">
          <router-link to="/shop" class="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent rounded-lg sm:rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 transition-colors">
            {{ t('Continue Shopping') }}
          </router-link>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="order" class="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
        <!-- Success Header with Back Button -->
        <div class="bg-green-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-green-100">
          <div class="flex items-center space-x-3 sm:space-x-4 mb-2">
            <button
              @click="goBack"
              class="flex items-center text-sm sm:text-base text-gray-600 hover:text-gold-600 transition-colors"
              aria-label="Go back"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{{ t('back') }}</span>
            </button>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{{ t('Thank You for Your Order!') }}</h1>
            <p class="text-sm sm:text-base text-gray-600">{{ t('Your order has been placed successfully') }}</p>
            <p class="text-xs sm:text-sm text-gray-500 mt-2">{{ t('Order Number') }}: 
              <span class="font-mono font-medium">{{ order.orderNumber }}</span>
            </p>
          </div>
          
          <!-- Guest Order Info -->
          <div v-if="order.guestId && order.customer" class="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-700">
            <p class="font-medium mb-1">{{ t('Save this information to track your order:') }}</p>
            <p>{{ t('Order Number') }}: {{ order.orderNumber }}</p>
            <p>{{ t('Email') }}: {{ order.customer.email || t('Email not available') }}</p>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="px-4 sm:px-6 py-5 sm:py-6 md:py-8">
          <h2 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">{{ t('Order Summary') }}</h2>
          
          <!-- Items - Mobile Friendly -->
          <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div v-for="item in order.items" :key="item.id" class="flex items-start py-2 sm:py-3 border-b border-gray-100 last:border-0">
              <div class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded overflow-hidden">
                <img :src="item.image || '/images/default-product.jpg'" :alt="item.name" class="w-full h-full object-cover" loading="lazy">
              </div>
              <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                <h3 class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{{ item.size }} • {{ item.concentration }}</p>
                <div class="mt-1 flex flex-wrap items-center justify-between gap-1">
                  <span class="text-xs sm:text-sm text-gray-900">{{ formatCurrency(item.price) }} EGP × {{ item.quantity }}</span>
                  <span class="text-xs sm:text-sm font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }} EGP</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Totals - Stacked on mobile, inline on larger screens -->
          <div class="space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-600">{{ t('Subtotal') }}</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(order.subtotal) }} EGP</span>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-600">{{ t('Shipping') }}</span>
              <span class="font-medium text-gray-900">{{ order.shipping === 0 ? t('Free') : formatCurrency(order.shipping) + ' EGP' }}</span>
            </div>
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-gray-600">{{ t('Tax') }}</span>
              <span class="font-medium text-gray-900">{{ formatCurrency(order.tax) }} EGP</span>
            </div>
            <div class="flex justify-between text-sm sm:text-base font-medium pt-3 sm:pt-4 border-t border-gray-200">
              <span class="text-gray-900">{{ t('Total') }}</span>
              <span class="text-gold-600">{{ formatCurrency(order.total) }} EGP</span>
            </div>
          </div>
        </div>

        <!-- Shipping Info -->
        <div v-if="order.customer" class="bg-gray-50 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200">
          <h3 class="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">{{ t('Shipping Information') }}</h3>
          <div class="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
            <p>{{ order.customer.name || t('Name not provided') }}</p>
            <p>{{ order.customer.address || t('Address not provided') }}</p>
            <p>{{ order.customer.city || '' }}{{ order.customer.city && order.customer.country ? ', ' : '' }}{{ order.customer.country || '' }}</p>
            <p>{{ t('Phone') }}: {{ order.customer.phone || t('Not provided') }}</p>
            <p>{{ t('Email') }}: {{ order.customer.email || t('Not provided') }}</p>
          </div>
        </div>

        <!-- Actions - Column on mobile, row on larger -->
        <div class="px-4 sm:px-6 py-4 sm:py-5 bg-white border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            @click="downloadInvoice"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg class="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            {{ t('Download Invoice') }}
          </button>
          <router-link
            to="/shop"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 transition-colors"
          >
            {{ t('Continue Shopping') }}
          </router-link>
          <router-link
            :to="`/orders/${order.id}`"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 transition-colors"
          >
            {{ t('View Order Details') }}
          </router-link>
        </div>

        <!-- Guest Order Reminder -->
        <div v-if="order.guestId" class="px-4 sm:px-6 py-3 sm:py-4 bg-yellow-50 border-t border-yellow-100">
          <div class="flex items-start gap-2 sm:gap-3">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="text-xs sm:text-sm text-yellow-700">
              <p class="font-medium">{{ t('Guest Order Information') }}</p>
              <p class="mt-0.5 sm:mt-1">{{ t('Please save your order number and email to track this order in the future.') }}</p>
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

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()
const { t } = useLanguageStore()

const order = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const goBack = () => {
  // Fallback if no history
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

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
      
      // Save to localStorage for guest tracking (only if customer exists)
      if (fetchedOrder.guestId && fetchedOrder.customer) {
        localStorage.setItem('guest_order_id', fetchedOrder.guestId)
        localStorage.setItem('last_order_email', fetchedOrder.customer.email || '')
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
  min-height: calc(100vh - 150px);
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {
  button, a, .rounded-lg {
    min-height: 44px;
  }
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-duration: 200ms;
  transition-timing-function: ease;
}
</style>