<template>
  <div class="min-h-screen bg-white">
    <SEOHead 
      :title="categoryTitle"
      :description="categoryDescription"
    />
    
    <!-- Category Header - Styled like Homepage Hero Banner -->
    <section class="category-banner">
      <div class="banner-image-wrapper">
        <img 
          :src="categoryImage"
          :alt="categoryName"
          class="hero-image"
          @error="handleImageError"
        />
        <div class="gradient-overlay"></div>
      </div>
      
      <!-- Navigation Links - Top Corner -->
      <div class="banner-container">
        <nav class="flex items-center text-xs md:text-sm text-white/80" 
             :class="{ 'flex-row-reverse': isRTL }">
          <router-link to="/" class="hover:text-white transition-colors">
            {{ t('Home') }}
          </router-link>
          <span class="mx-2 md:mx-3">/</span>
          <span class="text-white font-medium truncate max-w-[150px] md:max-w-none">{{ categoryName }}</span>
        </nav>
      </div>
    </section>

    <!-- Filters & Products -->
    <div class="container mx-auto px-4 py-6 md:py-8 lg:py-12">
      <!-- Mobile Filter Toggle -->
      <div class="flex items-center justify-between mb-4 lg:hidden">
        <div>
          <h2 class="text-xl font-display-en font-bold text-gray-900">
            {{ categoryName }}
          </h2>
          <p v-if="filteredProducts.length" class="text-sm text-gray-600">
            {{ filteredProducts.length }} {{ t('products') }}
          </p>
        </div>
        <button
          @click="showMobileFilters = !showMobileFilters"
          class="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {{ t('Filters') }}
          <span v-if="activeFilterCount" class="bg-white text-primary-600 w-5 h-5 rounded-full text-xs flex items-center justify-center">
            {{ activeFilterCount }}
          </span>
        </button>
      </div>

      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters - Desktop -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="sticky top-24">
            <CategoryFilter 
              :filters="filters"
              @update:filters="updateFilters"
            />
          </div>
        </div>

        <!-- Products Section -->
        <div class="lg:col-span-3">
          <!-- Desktop Header -->
          <div class="hidden lg:flex lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h2 class="text-2xl font-display-en font-bold text-gray-900">
                {{ categoryName }}
              </h2>
              <p v-if="filteredProducts.length" class="text-gray-600 mt-1">
                {{ t('Showing') }} {{ filteredProducts.length }} {{ t('products') }}
              </p>
            </div>
            
            <!-- Sort & View Options -->
            <div class="flex items-center space-x-4" :class="{ 'space-x-reverse': isRTL }">
              <!-- Sort Select -->
              <div class="relative">
                <select
                  v-model="filters.sortBy"
                  class="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                         bg-white"
                  :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
                >
                  <option value="">{{ t('Sort by') }}</option>
                  <option value="newest">{{ t('Newest') }}</option>
                  <option value="price-low">{{ t('Price: Low to High') }}</option>
                  <option value="price-high">{{ t('Price: High to Low') }}</option>
                  <option value="popular">{{ t('Most Popular') }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                     :class="{ 'right-auto left-0': isRTL }">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <ProductGrid 
            :products="filteredProducts"
            :loading="productsStore.isLoading"
            :error="productsStore.error"
            @view-product="viewProduct"
            @add-to-cart="addToCart"
            @retry="productsStore.fetchProducts"
          />

          <!-- No Results -->
          <div v-if="!productsStore.isLoading && filteredProducts.length === 0" 
               class="text-center py-16">
            <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ t('No products found') }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ t('Try adjusting your filters or browse other categories') }}
            </p>
            <button
              @click="clearFilters"
              class="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium 
                     hover:bg-primary-600 transition-colors"
            >
              {{ t('Clear Filters') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Sidebar (slide-in) -->
    <transition name="slide">
      <div v-if="showMobileFilters" class="fixed inset-0 z-50 lg:hidden">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50" @click="showMobileFilters = false"></div>
        <!-- Sidebar -->
        <div class="absolute top-0 right-0 w-80 max-w-[80%] h-full bg-white shadow-xl overflow-y-auto"
             :class="{ 'left-0': isRTL, 'right-0': !isRTL }">
          <div class="p-4 border-b flex items-center justify-between">
            <h3 class="font-bold text-lg">{{ t('Filters') }}</h3>
            <button @click="showMobileFilters = false" class="p-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-4">
            <CategoryFilter 
              :filters="filters"
              @update:filters="updateFilters"
            />
            <button
              @click="showMobileFilters = false"
              class="mt-4 w-full py-3 bg-primary-500 text-white rounded-lg font-medium"
            >
              {{ t('Apply Filters') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductGrid from '@/components/Products/ProductGrid.vue'
import CategoryFilter from '@/components/Products/CategoryFilter.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product, FilterOptions } from '@/types'

const route = useRoute()
const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const { currentLanguage, isRTL, t } = languageStore
const { categories, products, filterProducts } = productsStore

const filters = ref<FilterOptions>({})
const categorySlug = computed(() => route.params.slug as string)
const imageError = ref(false)
const showMobileFilters = ref(false)

// Gender slugs mapping
const GENDER_SLUGS = ['women', 'men', 'unisex', 'womens', 'mens', 'woman', 'man']
const GENDER_MAP: Record<string, string> = {
  'women': 'F',
  'womens': 'F',
  'woman': 'F',
  'men': 'M',
  'mens': 'M',
  'man': 'M',
  'unisex': 'U'
}

// Computed properties
const currentCategory = computed(() => {
  return categories.find(c => c.id === categorySlug.value)
})

const categoryName = computed(() => {
  if (isGenderSlug.value) {
    if (categorySlug.value.startsWith('women') || categorySlug.value === 'woman') {
      return t('Women')
    }
    if (categorySlug.value.startsWith('men') || categorySlug.value === 'man') {
      return t('Men')
    }
    if (categorySlug.value === 'unisex') {
      return t('Unisex')
    }
  }
  return currentCategory.value?.[currentLanguage as 'en' | 'ar'] || categorySlug.value
})

const categoryDescription = computed(() => {
  return currentCategory.value?.description?.[currentLanguage as 'en' | 'ar']
})

const categoryImage = computed(() => {
  imageError.value = false
  const slug = categorySlug.value.toLowerCase()
  if (slug === 'women' || slug === 'womens' || slug === 'woman') {
    return '/images/women-collection.jpg'
  } else if (slug === 'men' || slug === 'mens' || slug === 'man') {
    return '/images/men-collection.jpg'
  }
  return currentCategory.value?.image || '/images/default-category.jpg'
})

const categoryTitle = computed(() => {
  return `${categoryName.value} | ${t('Luxury Perfumes')}`
})

const isGenderSlug = computed(() => {
  const slug = categorySlug.value.toLowerCase()
  return GENDER_SLUGS.includes(slug)
})

// Count active filters (excluding sortBy)
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.category) count++
  if (filters.value.classification) count++
  if (filters.value.minPrice !== undefined || filters.value.maxPrice !== undefined) count++
  if (filters.value.bestseller) count++
  if (filters.value.newArrival) count++
  if (filters.value.isFeatured) count++
  return count
})

// Format price in Egyptian Pound
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// 🔁 CORRECTED FILTER LOGIC
const filteredProducts = computed(() => {
  // Start with all raw products
  let filteredRaw = products

  // Apply store filters (search, brand, price range, etc.)
  filteredRaw = filterProducts(filters.value)

  // Now apply category/gender specific filter on raw products
  if (categorySlug.value && categorySlug.value !== 'best-sellers' && categorySlug.value !== 'new-arrivals') {
    if (isGenderSlug.value) {
      const classification = GENDER_MAP[categorySlug.value.toLowerCase()]
      if (classification) {
        filteredRaw = filteredRaw.filter(p => p.classification === classification)
      }
    } else {
      filteredRaw = filteredRaw.filter(p => p.category === categorySlug.value)
    }
  }

  // Special categories (apply on raw products)
  if (categorySlug.value === 'best-sellers') {
    filteredRaw = filteredRaw.filter(p => p.isBestSeller)
  } else if (categorySlug.value === 'new-arrivals') {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    filteredRaw = filteredRaw.filter(p => {
      const date = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt?.seconds * 1000)
      return date > oneMonthAgo
    })
  }

  // Now map to processed products with formatted prices
  return filteredRaw.map(product => ({
    ...product,
    formattedPrice: formatPrice(product.price),
    formattedSalePrice: (product as any).salePrice ? formatPrice((product as any).salePrice) : null
  }))
})

// Methods
const updateFilters = (newFilters: FilterOptions) => {
  filters.value = newFilters
  // Optionally close mobile filter after update? We'll keep it open for multiple selections.
}

const clearFilters = () => {
  filters.value = {}
  // Close mobile filter after clearing
  showMobileFilters.value = false
}

const viewProduct = (product: Product) => {
  router.push(`/product/${product.slug}`)
}

const addToCart = (product: Product) => {
  cartStore.addToCart(product)
}

const handleImageError = () => {
  imageError.value = true
  console.error(`Failed to load image for category: ${categorySlug.value}`)
}

// Watch for route changes
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      await productsStore.fetchProducts()
      filters.value = {}
      showMobileFilters.value = false
    }
  },
  { immediate: true }
)

// Initialize
onMounted(async () => {
  if (!products.length) {
    await productsStore.fetchProducts()
  }
})
</script>

<style scoped>
/* ===== CATEGORY BANNER - STYLED LIKE HOMEPAGE HERO ===== */
.category-banner {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 0;
  padding-top: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%);
}

.banner-image-wrapper {
  position: relative;
  width: 100%;
  line-height: 0;
}

.hero-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  object-position: center;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%);
  z-index: 2;
  pointer-events: none;
}

.banner-container {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1.5rem 1rem;
  pointer-events: none;
}

.banner-container nav {
  pointer-events: auto;
}

/* Ensure banner image covers properly on all screens */
@media (max-width: 640px) {
  .banner-container {
    padding: 1rem;
  }
}

/* ===== MOBILE FILTER SLIDE ANIMATION ===== */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.rtl .slide-enter-from,
.rtl .slide-leave-to {
  transform: translateX(-100%);
}

/* ===== RTL SUPPORT ===== */
.rtl .banner-container {
  align-items: flex-end;
}
</style>