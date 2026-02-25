<!-- src/components/Orders/OrderCard.vue -->
<template>
  <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
    <!-- Order Header -->
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-lg font-medium text-gray-900">
            {{ t('Order') }} #{{ order.orderNumber }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ t('Placed on') }} {{ formatDate(order.createdAt) }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            getStatusColor(order.status)
          ]">
            {{ ordersStore.getStatusText(order.status) }}
          </span>
          <span class="text-sm font-medium text-gray-900">
            {{ formatCurrency(order.total) }} EGP
          </span>
        </div>
      </div>
    </div>

    <!-- Order Items - Mobile Optimized -->
    <div class="px-4 sm:px-6 py-4">
      <div class="space-y-4">
        <div
          v-for="item in order.items.slice(0, 2)"
          :key="item.id"
          class="flex items-center"
        >
          <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
            <img
              :src="item.image || '/images/default-product.jpg'"
              :alt="item.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
            <p class="text-sm text-gray-500">{{ item.size }} • {{ item.concentration }}</p>
            <div class="mt-1 flex items-center flex-wrap gap-x-2">
              <span class="text-sm text-gray-900">{{ formatCurrency(item.price) }} EGP</span>
              <span class="text-gray-300">•</span>
              <span class="text-sm text-gray-500">{{ t('Qty:') }} {{ item.quantity }}</span>
            </div>
          </div>
        </div>

        <!-- Show more items indicator -->
        <div v-if="order.items.length > 2" class="pt-2 border-t border-gray-100">
          <p class="text-sm text-gray-500">
            +{{ order.items.length - 2 }} {{ t('more items') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Tracking Info -->
    <div v-if="order.trackingNumber" class="px-4 sm:px-6 py-2 bg-blue-50">
      <p class="text-xs text-blue-800">
        <span class="font-medium">{{ t('Tracking:') }}</span> {{ order.trackingNumber }}
      </p>
    </div>

    <!-- Order Footer -->
    <div class="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button
          @click="$emit('view', order)"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <span class="hidden sm:inline">{{ t('View Details') }}</span>
          <span class="sm:hidden">{{ t('View') }}</span>
        </button>
        
        <button
          v-if="order.status === 'delivered'"
          @click="handleReorder"
          class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 transition-colors"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="hidden sm:inline">{{ t('Reorder') }}</span>
          <span class="sm:hidden">{{ t('Buy Again') }}</span>
        </button>
        
        <button
          v-if="order.status === 'pending' || order.status === 'processing'"
          @click="handleCancel"
          class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
        >
          <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="hidden sm:inline">{{ t('Cancel') }}</span>
          <span class="sm:hidden">✕</span>
        </button>

        <button
          @click="handleDownloadInvoice"
          class="inline-flex items-center p-2 text-gray-500 hover:text-gold-500 transition-colors"
          :title="t('Download Invoice')"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import { useOrdersStore } from '@/stores/orders'
import { authNotification } from '@/utils/notifications'
import { showConfirmation } from '@/utils/confirmation'

const props = defineProps<{
  order: any
}>()

const emit = defineEmits<{
  (e: 'view', order: any): void
  (e: 'reorder', order: any): void
  (e: 'cancel', order: any): void
  (e: 'download-invoice', orderId: string): void
}>()

const languageStore = useLanguageStore()
const ordersStore = useOrdersStore()
const { t } = languageStore

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString(languageStore.currentLanguage === 'ar' ? 'ar-EG' : 'en-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG').format(amount)
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

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/default-product.jpg'
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
    }
  }
}

const handleDownloadInvoice = () => {
  emit('download-invoice', props.order.id)
}
</script>