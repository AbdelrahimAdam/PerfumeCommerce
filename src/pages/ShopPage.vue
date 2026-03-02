<template>
  <div class="min-h-screen bg-white">
    <!-- SEO Head -->
    <SEOHead 
      title="Shop All Perfumes | Luxury Fragrance Store"
      description="Browse our complete collection of luxury perfumes from all brands and categories. Prices in EGP."
      type="website"
    />

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="productsStore.isLoading && productsStore.products.length === 0" class="py-20">
        <div class="flex flex-col items-center justify-center">
          <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">{{ safeLang === 'en' ? 'Loading luxury perfumes...' : 'جاري تحميل العطور الفاخرة...' }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="productsStore.error && productsStore.products.length === 0" class="py-20">
        <div class="text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">
            {{ safeLang === 'en' ? 'Failed to Load Products' : 'فشل في تحميل المنتجات' }}
          </h3>
          <p class="text-gray-600 mb-6">{{ productsStore.error }}</p>
          <button
            @click="retryLoading"
            class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                   transition-colors duration-200 font-medium"
          >
            {{ safeLang === 'en' ? 'Retry' : 'إعادة المحاولة' }}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Header with Back Button -->
        <div class="flex items-center gap-4 mb-4">
          <button
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Go back"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="text-sm">{{ safeLang === 'en' ? 'Back' : 'رجوع' }}</span>
          </button>
        </div>

        <!-- Breadcrumb -->
        <nav class="flex items-center text-sm text-gray-600 mb-8" 
             :class="{ 'flex-row-reverse': isRTL }">
          <router-link to="/" class="hover:text-primary-600 transition-colors">
            {{ safeLang === 'en' ? 'Home' : 'الرئيسية' }}
          </router-link>
          <span class="mx-3">/</span>
          <span class="text-gray-900 font-medium">{{ safeLang === 'en' ? 'Shop All' : 'تسوق الكل' }}</span>
        </nav>

        <!-- Search Bar -->
        <div class="mb-8">
          <div class="relative max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="safeLang === 'en' ? 'Search perfumes by name, brand, or notes...' : 'ابحث عن العطور بالاسم، الماركة، أو النوتات...'"
                class="w-full px-6 py-4 pl-12 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none transition-all duration-200"
                @input="handleSearch"
              />
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Search Results Info -->
            <div v-if="searchQuery && filteredProducts.length > 0" class="mt-3 text-sm text-gray-600">
              <p>
                {{ safeLang === 'en' 
                   ? `Found ${filteredProducts.length} products for "${searchQuery}"`
                   : `تم العثور على ${filteredProducts.length} منتج لـ "${searchQuery}"` }}
              </p>
            </div>
          </div>
        </div>

        <!-- Mobile Filter Toggle and Sort -->
        <div class="lg:hidden flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <button
              @click="toggleMobileFilters"
              class="filter-toggle-btn flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {{ safeLang === 'en' ? 'Filters' : 'الفلاتر' }}
              <span v-if="activeFilters.length > 0" class="bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {{ activeFilters.length }}
              </span>
            </button>
            
            <!-- Active filters badges for mobile -->
            <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2">
              <button
                @click="clearFilters"
                class="text-xs text-gray-600 hover:text-primary-600 flex items-center"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ safeLang === 'en' ? 'Clear' : 'مسح' }}
              </button>
            </div>
          </div>

          <!-- Sort dropdown for mobile -->
          <select
            v-model="filters.sortBy"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 
                   focus:ring-primary-500 focus:border-transparent bg-white"
            @change="handleSortChange"
          >
            <option value="newest">{{ safeLang === 'en' ? 'Newest' : 'الأحدث' }}</option>
            <option value="price-low">{{ safeLang === 'en' ? 'Price ↑' : 'السعر ↑' }}</option>
            <option value="price-high">{{ safeLang === 'en' ? 'Price ↓' : 'السعر ↓' }}</option>
            <option value="rating">{{ safeLang === 'en' ? 'Top Rated' : 'الأعلى تقييماً' }}</option>
            <option value="best-selling">{{ safeLang === 'en' ? 'Best Selling' : 'الأفضل مبيعاً' }}</option>
          </select>
        </div>

        <div class="flex gap-8">
          <!-- Sidebar Filters - Desktop & Mobile Overlay -->
          <div 
            ref="sidebarRef"
            :class="[
              'sidebar-filters lg:block lg:w-1/4',
              showMobileFilters 
                ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:static lg:inset-auto lg:z-auto lg:p-0 lg:overflow-visible' 
                : 'hidden lg:block'
            ]"
          >
            <!-- Mobile filter header -->
            <div v-if="showMobileFilters" class="flex items-center justify-between mb-6 lg:hidden">
              <h2 class="text-xl font-bold">{{ safeLang === 'en' ? 'Filters' : 'الفلاتر' }}</h2>
              <button 
                @click="showMobileFilters = false"
                class="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Categories -->
            <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 class="font-medium text-gray-900 mb-3">
                {{ safeLang === 'en' ? 'Categories' : 'الفئات' }}
              </h3>
              <div class="space-y-1">
                <button
                  @click="updateFilter('category', undefined)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    !filters.category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                  :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
                >
                  {{ safeLang === 'en' ? 'All Categories' : 'جميع الفئات' }}
                </button>
                <button
                  v-for="category in productsStore.categories"
                  :key="category.id"
                  @click="updateFilter('category', category.id)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    filters.category === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                  :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
                >
                  {{ getCategoryName(category) }}
                </button>
              </div>
            </div>

            <!-- NEW: Gender Filter Section -->
            <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 class="font-medium text-gray-900 mb-3">
                {{ safeLang === 'en' ? 'Gender' : 'الجنس' }}
              </h3>
              <div class="space-y-1">
                <button
                  @click="updateFilter('classification', undefined)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    !filters.classification
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'All' : 'الكل' }}
                </button>
                <button
                  @click="updateFilter('classification', 'M')"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    filters.classification === 'M'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'Men' : 'رجال' }}
                </button>
                <button
                  @click="updateFilter('classification', 'F')"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    filters.classification === 'F'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'Women' : 'نساء' }}
                </button>
                <button
                  @click="updateFilter('classification', 'U')"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    filters.classification === 'U'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'Unisex' : 'للجنسين' }}
                </button>
              </div>
            </div>

            <!-- Price Range -->
            <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 class="font-medium text-gray-900 mb-3">
                {{ safeLang === 'en' ? 'Price Range' : 'نطاق السعر' }}
              </h3>
              <div class="space-y-1">
                <button
                  @click="updatePriceRange({ min: undefined, max: undefined })"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    !filters.minPrice && !filters.maxPrice
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'All Prices' : 'جميع الأسعار' }}
                </button>
                <button
                  v-for="range in priceRanges"
                  :key="getLocalizedLabel(range.label)"
                  @click="updatePriceRange(range)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    isPriceRangeSelected(range)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ getLocalizedLabel(range.label) }}
                </button>
              </div>
            </div>

            <!-- Additional Filters -->
            <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 class="font-medium text-gray-900 mb-3">
                {{ safeLang === 'en' ? 'Additional Filters' : 'خيارات إضافية' }}
              </h3>
              <div class="space-y-2">
                <button
                  @click="updateFilter('bestseller', filters.bestseller ? undefined : true)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    filters.bestseller
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'Best Sellers' : 'الأفضل مبيعاً' }}
                </button>

                <button
                  @click="updateFilter('newArrival', filters.newArrival ? undefined : true)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    filters.newArrival
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'New Arrivals' : 'الوصلات الجديدة' }}
                </button>

                <button
                  @click="updateFilter('isFeatured', filters.isFeatured ? undefined : true)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded transition-all duration-200 text-sm',
                    filters.isFeatured
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ safeLang === 'en' ? 'Featured' : 'مميز' }}
                </button>
              </div>
            </div>

            <!-- Clear Filters Button -->
            <button
              @click="clearFilters"
              class="w-full px-4 py-3 text-gray-600 hover:text-primary-600 
                     border border-gray-300 rounded-lg hover:border-primary-500 
                     transition-all duration-200 text-sm font-medium"
            >
              {{ safeLang === 'en' ? 'Clear All Filters' : 'مسح جميع الفلاتر' }}
            </button>

            <!-- Close button for mobile -->
            <div v-if="showMobileFilters" class="mt-6 lg:hidden">
              <button
                @click="showMobileFilters = false"
                class="w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                       transition-colors duration-200 font-medium"
              >
                {{ safeLang === 'en' ? 'Show Products' : 'عرض المنتجات' }}
              </button>
            </div>
          </div>

          <!-- Products Grid -->
          <div :class="['w-full', showMobileFilters ? 'hidden lg:block lg:w-3/4' : 'lg:w-3/4']">
            <!-- Header with counts and sort - Desktop -->
            <div class="hidden lg:flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  {{ safeLang === 'en' ? 'All Products' : 'جميع المنتجات' }}
                  <span class="text-primary-500">({{ filteredProducts.length }})</span>
                </h2>
                <p class="text-gray-600 mt-1">
                  {{ safeLang === 'en' 
                     ? `Showing ${Math.min(visibleCount, filteredProducts.length)} of ${filteredProducts.length} products` 
                     : `عرض ${Math.min(visibleCount, filteredProducts.length)} من أصل ${filteredProducts.length} منتج` }}
                </p>
                <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mt-2">
                  <span v-for="filter in activeFilters" :key="filter.label" class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {{ filter.label }}
                  </span>
                  <button
                    @click="clearFilters"
                    class="text-xs text-gray-600 hover:text-primary-600 flex items-center"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ safeLang === 'en' ? 'Clear' : 'مسح' }}
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <select
                  v-model="filters.sortBy"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent bg-white"
                  @change="handleSortChange"
                >
                  <option value="newest">{{ safeLang === 'en' ? 'Newest First' : 'الأحدث أولاً' }}</option>
                  <option value="price-low">{{ safeLang === 'en' ? 'Price: Low to High' : 'السعر: منخفض إلى مرتفع' }}</option>
                  <option value="price-high">{{ safeLang === 'en' ? 'Price: High to Low' : 'السعر: مرتفع إلى منخفض' }}</option>
                  <option value="rating">{{ safeLang === 'en' ? 'Highest Rated' : 'الأعلى تقييماً' }}</option>
                  <option value="name-asc">{{ safeLang === 'en' ? 'Name: A-Z' : 'الاسم: أ-ي' }}</option>
                  <option value="name-desc">{{ safeLang === 'en' ? 'Name: Z-A' : 'الاسم: ي-أ' }}</option>
                  <option value="popular">{{ safeLang === 'en' ? 'Most Popular' : 'الأكثر شعبية' }}</option>
                  <option value="best-selling">{{ safeLang === 'en' ? 'Best Selling' : 'الأفضل مبيعاً' }}</option>
                </select>
              </div>
            </div>

            <!-- Loading indicator for additional products -->
            <div v-if="productsStore.isFetchingMore" class="text-center py-8">
              <div class="inline-flex items-center text-primary-500">
                <div class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>{{ safeLang === 'en' ? 'Loading more products...' : 'جاري تحميل المزيد من المنتجات...' }}</span>
              </div>
            </div>

            <!-- Products Grid -->
            <div v-if="visibleProducts.length > 0">
              <ProductGrid 
                :products="visibleProducts"
                @view-product="viewProduct"
                @add-to-cart="addToCart"
              />

              <!-- Load More Button -->
              <div v-if="productsStore.hasMore && showLoadMore" class="text-center mt-12">
                <button
                  @click="loadMoreProducts"
                  :disabled="productsStore.isFetchingMore"
                  :class="[
                    'px-8 py-3 rounded-lg transition-colors duration-200 font-medium',
                    productsStore.isFetchingMore
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  ]"
                >
                  <template v-if="productsStore.isFetchingMore">
                    <div class="inline-flex items-center">
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {{ safeLang === 'en' ? 'Loading...' : 'جاري التحميل...' }}
                    </div>
                  </template>
                  <template v-else>
                    {{ safeLang === 'en' ? 'Load More Products' : 'تحميل المزيد من المنتجات' }}
                  </template>
                </button>
              </div>

              <!-- End of Results -->
              <div v-else-if="filteredProducts.length > 0 && !productsStore.hasMore" class="text-center mt-12 pt-8 border-t border-gray-200">
                <p class="text-gray-600">
                  {{ safeLang === 'en' 
                     ? `You've viewed all ${filteredProducts.length} products` 
                     : `لقد شاهدت جميع المنتجات البالغ عددها ${filteredProducts.length} منتج` }}
                </p>
              </div>
            </div>

            <!-- No Products Message -->
            <div v-else class="text-center py-20">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-medium text-gray-900 mb-2">
                {{ safeLang === 'en' ? 'No Products Found' : 'لم يتم العثور على منتجات' }}
              </h3>
              <p class="text-gray-600 mb-6">
                <template v-if="searchQuery">
                  {{ safeLang === 'en' 
                     ? `No products found for "${searchQuery}". Try adjusting your search or filters.` 
                     : `لم يتم العثور على منتجات لـ "${searchQuery}". حاول تعديل البحث أو الفلاتر.` }}
                </template>
                <template v-else>
                  {{ safeLang === 'en' 
                     ? 'Try adjusting your filters or browse all categories.' 
                     : 'حاول تعديل الفلاتر أو تصفح جميع الفئات.' }}
                </template>
              </p>
              <button
                @click="clearFilters"
                class="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                {{ safeLang === 'en' ? 'Clear All Filters' : 'مسح جميع الفلاتر' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductGrid from '@/components/Products/ProductGrid.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product, FilterOptions, Category } from '@/types'

const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const { isRTL } = languageStore
const currentLanguage = computed(() => languageStore.currentLanguage)

// Safe language for indexing (only 'en' or 'ar')
const safeLang = computed(() => {
  const lang = currentLanguage.value
  return lang === 'en' || lang === 'ar' ? lang : 'en'
})

// Helper to get localized name from a category
const getCategoryName = (category: Category): string => {
  return category[safeLang.value] || category.id
}

// Helper to get localized label from a translation object
const getLocalizedLabel = (label: { en: string; ar: string }): string => {
  return label[safeLang.value]
}

// Refs
const sidebarRef = ref<HTMLElement>()
const showMobileFilters = ref(false)
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout>()

// State
const filters = ref<FilterOptions>({
  sortBy: 'newest'
})
const visibleCount = ref(24) // Increased from 12 to 24 to show more products initially
const isInitialLoad = ref(true)

// Price ranges in EGP
const priceRanges = [
  { min: 0, max: 1000, label: { en: 'Under 1000 EGP', ar: 'أقل من 1000 جنيه' } },
  { min: 1000, max: 2000, label: { en: '1000 - 2000 EGP', ar: '1000 - 2000 جنيه' } },
  { min: 2000, max: 5000, label: { en: '2000 - 5000 EGP', ar: '2000 - 5000 جنيه' } },
  { min: 5000, max: 10000, label: { en: '5000 - 10000 EGP', ar: '5000 - 10000 جنيه' } },
  { min: 10000, max: undefined, label: { en: '10000+ EGP', ar: '10000+ جنيه' } }
]

// Computed
const filteredProducts = computed(() => {
  let filtered = productsStore.filterProducts(filters.value)
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(product => 
      product.name.en.toLowerCase().includes(query) ||
      product.name.ar.toLowerCase().includes(query) ||
      product.description.en.toLowerCase().includes(query) ||
      product.description.ar.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.notes.top.some(note => note.toLowerCase().includes(query)) ||
      product.notes.heart.some(note => note.toLowerCase().includes(query)) ||
      product.notes.base.some(note => note.toLowerCase().includes(query))
    )
  }
  
  return filtered
})

const visibleProducts = computed(() => {
  return filteredProducts.value.slice(0, visibleCount.value)
})

const showLoadMore = computed(() => {
  return visibleCount.value < filteredProducts.value.length
})

const activeFilters = computed(() => {
  const active: Array<{ label: string, value: any }> = []
  
  if (filters.value.category) {
    const category = productsStore.getCategoryById(filters.value.category)
    if (category) {
      active.push({ 
        label: `${safeLang.value === 'en' ? 'Category' : 'الفئة'}: ${getCategoryName(category)}`, 
        value: filters.value.category 
      })
    }
  }
  
  if (filters.value.classification) {
    const genderMap: Record<string, string> = {
      M: safeLang.value === 'en' ? 'Men' : 'رجال',
      F: safeLang.value === 'en' ? 'Women' : 'نساء',
      U: safeLang.value === 'en' ? 'Unisex' : 'للجنسين'
    }
    active.push({ 
      label: `${safeLang.value === 'en' ? 'Gender' : 'الجنس'}: ${genderMap[filters.value.classification] || filters.value.classification}`, 
      value: filters.value.classification 
    })
  }
  
  if (filters.value.minPrice !== undefined || filters.value.maxPrice !== undefined) {
    const min = filters.value.minPrice ?? 0
    const max = filters.value.maxPrice ?? Infinity
    const range = priceRanges.find(r => r.min === min && r.max === max)
    active.push({ 
      label: range ? getLocalizedLabel(range.label) : `${safeLang.value === 'en' ? 'Price' : 'السعر'}: ${formatPrice(min)} - ${max === Infinity ? '∞' : formatPrice(max)} EGP`, 
      value: { min, max } 
    })
  }
  
  if (filters.value.bestseller) {
    active.push({ 
      label: safeLang.value === 'en' ? 'Best Sellers' : 'الأفضل مبيعاً', 
      value: true 
    })
  }
  
  if (filters.value.newArrival) {
    active.push({ 
      label: safeLang.value === 'en' ? 'New Arrivals' : 'الوصلات الجديدة', 
      value: true 
    })
  }
  
  if (filters.value.isFeatured) {
    active.push({ 
      label: safeLang.value === 'en' ? 'Featured' : 'مميز', 
      value: true 
    })
  }
  
  return active
})

// Methods
const goBack = () => {
  router.back()
}

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
}

const updateFilter = (key: keyof FilterOptions, value: any) => {
  if (key === 'price') {
    // Handle luxury filter special case
    if (value === 1000) {
      filters.value.minPrice = 1000
      filters.value.price = 1000
    } else {
      delete filters.value.minPrice
      delete filters.value.price
    }
  } else {
    filters.value[key] = value
  }
  visibleCount.value = 24 // Reset to first page (now 24)
  
  // Close mobile filters after selection
  if (window.innerWidth < 1024) {
    showMobileFilters.value = false
  }
  
  // Trigger immediate filter update
  productsStore.setFilters({ ...filters.value })
}

const updatePriceRange = (range: { min?: number, max?: number }) => {
  if (range.min === undefined && range.max === undefined) {
    delete filters.value.minPrice
    delete filters.value.maxPrice
    delete filters.value.price
  } else {
    filters.value.minPrice = range.min
    filters.value.maxPrice = range.max
    // Clear luxury filter if using price range
    delete filters.value.price
  }
  visibleCount.value = 24
  
  // Close mobile filters after selection
  if (window.innerWidth < 1024) {
    showMobileFilters.value = false
  }
  
  productsStore.setFilters({ ...filters.value })
}

const isPriceRangeSelected = (range: typeof priceRanges[0]) => {
  return (
    filters.value.minPrice === range.min &&
    (filters.value.maxPrice === range.max || (range.max === undefined && filters.value.maxPrice === undefined))
  )
}

const handleSortChange = () => {
  visibleCount.value = 24
  productsStore.setFilters({ ...filters.value })
}

const clearFilters = () => {
  // Reset to default filters but keep sort preference
  const sortBy = filters.value.sortBy || 'newest'
  filters.value = { sortBy }
  searchQuery.value = ''
  visibleCount.value = 24
  productsStore.resetFilters()
  productsStore.setFilters({ sortBy })
  
  // Close mobile filters
  showMobileFilters.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  visibleCount.value = 24
}

const handleSearch = () => {
  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Set new timeout for debouncing
  searchTimeout.value = setTimeout(() => {
    visibleCount.value = 24
  }, 300)
}

const loadMoreProducts = async () => {
  if (!productsStore.hasMore) return
  
  // First load more products from the store
  await productsStore.loadMoreProducts()
  
  // Then increase visible count
  visibleCount.value += 12
}

const retryLoading = async () => {
  isInitialLoad.value = true
  await productsStore.refreshProducts()
  isInitialLoad.value = false
}

const viewProduct = (product: Product) => {
  router.push(`/product/${product.slug}`)
}

const addToCart = (product: Product, quantity: number = 1) => {
  cartStore.addToCart(product, quantity)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG').format(price)
}

// Click outside handler for mobile filters
const handleClickOutside = (event: MouseEvent) => {
  if (showMobileFilters.value && window.innerWidth < 1024) {
    const target = event.target as HTMLElement
    const sidebar = sidebarRef.value
    const toggleBtn = document.querySelector('.filter-toggle-btn')
    
    if (sidebar && !sidebar.contains(target) && toggleBtn && !toggleBtn.contains(target)) {
      showMobileFilters.value = false
    }
  }
}

// Watch for filter changes to update store filters
watch(filters, (newFilters) => {
  // Don't update store on initial load
  if (isInitialLoad.value) return
  
  // Debounce the filter update
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    productsStore.setFilters({ ...newFilters })
  }, 300)
}, { deep: true })

let filterTimeout: NodeJS.Timeout

// Watch for store filters to sync local filters
watch(
  () => productsStore.filters,
  (newStoreFilters) => {
    // Sync local filters with store filters
    if (!isInitialLoad.value) {
      Object.keys(newStoreFilters).forEach(key => {
        const filterKey = key as keyof FilterOptions
        // Use type assertion to safely assign (we know the values are compatible)
        ;(filters.value as any)[filterKey] = newStoreFilters[filterKey]
      })
    }
  },
  { deep: true }
)

// On mounted
onMounted(async () => {
  // Initialize products store if not already loaded
  if (productsStore.products.length === 0) {
    await productsStore.initialize()
  }
  
  // Set initial filters from store
  const storeFilters = productsStore.filters
  if (storeFilters && Object.keys(storeFilters).length > 0) {
    filters.value = { ...filters.value, ...storeFilters }
  }
  
  isInitialLoad.value = false
  
  // Ensure store has the latest filters
  await nextTick()
  productsStore.setFilters({ ...filters.value })
  
  // Add click outside listener for mobile filters
  document.addEventListener('click', handleClickOutside)
})

// On unmounted, clean up
onUnmounted(() => {
  // Clear any timeouts
  clearTimeout(filterTimeout)
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Remove event listener
  document.removeEventListener('click', handleClickOutside)
  
  // Reset component state
  visibleCount.value = 24
  isInitialLoad.value = true
  showMobileFilters.value = false
})

// Auto-refresh products when language changes
watch(
  () => currentLanguage.value,
  () => {
    // Refresh products with current filters
    if (!isInitialLoad.value && productsStore.products.length > 0) {
      productsStore.refreshProducts()
    }
  }
)

// Close mobile filters on escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showMobileFilters.value) {
    showMobileFilters.value = false
  }
}

// Add escape key listener
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
/* Animation for loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions for filter buttons */
button {
  transition: all 0.2s ease-in-out;
}

/* Mobile sidebar animation */
@media (max-width: 1023px) {
  .sidebar-filters {
    transition: transform 0.3s ease-in-out;
  }
  
  .sidebar-filters:not(.hidden) {
    transform: translateX(0);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
}

/* Search bar styling */
input:focus {
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* Active filter indicator */
.bg-primary-500 {
  position: relative;
}

.bg-primary-500::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  opacity: 0.8;
}

/* RTL support for search */
[dir="rtl"] input {
  padding-left: 3rem;
  padding-right: 3rem;
}

[dir="rtl"] .absolute.left-4 {   
  left: auto;
  right: 1rem;
}

[dir="rtl"] .absolute.right-4 {
  right: auto;
  left: 1rem;
}
</style>