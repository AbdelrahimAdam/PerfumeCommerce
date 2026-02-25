<!-- src/pages/Customer/AccountPage.vue -->
<template>
  <div class="account-page min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        <p class="mt-4 text-gray-600">{{ t('loading') }}...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md px-4">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('errorLoadingAccount') }}</h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
        <button 
          @click="loadUserData" 
          class="mt-6 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
        >
          {{ t('tryAgain') }}
        </button>
      </div>
    </div>

    <!-- Not Logged In State -->
    <div v-else-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md px-4">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('notLoggedIn') }}</h3>
        <p class="mt-2 text-gray-500">{{ t('pleaseLoginToViewAccount') }}</p>
        <div class="mt-6">
          <router-link 
            to="/login" 
            class="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 inline-block"
          >
            {{ t('login') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content - Only show when authenticated and loaded -->
    <template v-else-if="customer">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl sm:text-3xl font-bold font-['Cormorant_Garamond']">{{ t('myAccount') }}</h1>
          <p class="mt-2 text-primary-100">{{ t('welcomeBack') }}, {{ customer.displayName || t('customer') }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow overflow-hidden sticky top-24">
              <!-- User Info -->
              <div class="p-6 bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span class="text-2xl font-bold">{{ userInitials }}</span>
                  </div>
                  <div>
                    <h3 class="font-bold">{{ customer.displayName || t('customer') }}</h3>
                    <p class="text-sm text-white/80">{{ customer.email }}</p>
                  </div>
                </div>
              </div>

              <!-- Navigation -->
              <nav class="p-4">
                <ul class="space-y-2">
                  <li>
                    <router-link 
                      to="/account" 
                      class="flex items-center px-4 py-3 rounded-lg transition-colors"
                      :class="[$route.path === '/account' ? 'bg-gold-50 text-gold-600' : 'text-gray-700 hover:bg-gray-50']"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                      {{ t('dashboard') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link 
                      to="/account/profile" 
                      class="flex items-center px-4 py-3 rounded-lg transition-colors"
                      :class="[$route.path === '/account/profile' ? 'bg-gold-50 text-gold-600' : 'text-gray-700 hover:bg-gray-50']"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      {{ t('profile') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link 
                      to="/account/addresses" 
                      class="flex items-center px-4 py-3 rounded-lg transition-colors"
                      :class="[$route.path === '/account/addresses' ? 'bg-gold-50 text-gold-600' : 'text-gray-700 hover:bg-gray-50']"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {{ t('addresses') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link 
                      to="/orders" 
                      class="flex items-center px-4 py-3 rounded-lg transition-colors"
                      :class="[$route.path === '/orders' ? 'bg-gold-50 text-gold-600' : 'text-gray-700 hover:bg-gray-50']"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                      {{ t('orders') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link 
                      to="/wishlist" 
                      class="flex items-center px-4 py-3 rounded-lg transition-colors"
                      :class="[$route.path === '/wishlist' ? 'bg-gold-50 text-gold-600' : 'text-gray-700 hover:bg-gray-50']"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      {{ t('wishlist') }}
                    </router-link>
                  </li>
                  <li class="pt-4 mt-4 border-t border-gray-200">
                    <button 
                      @click="handleLogout" 
                      class="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      {{ t('logout') }}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="lg:col-span-3">
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-medium text-gray-500">{{ t('totalOrders') }}</h3>
                  <span class="text-2xl font-bold text-gold-600">{{ stats.totalOrders }}</span>
                </div>
                <p class="text-xs text-gray-400">{{ t('lifetimeValue') }}: {{ formatCurrency(stats.totalSpent) }}</p>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-medium text-gray-500">{{ t('pendingOrders') }}</h3>
                  <span class="text-2xl font-bold text-yellow-600">{{ stats.pendingOrders }}</span>
                </div>
                <router-link to="/orders?status=pending" class="text-xs text-gold-600 hover:text-gold-700">
                  {{ t('viewPending') }} →
                </router-link>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-medium text-gray-500">{{ t('wishlistItems') }}</h3>
                  <span class="text-2xl font-bold text-pink-600">{{ wishlistTotal }}</span>
                </div>
                <router-link to="/wishlist" class="text-xs text-gold-600 hover:text-gold-700">
                  {{ t('viewWishlist') }} →
                </router-link>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-lg font-medium text-gray-900">{{ t('recentOrders') }}</h2>
                <router-link to="/orders" class="text-sm text-gold-600 hover:text-gold-700">
                  {{ t('viewAll') }} →
                </router-link>
              </div>

              <div v-if="ordersLoading" class="p-12 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
                <p class="mt-2 text-sm text-gray-500">{{ t('loadingOrders') }}</p>
              </div>

              <div v-else-if="recentOrders.length === 0" class="p-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('noOrdersYet') }}</h3>
                <p class="mt-1 text-gray-500">{{ t('startShopping') }}</p>
                <div class="mt-6">
                  <router-link to="/shop" class="inline-flex items-center px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600">
                    {{ t('shopNow') }}
                  </router-link>
                </div>
              </div>

              <div v-else class="divide-y divide-gray-200">
                <div v-for="order in recentOrders" :key="order.id" class="p-6 hover:bg-gray-50 transition-colors">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <router-link :to="`/orders/${order.id}`" class="text-sm font-medium text-gold-600 hover:text-gold-700">
                        {{ t('order') }} #{{ order.orderNumber }}
                      </router-link>
                      <p class="text-xs text-gray-500 mt-1">{{ formatDate(order.createdAt) }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <span :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        getStatusColor(order.status)
                      ]">
                        {{ ordersStore.getStatusText(order.status) }}
                      </span>
                      <span class="text-sm font-medium text-gray-900">{{ formatCurrency(order.total) }} EGP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Saved Addresses Preview -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-lg font-medium text-gray-900">{{ t('savedAddresses') }}</h2>
                <router-link to="/account/addresses" class="text-sm text-gold-600 hover:text-gold-700">
                  {{ t('manage') }} →
                </router-link>
              </div>

              <div v-if="addresses.length === 0" class="p-12 text-center">
                <p class="text-gray-500">{{ t('noAddresses') }}</p>
                <router-link to="/account/addresses/new" class="mt-4 inline-flex items-center text-sm text-gold-600 hover:text-gold-700">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  {{ t('addAddress') }}
                </router-link>
              </div>

              <div v-else class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="address in addresses.slice(0, 2)" :key="address.id" class="border border-gray-200 rounded-lg p-4">
                    <p class="font-medium text-gray-900">{{ address.name }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ address.address }}</p>
                    <p class="text-sm text-gray-600">{{ address.city }}, {{ address.country }}</p>
                    <p class="text-sm text-gray-600">{{ address.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useWishlistStore } from '@/stores/wishlist'
import { useLanguageStore } from '@/stores/language'
import { authNotification } from '@/utils/notifications'
import type { Address } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const wishlistStore = useWishlistStore()
const { t } = useLanguageStore()

// State
const loading = ref(true)
const ordersLoading = ref(false)
const error = ref<string | null>(null)
const recentOrders = ref<any[]>([])
const addresses = ref<Address[]>([])
const stats = ref({
  totalOrders: 0,
  totalSpent: 0,
  pendingOrders: 0
})

// Computed - Safe access with null checks
const customer = computed(() => authStore.customer)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const userInitials = computed(() => {
  const displayName = customer.value?.displayName
  if (!displayName) return 'U'
  return displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const wishlistTotal = computed(() => wishlistStore.totalItems)

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG').format(amount)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/')
    authNotification.loggedOut()
  } catch (error) {
    console.error('Logout error:', error)
    authNotification.error(t('logoutFailed'))
  }
}

const loadUserData = async () => {
  if (!authStore.isAuthenticated || !customer.value) {
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  ordersLoading.value = true

  try {
    // Load recent orders
    await ordersStore.fetchOrders({
      userId: customer.value.id,
      limit: 5
    })
    recentOrders.value = ordersStore.orders.slice(0, 5)

    // Calculate stats
    stats.value.totalOrders = ordersStore.orders.length
    stats.value.totalSpent = ordersStore.orders
      .filter(o => o.paymentStatus === 'paid' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0)
    stats.value.pendingOrders = ordersStore.orders
      .filter(o => ['pending', 'processing'].includes(o.status))
      .length

    // Load addresses from user profile (if your customer object has addresses)
    addresses.value = customer.value.addresses || []

  } catch (err) {
    console.error('Error loading user data:', err)
    error.value = t('failedToLoadUserData')
  } finally {
    loading.value = false
    ordersLoading.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>

