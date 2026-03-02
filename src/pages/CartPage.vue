<template>
  <div class="cart-page" :class="{ 'rtl': isRTL, 'dark-mode': isDarkMode }">
    <SEOHead 
      :title="t('Shopping Cart')"
      :description="t('Review your selected luxury perfumes')"
    />

    <div class="container">
      <!-- Header with back button for all devices -->
      <div class="cart-header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>{{ t('Back') }}</span>
        </button>
        <h1 class="page-title">{{ t('Shopping Cart') }}</h1>
        <div class="header-spacer"></div>
      </div>

      <!-- Loading State -->
      <div v-if="cartStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('Loading cart...') }}</p>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartStore.isEmpty" class="empty-cart">
        <div class="empty-cart-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h2>{{ t('Your cart is empty') }}</h2>
        <p>{{ t('Looks like you haven\'t added any perfumes to your cart yet. Start exploring our collection!') }}</p>
        <div class="empty-cart-actions">
          <router-link to="/shop" class="shop-link primary">
            {{ t('Shop Now') }}
          </router-link>
          <router-link to="/offers" class="shop-link secondary">
            {{ t('View Offers') }}
          </router-link>
        </div>
      </div>

      <!-- Cart with Items -->
      <div v-else class="cart-content">
        <!-- Mobile Cart Summary - Sticky -->
        <div class="mobile-cart-summary mobile-only">
          <div class="summary-item">
            <span class="summary-label">{{ t('Items') }}</span>
            <span class="summary-value">{{ cartStore.totalItems }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ t('Subtotal') }}</span>
            <span class="summary-value">{{ cartStore.formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div class="summary-item total">
            <span class="summary-label">{{ t('Total') }}</span>
            <span class="summary-value">{{ cartStore.formatPrice(cartStore.total) }}</span>
          </div>
        </div>

        <div class="cart-grid">
          <!-- Cart Items -->
          <div class="cart-items-section">
            <div class="cart-items-header desktop-only">
              <div class="header-product">{{ t('Product') }}</div>
              <div class="header-price">{{ t('Price') }}</div>
              <div class="header-quantity">{{ t('Quantity') }}</div>
              <div class="header-total">{{ t('Total') }}</div>
            </div>

            <div class="cart-items-list">
              <LuxuryCartItem 
                v-for="item in cartStore.luxuryItems" 
                :key="item.id"
                :item="item"
                @update-quantity="handleUpdateQuantity"
                @remove="cartStore.removeFromCart"
              />
            </div>

            <!-- Cart Actions -->
            <div class="cart-actions">
              <router-link to="/shop" class="action-link continue-shopping">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <span>{{ t('Continue Shopping') }}</span>
              </router-link>
              <button
                @click="handleClearCart"
                class="action-link clear-cart"
                :disabled="cartStore.isLoading"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                <span>{{ t('Clear Cart') }}</span>
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary-section">
            <div class="order-summary">
              <h2>{{ t('Order Summary') }}</h2>

              <div class="summary-details">
                <div class="summary-row">
                  <span class="row-label">{{ t('Subtotal') }}</span>
                  <span class="row-value">{{ cartStore.formatPrice(cartStore.subtotal) }}</span>
                </div>
                <div class="summary-row">
                  <span class="row-label">{{ t('Shipping') }}</span>
                  <span class="row-value" :class="{ 'free-shipping': cartStore.shipping === 0 }">
                    {{ cartStore.shipping === 0 ? t('FREE') : cartStore.formatPrice(cartStore.shipping) }}
                  </span>
                </div>
                <div v-if="cartStore.tax > 0" class="summary-row">
                  <span class="row-label">{{ t('Tax') }} (14% VAT)</span>
                  <span class="row-value">{{ cartStore.formatPrice(cartStore.tax) }}</span>
                </div>
                
                <!-- Savings (if any) -->
                <div v-if="savings > 0" class="summary-row savings">
                  <span class="row-label">{{ t('You Save') }}</span>
                  <span class="row-value">{{ cartStore.formatPrice(savings) }}</span>
                </div>

                <div class="summary-total">
                  <span class="total-label">{{ t('Total') }}</span>
                  <span class="total-value">{{ cartStore.formatPrice(cartStore.total) }}</span>
                </div>
                
                <p class="tax-note">{{ t('Including 14% VAT where applicable') }}</p>
              </div>

              <!-- Free Shipping Progress - Egyptian Threshold 5000 EGP -->
              <div v-if="!cartStore.hasFreeShipping" class="shipping-progress">
                <div class="progress-info">
                  <span class="progress-label">{{ t('Free Shipping Progress') }}</span>
                  <span class="progress-amount">{{ cartStore.formatPrice(shippingProgress.remaining) }}</span>
                </div>
                <div class="progress-text">
                  {{ t('Add') }} {{ cartStore.formatPrice(shippingProgress.remaining) }} {{ t('more for free shipping!') }}
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: `${shippingProgress.percentage}%` }"
                  />
                </div>
                <div class="progress-labels">
                  <span>{{ cartStore.formatPrice(0) }}</span>
                  <span>{{ cartStore.formatPrice(shippingProgress.threshold) }}</span>
                </div>
              </div>
              <div v-else class="free-shipping-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ t('You qualify for free shipping!') }}</span>
              </div>

              <!-- Checkout Button -->
              <button
                @click="proceedToCheckout"
                class="checkout-btn"
                :disabled="cartStore.isEmpty || cartStore.isLoading"
              >
                <span v-if="!cartStore.isLoading">{{ t('Proceed to Checkout') }}</span>
                <span v-else class="loading-spinner"></span>
              </button>

              <!-- Payment Methods -->
              <div class="payment-methods">
                <p>{{ t('Secure Payment') }}</p>
                <div class="payment-icons">
                  <span>💳</span>
                  <span>🔒</span>
                  <span>🛡️</span>
                </div>
              </div>

              <!-- Guarantees - Updated for Egyptian market -->
              <div class="guarantees">
                <div class="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ t('14-day return policy') }}</span>
                </div>
                <div class="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ t('Free shipping over 5,000 EGP') }}</span>
                </div>
                <div class="guarantee-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ t('Secure checkout with SSL') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Components -->
    <LuxuryCartSidebar />
    <CartDrawer v-if="cartStore.isOpen" @close="cartStore.closeCart" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { useHomepageStore } from '@/stores/homepage'
import { useAuthStore } from '@/stores/auth'
import SEOHead from '@/components/UI/SEOHead.vue'
import LuxuryCartItem from '@/components/Cart/LuxuryCartItem.vue'
import LuxuryCartSidebar from '@/components/Cart/LuxuryCartSidebar.vue'
import CartDrawer from '@/components/Cart/CartDrawer.vue'
import { authNotification } from '@/utils/notifications'

const router = useRouter()
const languageStore = useLanguageStore()
const cartStore = useCartStore()
const homepageStore = useHomepageStore()
const authStore = useAuthStore()

const { isRTL, t } = languageStore

// Dark mode from homepage settings
const isDarkMode = computed(() => homepageStore.homepageData?.settings?.isDarkMode || false)

// Get free shipping progress from store
const shippingProgress = computed(() => cartStore.getFreeShippingProgress())

// Calculate savings using store method
const savings = computed(() => cartStore.calculateSavings())

// Handle quantity updates
const handleUpdateQuantity = (id: string, quantity: number) => {
  if (quantity >= 1 && quantity <= 10) {
    cartStore.updateQuantity(id, quantity)
  }
}

// Handle clear cart with confirmation
const handleClearCart = async () => {
  await cartStore.clearCart()
}

// Proceed to checkout - Redirect to checkout page
const proceedToCheckout = () => {
  const summary = cartStore.getCartSummary()
  console.log('Proceeding to checkout with:', summary)
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Store cart in localStorage before redirecting to login
    localStorage.setItem('redirect_after_login', '/checkout')
    authNotification.loggedIn(t('Please sign in to continue with checkout'))
    router.push('/login')
    return
  }
  
  // Redirect to checkout page
  router.push('/checkout')
}

// Go back to previous page with fallback based on auth status
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    // Fallback based on authentication
    if (authStore.isAuthenticated) {
      router.push('/account')
    } else {
      router.push('/shop')
    }
  }
}

// Initialize cart on mount
onMounted(() => {
  cartStore.restoreCart()
})
</script>

<style scoped>
/* ========== CART PAGE STYLES ========== */
.cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%);
  padding: 2rem 1rem;
  padding-top: calc(80px + 2rem);
  font-family: 'Georgia', 'Times New Roman', serif;
}

.cart-page.rtl {
  direction: rtl;
}

.cart-page.dark-mode {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== CART HEADER ===== */
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid rgba(212, 175, 55, 0.15);
  color: rgba(26, 18, 11, 0.7);
  cursor: pointer;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  min-height: 48px;
  background: rgba(212, 175, 55, 0.05);
}

.dark-mode .back-button {
  color: rgba(244, 231, 193, 0.7);
  background: rgba(212, 175, 55, 0.1);
}

.back-button:hover {
  color: #d4af37;
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  transform: translateX(-4px);
}

.rtl .back-button:hover {
  transform: translateX(4px);
}

.back-button svg {
  width: 18px;
  height: 18px;
}

.header-spacer {
  width: 120px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 400;
  color: #1a120b;
  letter-spacing: 2px;
  font-family: 'Georgia', 'Times New Roman', serif;
  margin: 0;
  text-align: center;
  position: relative;
  display: inline-block;
}

.dark-mode .page-title {
  color: #f4e7c1;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, #b8941f);
}

/* ===== LOADING STATE ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== EMPTY CART ===== */
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1px solid rgba(212, 175, 55, 0.15);
  max-width: 600px;
  margin: 2rem auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.dark-mode .empty-cart {
  background: #1a1a1a;
  border-color: rgba(212, 175, 55, 0.2);
}

.empty-cart-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  color: rgba(212, 175, 55, 0.3);
}

.empty-cart h2 {
  font-size: 2rem;
  font-weight: 400;
  color: #1a120b;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.dark-mode .empty-cart h2 {
  color: #f4e7c1;
}

.empty-cart p {
  color: rgba(26, 18, 11, 0.7);
  margin-bottom: 2rem;
  line-height: 1.8;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1rem;
}

.dark-mode .empty-cart p {
  color: rgba(244, 231, 193, 0.7);
}

.empty-cart-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.shop-link {
  display: inline-block;
  padding: 1rem 2rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  text-decoration: none;
  min-height: 48px;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.shop-link.primary {
  background: #d4af37;
  color: #0a0a0a;
  border: 1px solid #d4af37;
}

.shop-link.primary:hover {
  background: #b8941f;
  border-color: #b8941f;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.shop-link.secondary {
  background: transparent;
  color: #1a120b;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.dark-mode .shop-link.secondary {
  color: #f4e7c1;
}

.shop-link.secondary:hover {
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
}

/* ===== MOBILE CART SUMMARY ===== */
.mobile-cart-summary {
  background: #ffffff;
  border: 1px solid rgba(212, 175, 55, 0.15);
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-around;
  position: sticky;
  top: 80px;
  z-index: 20;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.dark-mode .mobile-cart-summary {
  background: #1a1a1a;
  border-color: rgba(212, 175, 55, 0.2);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(26, 18, 11, 0.7);
  flex: 1;
}

.dark-mode .summary-item {
  color: rgba(244, 231, 193, 0.7);
}

.summary-item.total {
  color: #1a120b;
  font-weight: 600;
}

.dark-mode .summary-item.total {
  color: #f4e7c1;
}

.summary-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(26, 18, 11, 0.5);
}

.dark-mode .summary-label {
  color: rgba(244, 231, 193, 0.5);
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #d4af37;
}

/* ===== CART GRID ===== */
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== CART ITEMS SECTION ===== */
.cart-items-section {
  background: #ffffff;
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.dark-mode .cart-items-section {
  background: #1a1a1a;
  border-color: rgba(212, 175, 55, 0.2);
}

.cart-items-header {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr;
  padding: 1rem 1.5rem;
  background: rgba(212, 175, 55, 0.05);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  font-weight: 600;
  color: #1a120b;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.dark-mode .cart-items-header {
  background: rgba(212, 175, 55, 0.1);
  color: #f4e7c1;
}

.rtl .cart-items-header {
  direction: rtl;
}

.cart-items-list {
  padding: 1rem 0;
}

/* ===== CART ACTIONS ===== */
.cart-actions {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.15);
  flex-wrap: wrap;
  gap: 1rem;
  background: rgba(212, 175, 55, 0.02);
}

.dark-mode .cart-actions {
  background: rgba(212, 175, 55, 0.05);
}

.action-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(26, 18, 11, 0.7);
  text-decoration: none;
  transition: all 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  min-height: 48px;
  border: 1px solid rgba(212, 175, 55, 0.15);
  background: rgba(212, 175, 55, 0.05);
}

.dark-mode .action-link {
  color: rgba(244, 231, 193, 0.7);
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.2);
}

.action-link:hover {
  color: #d4af37;
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.dark-mode .action-link:hover {
  background: rgba(212, 175, 55, 0.15);
}

.action-link svg {
  width: 18px;
  height: 18px;
}

.clear-cart {
  color: #e53e3e;
  border-color: rgba(229, 62, 62, 0.2);
  background: rgba(229, 62, 62, 0.05);
}

.dark-mode .clear-cart {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.1);
}

.clear-cart:hover:not(:disabled) {
  color: #c53030;
  border-color: #c53030;
  background: rgba(229, 62, 62, 0.1);
}

.dark-mode .clear-cart:hover:not(:disabled) {
  color: #f87171;
  border-color: #f87171;
}

.clear-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== ORDER SUMMARY ===== */
.order-summary-section {
  position: sticky;
  top: 100px;
  align-self: start;
}

@media (max-width: 1024px) {
  .order-summary-section {
    position: static;
  }
}

.order-summary {
  background: #ffffff;
  border: 1px solid rgba(212, 175, 55, 0.15);
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.dark-mode .order-summary {
  background: #1a1a1a;
  border-color: rgba(212, 175, 55, 0.2);
}

.order-summary h2 {
  font-size: 1.5rem;
  font-weight: 400;
  color: #1a120b;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  padding-bottom: 1rem;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.dark-mode .order-summary h2 {
  color: #f4e7c1;
}

.summary-details {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: rgba(26, 18, 11, 0.7);
  font-size: 1rem;
  padding: 0.25rem 0;
}

.dark-mode .summary-row {
  color: rgba(244, 231, 193, 0.7);
}

.rtl .summary-row {
  direction: rtl;
}

.row-value {
  font-weight: 500;
  color: #1a120b;
}

.dark-mode .row-value {
  color: #f4e7c1;
}

.free-shipping {
  color: #10b981;
}

.savings {
  color: #10b981;
  font-weight: 500;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(212, 175, 55, 0.2);
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a120b;
}

.dark-mode .summary-total {
  color: #f4e7c1;
}

.total-value {
  color: #d4af37;
  font-size: 1.4rem;
}

.tax-note {
  font-size: 0.8rem;
  color: rgba(26, 18, 11, 0.5);
  margin-top: 0.5rem;
  text-align: right;
  font-style: italic;
}

.dark-mode .tax-note {
  color: rgba(244, 231, 193, 0.5);
}

.rtl .tax-note {
  text-align: left;
}

/* ===== SHIPPING PROGRESS ===== */
.shipping-progress {
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.dark-mode .shipping-progress {
  background: rgba(212, 175, 55, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: rgba(26, 18, 11, 0.8);
}

.dark-mode .progress-info {
  color: rgba(244, 231, 193, 0.8);
}

.progress-amount {
  color: #d4af37;
  font-weight: 600;
}

.progress-text {
  font-size: 0.85rem;
  color: rgba(26, 18, 11, 0.6);
  margin-bottom: 0.75rem;
}

.dark-mode .progress-text {
  color: rgba(244, 231, 193, 0.6);
}

.progress-bar {
  height: 4px;
  background: rgba(212, 175, 55, 0.1);
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #b8941f);
  transition: width 0.3s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: rgba(26, 18, 11, 0.4);
}

.dark-mode .progress-labels {
  color: rgba(244, 231, 193, 0.4);
}

.free-shipping-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 2rem 0;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-weight: 500;
}

.free-shipping-badge svg {
  width: 20px;
  height: 20px;
}

/* ===== CHECKOUT BUTTON ===== */
.checkout-btn {
  width: 100%;
  background: #d4af37;
  color: #0a0a0a;
  border: none;
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 2rem;
  position: relative;
  min-height: 56px;
  border: 1px solid #d4af37;
}

.checkout-btn:hover:not(:disabled) {
  background: #b8941f;
  border-color: #b8941f;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkout-btn:active {
  transform: translateY(0);
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(10, 10, 10, 0.3);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* ===== PAYMENT METHODS ===== */
.payment-methods {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.payment-methods p {
  font-size: 0.9rem;
  color: rgba(26, 18, 11, 0.6);
  margin-bottom: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.dark-mode .payment-methods p {
  color: rgba(244, 231, 193, 0.6);
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.payment-icons span {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* ===== GUARANTEES ===== */
.guarantees {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guarantee-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(26, 18, 11, 0.7);
  font-size: 0.9rem;
  padding: 0.5rem 0;
  border-bottom: 1px dashed rgba(212, 175, 55, 0.1);
}

.dark-mode .guarantee-item {
  color: rgba(244, 231, 193, 0.7);
}

.rtl .guarantee-item {
  direction: rtl;
}

.guarantee-item:last-child {
  border-bottom: none;
}

.guarantee-item svg {
  width: 18px;
  height: 18px;
  color: #d4af37;
  flex-shrink: 0;
}

/* ===== UTILITY CLASSES ===== */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

/* ===== MOBILE OPTIMIZATIONS ===== */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
  
  .cart-items-header {
    display: none;
  }
  
  .cart-actions {
    flex-direction: column;
    padding: 1rem;
  }
  
  .action-link {
    width: 100%;
    justify-content: center;
  }

  /* Adjust font sizes for better readability on small screens */
  .page-title {
    font-size: 1.8rem;
  }

  .summary-label {
    font-size: 0.7rem;
  }

  .summary-value {
    font-size: 1rem;
  }

  .order-summary h2 {
    font-size: 1.3rem;
  }

  .summary-row {
    font-size: 0.9rem;
  }

  .total-value {
    font-size: 1.2rem;
  }

  .checkout-btn {
    font-size: 0.9rem;
    padding: 1rem;
  }

  .guarantee-item {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .cart-page {
    padding: 0.75rem;
    padding-top: calc(60px + 0.75rem);
  }
  
  .mobile-cart-summary {
    padding: 0.75rem;
    top: 60px;
  }
  
  .summary-label {
    font-size: 0.6rem;
  }
  
  .summary-value {
    font-size: 0.85rem;
  }
  
  .cart-items-list {
    padding: 0.5rem 0;
  }
  
  .order-summary {
    padding: 1rem;
  }
  
  .summary-row {
    font-size: 0.85rem;
  }
  
  .total-value {
    font-size: 1.1rem;
  }
  
  .checkout-btn {
    padding: 0.9rem;
    font-size: 0.85rem;
    min-height: 44px;
  }
  
  .payment-icons span {
    font-size: 1.1rem;
  }
  
  .guarantee-item {
    font-size: 0.75rem;
  }

  .progress-info {
    font-size: 0.8rem;
  }

  .progress-text {
    font-size: 0.75rem;
  }

  .progress-labels {
    font-size: 0.65rem;
  }

  .free-shipping-badge {
    font-size: 0.9rem;
    padding: 0.75rem;
  }
}

/* Extra small screens */
@media (max-width: 360px) {
  .page-title {
    font-size: 1.5rem;
  }

  .back-button {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }

  .back-button svg {
    width: 16px;
    height: 16px;
  }

  .summary-value {
    font-size: 0.8rem;
  }

  .summary-label {
    font-size: 0.55rem;
  }

  .total-value {
    font-size: 1rem;
  }
}

/* ===== RTL SPECIFIC STYLES ===== */
.rtl .continue-shopping svg {
  transform: rotate(180deg);
}

.rtl .guarantee-item {
  flex-direction: row-reverse;
}

.rtl .back-button svg {
  transform: rotate(180deg);
}

.rtl .back-button:hover {
  transform: translateX(4px);
}

/* ===== TOUCH OPTIMIZATIONS ===== */
@media (max-width: 768px) {
  .back-button,
  .action-link,
  .shop-link,
  .checkout-btn {
    min-height: 48px;
  }
  
  .action-link {
    padding: 0.875rem;
  }
}

/* ===== ACTIVE STATES ===== */
.action-link:active,
.shop-link:active,
.checkout-btn:active {
  transform: scale(0.98);
}
</style>