<!-- src/components/Orders/OrderDetailsModal.vue -->
<template>
  <div class="fixed inset-0 overflow-y-auto z-50">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-900/75 backdrop-blur-sm"></div>
      </div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-primary-900 to-primary-700 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 class="text-xl font-bold font-['Cormorant_Garamond']">{{ t('Order Details') }}</h2>
            <p class="text-sm text-primary-100 mt-1">{{ t('Order Number') }}: #{{ order.orderNumber }}</p>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-white/10 rounded-lg transition-colors"
            :aria-label="t('Close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="max-h-[70vh] overflow-y-auto">
          <div class="p-6 space-y-6">
            <!-- Order Status Timeline (new) -->
            <div class="border-b border-gray-200 pb-4">
              <h3 class="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <svg class="w-4 h-4 mr-2 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ t('Order Timeline') }}
              </h3>
              <div class="flow-root">
                <ul class="-mb-8">
                  <li v-for="(statusItem, index) in order.statusHistory" :key="index" class="relative pb-8">
                    <div v-if="index !== order.statusHistory.length - 1" class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                    <div class="relative flex space-x-3">
                      <div>
                        <span :class="['h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white', getTimelineIconColor(statusItem.status)]">
                          <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div>
                          <p class="text-sm text-gray-900">
                            {{ ordersStore.getStatusText(statusItem.status) }}
                            <span v-if="statusItem.note" class="text-gray-500"> - {{ statusItem.note }}</span>
                          </p>
                          <p class="mt-0.5 text-xs text-gray-500">
                            {{ formatDateTime(statusItem.timestamp) }}
                            <span v-if="statusItem.updatedBy" class="ml-2">by {{ statusItem.updatedBy }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Order Status (existing, but we keep it for quick reference) -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">{{ t('Order Status') }}</h3>
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  getStatusColor(order.status)
                ]">
                  {{ ordersStore.getStatusText(order.status) }}
                </span>
              </div>
              <div class="text-sm text-gray-600">
                <span class="font-medium">{{ t('Placed on') }}:</span> {{ formatDate(order.createdAt) }}
              </div>
            </div>

            <!-- Tracking Info (if available) -->
            <div v-if="order.trackingNumber" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20L3 17V7L9 4L15 7L21 4V14M9 20V11M9 20L15 17M9 4L15 7M15 7V14M15 17V20M15 17L21 20V14M3 7L9 11"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-blue-800">{{ t('Tracking Number') }}</p>
                    <p class="text-sm text-blue-600 mt-0.5">{{ order.trackingNumber }}</p>
                  </div>
                </div>
                <button
                  @click="copyTrackingNumber"
                  class="inline-flex items-center px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  {{ copied ? t('Copied!') : t('Copy') }}
                </button>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Shipping Address -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ t('Shipping Address') }}
                </h3>
                <div class="text-sm text-gray-600 space-y-1">
                  <p class="font-medium text-gray-900">{{ order.customer.name }}</p>
                  <p>{{ order.customer.address }}</p>
                  <p>{{ order.customer.city }}, {{ order.customer.country }}</p>
                  <p class="mt-2">{{ t('Phone') }}: {{ order.customer.phone }}</p>
                </div>
              </div>

              <!-- Payment Information -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  {{ t('Payment Information') }}
                </h3>
                <div class="text-sm text-gray-600 space-y-2">
                  <div class="flex justify-between">
                    <span>{{ t('Method') }}:</span>
                    <span class="font-medium text-gray-900">{{ getPaymentMethodText(order.paymentMethod) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>{{ t('Status') }}:</span>
                    <span :class="[
                      'font-medium',
                      order.paymentStatus === 'paid' ? 'text-green-600' : 
                      order.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    ]">
                      {{ ordersStore.getPaymentStatusText(order.paymentStatus) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>{{ t('Email') }}:</span>
                    <span class="font-medium text-gray-900">{{ order.customer.email }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <svg class="w-4 h-4 mr-2 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                {{ t('Order Items') }}
              </h3>
              
              <div class="space-y-4">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <!-- Item Image -->
                  <div class="flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200">
                    <img
                      :src="item.image || '/images/default-product.jpg'"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                  </div>

                  <!-- Item Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
                        <p class="text-xs text-gray-500 mt-1">{{ item.size }} • {{ item.concentration }}</p>
                        <p class="text-xs text-gray-500">{{ item.brand }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-medium text-gray-900">{{ formatCurrency(item.price) }} EGP</p>
                        <p class="text-xs text-gray-500">{{ t('Qty') }}: {{ item.quantity }}</p>
                      </div>
                    </div>
                    <div class="mt-2 text-sm font-medium text-gold-600">
                      {{ t('Subtotal') }}: {{ formatCurrency(item.price * item.quantity) }} EGP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="bg-gray-100 rounded-xl p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">{{ t('Order Summary') }}</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ t('Subtotal') }}</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(order.subtotal) }} EGP</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ t('Shipping') }}</span>
                  <span class="font-medium text-gray-900">
                    {{ order.shipping === 0 ? t('Free') : formatCurrency(order.shipping) + ' EGP' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ t('Tax') }}</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(order.tax) }} EGP</span>
                </div>
                <div class="flex justify-between text-base font-medium pt-3 border-t border-gray-300">
                  <span class="text-gray-900">{{ t('Total') }}</span>
                  <span class="text-gold-600">{{ formatCurrency(order.total) }} EGP</span>
                </div>
              </div>
            </div>

            <!-- Notes (if any) -->
            <div v-if="order.notes" class="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <span class="font-medium text-gray-900">{{ t('Notes') }}:</span>
              <p class="mt-1">{{ order.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            @click="handleDownloadInvoice"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            {{ t('Download Invoice') }}
          </button>
          
          <button
            v-if="order.status === 'delivered'"
            @click="handleReorder"
            class="inline-flex items-center justify-center px-4 py-2 bg-gold-500 text-white rounded-lg text-sm font-medium hover:bg-gold-600 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {{ t('Reorder') }}
          </button>
          
          <button
            v-if="order.status === 'pending' || order.status === 'processing'"
            @click="handleCancel"
            class="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ t('Cancel Order') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useOrdersStore } from '@/stores/orders'
import { authNotification } from '@/utils/notifications'
import { showConfirmation } from '@/utils/confirmation'

const props = defineProps<{
  order: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'reorder', order: any): void
  (e: 'cancel', order: any): void
  (e: 'download-invoice', orderId: string): void
}>()

const languageStore = useLanguageStore()
const ordersStore = useOrdersStore()
const { t } = languageStore

const copied = ref(false)

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG').format(amount)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getTimelineIconColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

const getPaymentMethodText = (method: string) => {
  const methods: Record<string, string> = {
    cash_on_delivery: t('Cash on Delivery'),
    credit_card: t('Credit Card'),
    bank_transfer: t('Bank Transfer')
  }
  return methods[method] || method
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/default-product.jpg'
}

const copyTrackingNumber = async () => {
  if (props.order.trackingNumber) {
    try {
      await navigator.clipboard.writeText(props.order.trackingNumber)
      copied.value = true
      authNotification.loggedIn(t('Tracking number copied'))
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      authNotification.error(t('Copy failed'))
    }
  }
}

const handleReorder = async () => {
  const confirmed = await showConfirmation({
    title: t('Reorder Items'),
    message: t('This will add all items from this order to your cart. Continue?'),
    confirmText: t('Yes, Reorder'),
    cancelText: t('Cancel'),
    type: 'info'
  })
  if (confirmed) {
    const success = await ordersStore.reorder(props.order.id)
    if (success) {
      emit('reorder', props.order)
      emit('close')
    }
  }
}

const handleCancel = async () => {
  const confirmed = await showConfirmation({
    title: t('Cancel Order'),
    message: t('Are you sure you want to cancel this order? This action cannot be undone.'),
    confirmText: t('Yes, Cancel'),
    cancelText: t('No, Keep'),
    type: 'warning'
  })
  if (confirmed) {
    const success = await ordersStore.cancelOrder(props.order.id)
    if (success) {
      emit('cancel', props.order)
      authNotification.loggedIn(t('Order cancelled successfully'))
      emit('close')
    }
  }
}

const handleDownloadInvoice = () => {
  emit('download-invoice', props.order.id)
}
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Better touch targets for mobile */
@media (max-width: 640px) {
  button,
  .rounded-lg {
    min-height: 44px;
  }
  
  .sm\:p-6 {
    padding: 1rem;
  }
}

/* Custom scrollbar for modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}
</style>