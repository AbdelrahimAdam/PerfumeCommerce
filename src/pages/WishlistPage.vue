<!-- src/pages/WishlistPage.vue -->
<template>
  <div class="wishlist-page" :class="{ 'rtl': isRTL }">
    <SEOHead 
      :title="t('My Wishlist')"
      :description="t('Save your favorite perfumes for later')"
    />

    <div class="container">
      <!-- Header with Back Button -->
      <div class="page-header">
        <div class="header-content">
          <button
            @click="goBack"
            class="back-button"
            aria-label="Go back"
          >
            <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="back-text">{{ t('back') }}</span>
          </button>
          <div class="title-wrapper">
            <h1 class="page-title">{{ t('My Wishlist') }}</h1>
            <p class="page-subtitle">{{ t('Save your favorite perfumes for later') }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="wishlistStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('Loading your wishlist...') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="wishlistStore.items.length === 0" class="empty-wishlist">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <h2>{{ t('Your wishlist is empty') }}</h2>
        <p>{{ t('Add perfumes you love to your wishlist') }}</p>
        <div class="empty-actions">
          <router-link to="/shop" class="shop-link primary">
            {{ t('Browse Perfumes') }}
          </router-link>
        </div>
      </div>

      <!-- Wishlist Content -->
      <div v-else class="wishlist-content">
        <!-- Wishlist Stats - Mobile Scrollable -->
        <div class="stats-wrapper">
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">{{ t('Total Items') }}</span>
              <span class="stat-value">{{ wishlistStore.totalItems }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t('Total Value') }}</span>
              <span class="stat-value price">{{ formatPrice(wishlistStore.totalValue) }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t('In Stock') }}</span>
              <span class="stat-value in-stock">{{ wishlistStore.inStockCount }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t('Low Stock') }}</span>
              <span class="stat-value low-stock">{{ wishlistStore.lowStockCount }}</span>
            </div>
          </div>
        </div>

        <!-- Action Bar - Mobile Optimized -->
        <div class="action-bar">
          <div class="action-left">
            <div class="select-all">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="checkbox"
                />
                <span class="select-all-text">{{ t('Select All') }}</span>
              </label>
            </div>

            <div v-if="wishlistStore.selectedItems.length > 0" class="selected-actions">
              <span class="selected-count">
                {{ wishlistStore.selectedItems.length }} {{ t('selected') }}
              </span>
              <div class="selected-buttons">
                <button
                  @click="moveSelectedToCart"
                  class="action-btn primary"
                  :disabled="cartStore.isLoading"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span class="btn-text">{{ t('Add to Cart') }}</span>
                </button>
                <button
                  @click="removeSelected"
                  class="action-btn danger"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  <span class="btn-text">{{ t('Remove') }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="sort-options">
            <label class="sort-label">{{ t('Sort by:') }}</label>
            <select
              v-model="sortBy"
              class="sort-select"
            >
              <option value="dateAdded">{{ t('Date Added') }}</option>
              <option value="priceLow">{{ t('Price: Low to High') }}</option>
              <option value="priceHigh">{{ t('Price: High to Low') }}</option>
              <option value="name">{{ t('Name A-Z') }}</option>
              <option value="brand">{{ t('Brand') }}</option>
            </select>
          </div>
        </div>

        <!-- Wishlist Grid - 2 Cards on Mobile -->
        <div class="wishlist-grid">
          <div
            v-for="item in sortedItems"
            :key="item.id"
            class="wishlist-card"
          >
            <!-- Product Image -->
            <div class="card-image">
              <router-link :to="`/product/${item.slug}`">
                <img
                  :src="item.imageUrl"
                  :alt="getItemName(item)"
                  class="product-image"
                  loading="lazy"
                  @error="handleImageError"
                />
              </router-link>
              
              <!-- Remove Button -->
              <button
                @click="wishlistStore.removeFromWishlist(item.id)"
                class="remove-btn"
                :title="t('Remove from wishlist')"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <!-- Stock Status -->
              <div v-if="item.stockStatus" class="stock-badge" :class="item.stockStatus">
                {{ getStockText(item.stockStatus) }}
              </div>

              <!-- Select Checkbox -->
              <div class="select-checkbox">
                <input
                  type="checkbox"
                  :id="`select-${item.id}`"
                  v-model="wishlistStore.selectedItems"
                  :value="item.id"
                  class="checkbox"
                />
              </div>
            </div>

            <!-- Product Info -->
            <div class="card-content">
              <div class="card-header">
                <div>
                  <router-link 
                    :to="`/product/${item.slug}`"
                    class="product-name"
                  >
                    {{ getItemName(item) }}
                  </router-link>
                  <p class="product-brand">{{ item.brand }}</p>
                  <p class="product-specs">{{ item.size }} • {{ item.concentration }}</p>
                </div>
                
                <button
                  @click="toggleNotes(item.id)"
                  class="info-btn"
                  :title="t('View notes')"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>
              </div>

              <!-- Price and Add to Cart - Mobile Optimized -->
              <div class="price-section">
                <div class="price-info">
                  <span class="current-price">{{ formatPrice(item.price) }}</span>
                  <span v-if="item.originalPrice && item.originalPrice > item.price" class="original-price">
                    {{ formatPrice(item.originalPrice) }}
                  </span>
                </div>
                
                <!-- Add to Cart Button -->
                <button
                  @click="addToCart(item)"
                  :disabled="item.stockStatus === 'out_of_stock' || cartStore.isLoading"
                  class="add-to-cart-btn"
                  :class="{ 'disabled': item.stockStatus === 'out_of_stock' }"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span class="btn-text">{{ t('Add') }}</span>
                  <span v-if="cartStore.isLoading" class="loader-sm"></span>
                </button>
              </div>

              <!-- Fragrance Notes (Collapsible) - Hidden on Mobile -->
              <div v-if="expandedItems.includes(item.id) && !isMobile" class="notes-section">
                <h4>{{ t('Fragrance Notes') }}</h4>
                <div class="notes-list">
                  <div v-if="item.notes?.top?.length" class="note-group">
                    <span class="note-label">{{ t('Top') }}:</span>
                    <span>{{ item.notes.top.join(', ') }}</span>
                  </div>
                  <div v-if="item.notes?.heart?.length" class="note-group">
                    <span class="note-label">{{ t('Heart') }}:</span>
                    <span>{{ item.notes.heart.join(', ') }}</span>
                  </div>
                  <div v-if="item.notes?.base?.length" class="note-group">
                    <span class="note-label">{{ t('Base') }}:</span>
                    <span>{{ item.notes.base.join(', ') }}</span>
                  </div>
                </div>
              </div>

              <!-- Date Added - Hidden on Mobile -->
              <div class="date-added desktop-only">
                {{ t('Added on') }} {{ formatDate(item.dateAdded) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Share Wishlist - Mobile Optimized -->
        <div class="share-section">
          <div class="share-content">
            <h3>{{ t('Share Your Wishlist') }}</h3>
            <p>{{ t('Let friends and family know what you love') }}</p>
          </div>
          <div class="share-actions">
            <button
              @click="shareWishlist"
              class="share-btn primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              {{ t('Share') }}
            </button>
            <button
              @click="printWishlist"
              class="share-btn secondary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              {{ t('Print') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal - Mobile Optimized -->
    <div v-if="showShareModal" class="modal-overlay" @click="showShareModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ t('Share Wishlist') }}</h2>
          <button @click="showShareModal = false" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Share Link -->
          <div class="share-link-section">
            <label>{{ t('Shareable Link') }}</label>
            <div class="link-input-group">
              <input
                type="text"
                readonly
                :value="shareableLink"
                class="link-input"
              />
              <button
                @click="copyLink"
                class="copy-btn"
              >
                {{ copied ? t('Copied!') : t('Copy') }}
              </button>
            </div>
            <p class="link-hint">{{ t('Anyone with this link can view your wishlist') }}</p>
          </div>

          <!-- Privacy Settings -->
          <div class="privacy-section">
            <h4>{{ t('Privacy Settings') }}</h4>
            <p>{{ t('Control who can see your wishlist') }}</p>
            <select
              v-model="privacySetting"
              @change="updatePrivacy"
              class="privacy-select"
            >
              <option value="private">{{ t('Private (Only Me)') }}</option>
              <option value="shared">{{ t('Shared with Link') }}</option>
              <option value="public">{{ t('Public') }}</option>
            </select>
            <p v-if="!authStore.isAuthenticated" class="login-hint">
              {{ t('Sign in to share your wishlist') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductsStore } from '@/stores/products'
import SEOHead from '@/components/UI/SEOHead.vue'
import { showNotification } from '@/utils/notifications'

const router = useRouter()
const languageStore = useLanguageStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productsStore = useProductsStore()

// Use storeToRefs for reactive language refs
const { currentLanguage, isRTL } = storeToRefs(languageStore)
const { t } = languageStore // t is a function, not a ref

// Local state
const expandedItems = ref<string[]>([])
const selectAll = ref(false)
const sortBy = ref('dateAdded')
const showShareModal = ref(false)
const shareableLink = ref('')
const privacySetting = ref(wishlistStore.privacySetting)
const copied = ref(false)
const isMobile = ref(window.innerWidth < 768)
let copyTimeout: NodeJS.Timeout | null = null

// Computed
const sortedItems = computed(() => {
  const items = [...wishlistStore.items]
  
  switch (sortBy.value) {
    case 'priceLow':
      return items.sort((a, b) => a.price - b.price)
    case 'priceHigh':
      return items.sort((a, b) => b.price - a.price)
    case 'name':
      return items.sort((a, b) => {
        const nameA = getItemName(a)
        const nameB = getItemName(b)
        return nameA.localeCompare(nameB)
      })
    case 'brand':
      return items.sort((a, b) => {
        const brandA = a.brand || ''
        const brandB = b.brand || ''
        return brandA.localeCompare(brandB)
      })
    case 'dateAdded':
    default:
      return items.sort((a, b) => {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
        return dateB - dateA
      })
  }
})

// Helper function to safely get item name
const getItemName = (item: any) => {
  return item.name?.[currentLanguage.value] || item.name?.en || item.name?.ar || ''
}

// Methods
const goBack = () => {
  router.back()
}

const formatPrice = (price: number) => {
  if (!price && price !== 0) return 'LE 0'
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('EGP', 'LE ')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString(currentLanguage.value === 'ar' ? 'ar-EG' : 'en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (e) {
    return ''
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/default-product.jpg'
}

const getStockText = (status: string) => {
  const texts: Record<string, string> = {
    in_stock: t('In Stock'),
    low_stock: t('Low Stock'),
    out_of_stock: t('Out of Stock')
  }
  return texts[status] || status
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    wishlistStore.selectedItems = wishlistStore.items.map(item => item.id)
  } else {
    wishlistStore.selectedItems = []
  }
}

const toggleNotes = (itemId: string) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemId)
  }
}

const addToCart = (item: any) => {
  if (item.stockStatus === 'out_of_stock') return

  // Fetch full product details from products store
  const fullProduct = productsStore.products.find(p => p.id === item.id)
  
  if (fullProduct) {
    cartStore.addToCart(fullProduct, 1)
    
    showNotification({
      title: t('Added to Cart'),
      message: `${getItemName(item)} ${t('added to cart')}`,
      type: 'success'
    })
  }
}

const moveSelectedToCart = () => {
  wishlistStore.selectedItems.forEach(itemId => {
    const item = wishlistStore.items.find(i => i.id === itemId)
    if (item && item.stockStatus !== 'out_of_stock') {
      addToCart(item)
    }
  })
  
  // Clear selection after moving
  wishlistStore.selectedItems = []
  selectAll.value = false
  
  showNotification({
    title: t('Items Added'),
    message: t('Selected items added to cart'),
    type: 'success'
  })
}

const removeSelected = () => {
  wishlistStore.removeSelected()
  selectAll.value = false
  
  showNotification({
    title: t('Items Removed'),
    message: t('Selected items removed from wishlist'),
    type: 'success'
  })
}

const shareWishlist = async () => {
  if (!authStore.isAuthenticated) {
    showNotification({
      title: t('Sign In Required'),
      message: t('Please sign in to share your wishlist'),
      type: 'info'
    })
    return
  }
  
  try {
    shareableLink.value = await wishlistStore.generateShareableLink(authStore.user?.uid || '')
    showShareModal.value = true
  } catch (error) {
    console.error('Error generating shareable link:', error)
    showNotification({
      title: t('Error'),
      message: t('Failed to generate shareable link'),
      type: 'error'
    })
  }
}

const printWishlist = () => {
  window.print()
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareableLink.value)
    copied.value = true
    
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copied.value = false
    }, 2000)
    
    showNotification({
      title: t('Copied!'),
      message: t('Link copied to clipboard'),
      type: 'success'
    })
  } catch (err) {
    console.error('Failed to copy link:', err)
    showNotification({
      title: t('Error'),
      message: t('Failed to copy link'),
      type: 'error'
    })
  }
}

const updatePrivacy = async () => {
  if (!authStore.isAuthenticated) {
    showNotification({
      title: t('Sign In Required'),
      message: t('Please sign in to update privacy settings'),
      type: 'info'
    })
    return
  }
  
  try {
    await wishlistStore.updatePrivacySetting(privacySetting.value as 'private' | 'shared' | 'public')
    showNotification({
      title: t('Privacy Updated'),
      message: t('Your wishlist privacy settings have been updated'),
      type: 'success'
    })
  } catch (error) {
    console.error('Error updating privacy:', error)
    showNotification({
      title: t('Error'),
      message: t('Failed to update privacy settings'),
      type: 'error'
    })
  }
}

// Watch for window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

// Watch for changes in selected items
watch(() => wishlistStore.selectedItems, (newVal) => {
  selectAll.value = newVal.length === wishlistStore.items.length && wishlistStore.items.length > 0
}, { deep: true })

// Lifecycle
onMounted(async () => {
  try {
    // Load wishlist from localStorage (guest mode)
    await wishlistStore.loadWishlist()
    
    // Load products if needed for stock status updates
    if (productsStore.products.length === 0) {
      await productsStore.fetchProducts()
    }
    
    // Update stock status based on current product data
    await wishlistStore.updateStockStatus(productsStore.products)
    
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Error loading wishlist:', error)
    showNotification({
      title: t('Error'),
      message: t('Failed to load wishlist'),
      type: 'error'
    })
  }
})

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%);
  padding: 2rem 1rem;
  padding-top: calc(80px + 2rem);
}

.wishlist-page.rtl {
  direction: rtl;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: rgba(26, 18, 11, 0.7);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
  flex-shrink: 0;
}

.back-button:hover {
  color: #ec4899;
}

.back-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.title-wrapper {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 400;
  color: #1a120b;
  letter-spacing: 2px;
  font-family: 'Georgia', 'Times New Roman', serif;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #ec4899, #db2777);
}

.page-subtitle {
  color: rgba(26, 18, 11, 0.7);
  font-size: 1rem;
  margin-top: 1rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(236, 72, 153, 0.2);
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-sm {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Empty State */
.empty-wishlist {
  text-align: center;
  padding: 3rem 1.5rem;
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  max-width: 500px;
  margin: 1rem auto;
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  color: rgba(236, 72, 153, 0.3);
}

.empty-wishlist h2 {
  font-size: 1.5rem;
  font-weight: 400;
  color: #1a120b;
  margin-bottom: 0.75rem;
}

.empty-wishlist p {
  color: rgba(26, 18, 11, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.shop-link {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.shop-link.primary {
  background: #ec4899;
  color: white;
  border: 1px solid #ec4899;
}

.shop-link.primary:hover {
  background: #db2777;
  border-color: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
}

/* Stats Wrapper - Mobile Scrollable */
.stats-wrapper {
  margin-bottom: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.stats-wrapper::-webkit-scrollbar {
  display: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 1rem;
  padding: 0.25rem;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(4, 140px);
  }
}

.stat-card {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  padding: 1.25rem 1rem;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(26, 18, 11, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  white-space: nowrap;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a120b;
  line-height: 1.2;
}

.stat-value.price {
  color: #ec4899;
}

.stat-value.in-stock {
  color: #10b981;
}

.stat-value.low-stock {
  color: #f59e0b;
}

/* Action Bar - Mobile Optimized */
.action-bar {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.action-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  flex: 1;
}

.select-all {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: rgba(26, 18, 11, 0.7);
  font-size: 0.9rem;
}

.select-all-text {
  white-space: nowrap;
}

.checkbox {
  width: 18px;
  height: 18px;
  accent-color: #ec4899;
}

.selected-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.selected-count {
  font-size: 0.85rem;
  color: rgba(26, 18, 11, 0.6);
  background: rgba(236, 72, 153, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  white-space: nowrap;
}

.selected-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn .btn-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 480px) {
  .action-btn .btn-text {
    display: none;
  }
  
  .action-btn {
    padding: 0.5rem;
  }
  
  .action-btn .btn-icon {
    width: 18px;
    height: 18px;
    margin: 0;
  }
}

.action-btn.primary {
  background: #ec4899;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.action-btn.danger {
  background: #ef4444;
  color: white;
}

.action-btn.danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(236, 72, 153, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.sort-label {
  font-size: 0.8rem;
  color: rgba(26, 18, 11, 0.6);
  white-space: nowrap;
}

.sort-select {
  padding: 0.5rem 1.5rem 0.5rem 0.5rem;
  border: 1px solid rgba(236, 72, 153, 0.2);
  background: white;
  font-size: 0.8rem;
  color: #1a120b;
  cursor: pointer;
  border-radius: 4px;
  min-width: 120px;
}

/* Wishlist Grid - 2 Cards on Mobile */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Tablet: 2 columns */
@media (max-width: 1024px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

/* Mobile: 2 columns */
@media (max-width: 640px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

/* Small Mobile: still 2 columns */
@media (max-width: 380px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

.wishlist-card {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  transition: all 0.3s;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  height: fit-content;
}

.wishlist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.15);
}

.card-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #faf7f2;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.wishlist-card:hover .product-image {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #ef4444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.remove-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.stock-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 20px;
  z-index: 2;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .stock-badge {
    font-size: 0.55rem;
    padding: 0.15rem 0.4rem;
  }
}

.stock-badge.in_stock {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.stock-badge.low_stock {
  background: rgba(245, 158, 11, 0.95);
  color: white;
}

.stock-badge.out_of_stock {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

.select-checkbox {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.4rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.select-checkbox .checkbox {
  width: 16px;
  height: 16px;
  display: block;
}

.card-content {
  padding: 1rem;
}

@media (max-width: 640px) {
  .card-content {
    padding: 0.75rem;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a120b;
  text-decoration: none;
  display: block;
  margin-bottom: 0.2rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 640px) {
  .product-name {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }
}

.product-name:hover {
  color: #ec4899;
}

.product-brand {
  font-size: 0.75rem;
  color: rgba(26, 18, 11, 0.6);
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  .product-brand {
    font-size: 0.7rem;
  }
}

.product-specs {
  font-size: 0.7rem;
  color: rgba(26, 18, 11, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  .product-specs {
    font-size: 0.65rem;
  }
}

.info-btn {
  background: none;
  border: none;
  color: rgba(26, 18, 11, 0.4);
  cursor: pointer;
  padding: 0.4rem;
  transition: all 0.3s;
  border-radius: 50%;
  flex-shrink: 0;
}

.info-btn:hover {
  color: #ec4899;
  background: rgba(236, 72, 153, 0.1);
}

.info-btn svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .info-btn svg {
    width: 16px;
    height: 16px;
  }
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1rem;
  font-weight: 700;
  color: #ec4899;
}

@media (max-width: 640px) {
  .current-price {
    font-size: 0.9rem;
  }
}

.original-price {
  font-size: 0.7rem;
  color: rgba(26, 18, 11, 0.4);
  text-decoration: line-through;
}

.add-to-cart-btn {
  background: #ec4899;
  color: white;
  border: none;
  padding: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 6px;
  flex-shrink: 0;
}

@media (min-width: 641px) {
  .add-to-cart-btn {
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 640px) {
  .add-to-cart-btn .btn-text {
    display: none;
  }
  
  .add-to-cart-btn {
    padding: 0.4rem;
  }
  
  .add-to-cart-btn svg {
    width: 16px;
    height: 16px;
    margin: 0;
  }
}

.add-to-cart-btn:hover:not(.disabled) {
  background: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.add-to-cart-btn.disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.add-to-cart-btn svg {
  width: 14px;
  height: 14px;
}

/* Notes Section - Desktop only */
.notes-section {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(236, 72, 153, 0.1);
}

.notes-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.5rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.note-group {
  font-size: 0.75rem;
  color: rgba(26, 18, 11, 0.7);
  line-height: 1.5;
}

.note-label {
  font-weight: 600;
  color: #ec4899;
  margin-right: 0.5rem;
}

.rtl .note-label {
  margin-right: 0;
  margin-left: 0.5rem;
}

/* Date Added - Desktop only */
.date-added {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(236, 72, 153, 0.1);
  font-size: 0.65rem;
  color: rgba(26, 18, 11, 0.4);
  text-align: right;
}

.rtl .date-added {
  text-align: left;
}

.desktop-only {
  display: block;
}

@media (max-width: 640px) {
  .desktop-only {
    display: none;
  }
}

/* Share Section - Mobile Optimized */
.share-section {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  padding: 1.5rem;
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

@media (max-width: 640px) {
  .share-section {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }
}

.share-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.25rem;
}

.share-content p {
  color: rgba(26, 18, 11, 0.6);
  font-size: 0.85rem;
}

.share-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
}

.share-btn.primary {
  background: #ec4899;
  color: white;
}

.share-btn.primary:hover:not(:disabled) {
  background: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.share-btn.secondary {
  background: white;
  color: #1a120b;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.share-btn.secondary:hover {
  border-color: #ec4899;
  color: #ec4899;
  transform: translateY(-2px);
}

.share-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.share-btn svg {
  width: 18px;
  height: 18px;
}

/* Modal - Mobile Optimized */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(236, 72, 153, 0.15);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid rgba(236, 72, 153, 0.1);
}

.modal-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a120b;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(26, 18, 11, 0.4);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s;
  border-radius: 50%;
}

.modal-close:hover {
  color: #ec4899;
  transform: rotate(90deg);
  background: rgba(236, 72, 153, 0.1);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.25rem;
}

/* Share Link Section */
.share-link-section {
  margin-bottom: 1.5rem;
}

.share-link-section label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.5rem;
}

.link-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .link-input-group {
    flex-direction: column;
  }
}

.link-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(236, 72, 153, 0.2);
  font-size: 0.8rem;
  color: #1a120b;
  background: rgba(236, 72, 153, 0.05);
  border-radius: 8px;
  min-width: 0;
}

.copy-btn {
  padding: 0.75rem 1.5rem;
  background: #ec4899;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .copy-btn {
    width: 100%;
  }
}

.copy-btn:hover {
  background: #db2777;
}

.link-hint {
  font-size: 0.7rem;
  color: rgba(26, 18, 11, 0.5);
}

/* Privacy Section */
.privacy-section {
  border-top: 1px solid rgba(236, 72, 153, 0.1);
  padding-top: 1.25rem;
}

.privacy-section h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.25rem;
}

.privacy-section p {
  font-size: 0.75rem;
  color: rgba(26, 18, 11, 0.6);
  margin-bottom: 0.75rem;
}

.privacy-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(236, 72, 153, 0.2);
  font-size: 0.85rem;
  color: #1a120b;
  background: white;
  cursor: pointer;
  border-radius: 8px;
}

.login-hint {
  margin-top: 0.5rem;
  color: #ec4899;
  font-size: 0.75rem;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .wishlist-page {
    padding: 1rem;
    padding-top: calc(60px + 1rem);
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .empty-icon {
    width: 80px;
    height: 80px;
  }
  
  .empty-wishlist h2 {
    font-size: 1.25rem;
  }
  
  .empty-wishlist p {
    font-size: 0.85rem;
  }
  
  .shop-link {
    padding: 0.75rem 1.5rem;
    font-size: 0.85rem;
  }
}

/* RTL Support */
.rtl .select-checkbox {
  left: auto;
  right: 0.5rem;
}

.rtl .stock-badge {
  left: auto;
  right: 0.5rem;
}

.rtl .remove-btn {
  right: auto;
  left: 0.5rem;
}

.rtl .action-btn svg,
.rtl .share-btn svg {
  margin-left: 0.5rem;
  margin-right: 0;
}

.rtl .note-label {
  margin-right: 0;
  margin-left: 0.5rem;
}

.rtl .date-added {
  text-align: left;
}

/* Print Styles */
@media print {
  .action-bar,
  .share-section,
  .remove-btn,
  .select-checkbox,
  .add-to-cart-btn,
  .info-btn,
  .stats-wrapper,
  .desktop-only {
    display: none !important;
  }
  
  .wishlist-page {
    background: white;
    padding: 1rem;
    padding-top: 1rem;
  }
  
  .wishlist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .wishlist-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #ddd;
    box-shadow: none;
  }
  
  .page-title::after {
    display: none;
  }
}
</style>