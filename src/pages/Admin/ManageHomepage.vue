<!-- src/pages/Admin/ManageHomepage.vue -->
<template>
  <div class="admin-homepage-management">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl lg:text-3xl font-display-en font-bold text-gray-900 mb-2">
        {{ safeTranslate('Homepage Management') }}
      </h1>
      <p class="text-gray-600">
        {{ safeTranslate('Manage homepage content, featured brands, and exclusive offers') }}
      </p>
    </div>

    <!-- Loading -->
    <div v-if="homepageStore.isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">
        {{ safeTranslate('Loading homepage data...') }}
      </p>
    </div>

    <!-- Error -->
    <div v-else-if="homepageStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-700">{{ homepageStore.error }}</p>
      <button
        @click="loadHomepageData"
        class="mt-2 text-primary-600 hover:text-primary-700"
      >
        {{ safeTranslate('Retry') }}
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">

      <!-- HERO BANNER -->
      <div class="bg-white rounded-xl border p-6">
        <div class="flex justify-between mb-4">
          <h2 class="font-bold">{{ safeTranslate('Hero Banner') }}</h2>
          <button @click="editingHeroBanner = !editingHeroBanner">
            {{ editingHeroBanner ? safeTranslate('Cancel') : safeTranslate('Edit') }}
          </button>
        </div>

        <div v-if="!editingHeroBanner">
          <img
            :src="homepageData.heroBanner?.imageUrl || '/images/banner.jpg'"
            class="w-full h-48 object-cover rounded"
          />
          <h3 class="mt-2 font-bold">
            {{ homepageData.heroBanner?.title || 'Luxury Perfumes' }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ homepageData.heroBanner?.subtitle || 'Premium Collection' }}
          </p>
        </div>

        <form v-else @submit.prevent="updateHeroBanner" class="space-y-3">
          <!-- Image Upload with Base64 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            <div v-if="heroBannerForm.imageUrl" class="mb-2">
              <img :src="heroBannerForm.imageUrl" class="h-32 object-cover rounded" />
            </div>
            <input
              type="file"
              @change="handleHeroImageUpload"
              accept="image/jpeg,image/png,image/webp"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p class="text-xs text-gray-500 mt-1">Max 500KB. JPG, PNG, WebP. Will be stored as base64.</p>
          </div>

          <input v-model="heroBannerForm.title" placeholder="Title" class="w-full px-3 py-2 border rounded" />
          <input v-model="heroBannerForm.subtitle" placeholder="Subtitle" class="w-full px-3 py-2 border rounded" />
          <button type="submit" :disabled="saving" class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">
            {{ safeTranslate('Save Changes') }}
          </button>
        </form>
      </div>

      <!-- FEATURED BRANDS (simplified) -->
      <div class="bg-white rounded-xl border p-6">
        <div class="flex justify-between mb-4">
          <h2 class="font-bold">
            {{ safeTranslate('Featured Brands') }}
            <span class="text-sm text-gray-500">({{ featuredBrands.length }})</span>
          </h2>
          <button @click="showAddBrandModal = true" class="text-primary-600 hover:text-primary-700">
            {{ safeTranslate('Add Brand') }}
          </button>
        </div>

        <div v-if="featuredBrands.length === 0" class="text-gray-500 text-center py-6">
          {{ safeTranslate('No featured brands added yet') }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(brand, index) in featuredBrands"
            :key="brand.id"
            class="border rounded p-3"
          >
            <img :src="brand.image || '/images/placeholder-brand.jpg'" class="h-24 w-full object-cover rounded" />
            <h3 class="font-bold mt-2">{{ brand.name }}</h3>
            <p class="text-sm">{{ brand.signature }}</p>
            <p class="text-primary-600">{{ brand.price }} {{ safeTranslate('currencyLE') }}</p>

            <div class="flex gap-2 mt-2">
              <button @click="editBrand(index)" class="text-blue-600 hover:text-blue-800">{{ safeTranslate('Edit') }}</button>
              <button @click="deleteBrand(index)" class="text-red-600 hover:text-red-800">{{ safeTranslate('Delete') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- EXCLUSIVE OFFER (simplified) -->
      <div class="bg-white rounded-xl border p-6">
        <h2 class="font-bold mb-4">{{ safeTranslate("Today's Exclusive Offer") }}</h2>

        <div v-if="offers.length === 0" class="text-gray-500 text-center py-6">
          {{ safeTranslate('No active offer') }}
        </div>

        <div v-else class="flex gap-4 items-center">
          <img :src="offers[0].imageUrl || '/images/default-offer.jpg'" class="w-32 h-40 object-cover rounded" />
          <div>
            <h3 class="font-bold">{{ offers[0].title }}</h3>
            <p>{{ offers[0].subtitle }}</p>
            <p class="text-red-600 font-bold mt-2">{{ offers[0].newPrice }} EGP <span class="text-gray-400 line-through ml-2">{{ offers[0].oldPrice }} EGP</span></p>
          </div>
          <button @click="editOffer(0)" class="ml-auto text-primary-600">Edit</button>
        </div>
      </div>

      <!-- MARQUEE BRANDS (simplified) -->
      <div class="bg-white rounded-xl border p-6">
        <h2 class="font-bold mb-4">{{ safeTranslate('Marquee Brands') }} ({{ marqueeBrands.length }})</h2>

        <div v-if="marqueeBrands.length === 0" class="text-gray-500 text-center py-6">
          {{ safeTranslate('No marquee brands added') }}
        </div>

        <div class="flex gap-4 flex-wrap">
          <div v-for="(brand, index) in marqueeBrands" :key="brand.id" class="relative">
            <img :src="brand.logo || '/images/placeholder-logo.png'" class="h-12" />
            <button @click="deleteMarqueeBrand(index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
          </div>
          <button @click="addMarqueeBrand" class="px-3 py-1 border rounded">+ Add</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Brand Modal (simplified) -->
    <div v-if="showAddBrandModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">{{ editingBrandIndex !== null ? safeTranslate('Edit Brand') : safeTranslate('Add New Brand') }}</h3>
        <form @submit.prevent="saveBrand" class="space-y-3">
          <input v-model="brandForm.name" placeholder="Brand Name" class="w-full px-3 py-2 border rounded" required />
          <input v-model="brandForm.signature" placeholder="Signature/Description" class="w-full px-3 py-2 border rounded" required />
          <input v-model="brandForm.price" type="number" placeholder="Price" class="w-full px-3 py-2 border rounded" required />
          <input v-model="brandForm.slug" placeholder="Slug (e.g., tom-ford)" class="w-full px-3 py-2 border rounded" required />
          
          <div>
            <label class="block text-sm font-medium mb-1">Brand Image</label>
            <div v-if="brandForm.image" class="mb-2">
              <img :src="brandForm.image" class="h-20 object-cover rounded" />
            </div>
            <input
              type="file"
              @change="handleBrandImageUpload"
              accept="image/jpeg,image/png,image/webp"
              class="block w-full text-sm text-gray-500"
            />
            <p class="text-xs text-gray-500 mt-1">Max 500KB, will be stored as base64.</p>
          </div>

          <div class="flex gap-2 justify-end mt-4">
            <button type="button" @click="closeBrandModal" class="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Offer Modal (simplified) -->
    <div v-if="editingOfferIndex !== null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">{{ safeTranslate('Edit Offer') }}</h3>
        <form @submit.prevent="saveOffer" class="space-y-3">
          <input v-model="offerForm.title" placeholder="Title" class="w-full px-3 py-2 border rounded" required />
          <input v-model="offerForm.subtitle" placeholder="Subtitle" class="w-full px-3 py-2 border rounded" required />
          <input v-model="offerForm.slug" placeholder="Slug" class="w-full px-3 py-2 border rounded" required />
          <div class="flex gap-2">
            <input v-model.number="offerForm.oldPrice" type="number" placeholder="Old Price" class="w-1/2 px-3 py-2 border rounded" required />
            <input v-model.number="offerForm.newPrice" type="number" placeholder="New Price" class="w-1/2 px-3 py-2 border rounded" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Offer Image</label>
            <div v-if="offerForm.imageUrl" class="mb-2">
              <img :src="offerForm.imageUrl" class="h-20 object-cover rounded" />
            </div>
            <input
              type="file"
              @change="handleOfferImageUpload"
              accept="image/jpeg,image/png,image/webp"
              class="block w-full text-sm text-gray-500"
            />
          </div>
          <div class="flex gap-2 justify-end mt-4">
            <button type="button" @click="closeOfferModal" class="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useHomepageStore } from '@/stores/homepage'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const homepageStore = useHomepageStore()
const languageStore = useLanguageStore()
const authStore = useAuthStore()
const router = useRouter()

// Check if user is admin (allow tenant admins to manage homepage)
if (!authStore.isAdmin) {                // ✅ changed from isSuperAdmin
  router.push('/admin')
}

// Editing states
const editingHeroBanner = ref(false)
const showAddBrandModal = ref(false)
const editingBrandIndex = ref<number | null>(null)
const editingOfferIndex = ref<number | null>(null)

// Loading states
const saving = ref(false)

// Form data
const heroBannerForm = reactive({
  imageUrl: '',
  title: '',
  subtitle: ''
})

const brandForm = reactive({
  name: '',
  signature: '',
  image: '',
  slug: '',
  price: 0
})

const offerForm = reactive({
  title: '',
  subtitle: '',
  imageUrl: '',
  slug: '',
  oldPrice: 0,
  newPrice: 0
})

// Computed data from store
const homepageData = computed(() => homepageStore.homepageData as any)
const featuredBrands = computed(() => homepageData.value.featuredBrands || [])
const offers = computed(() => homepageData.value.activeOffers || [])
const marqueeBrands = computed(() => homepageData.value.marqueeBrands || [])

// Translations
const appTranslations = {
  'Homepage Management': { en: 'Homepage Management', ar: 'إدارة الصفحة الرئيسية' },
  'Manage homepage content, featured brands, and exclusive offers': { en: 'Manage homepage content, featured brands, and exclusive offers', ar: 'إدارة محتوى الصفحة الرئيسية، العلامات التجارية المميزة، والعروض الحصرية' },
  'Loading homepage data...': { en: 'Loading homepage data...', ar: 'جاري تحميل بيانات الصفحة الرئيسية...' },
  'Retry': { en: 'Retry', ar: 'إعادة المحاولة' },
  'Hero Banner': { en: 'Hero Banner', ar: 'بانر الرئيسية' },
  'Edit': { en: 'Edit', ar: 'تعديل' },
  'Cancel': { en: 'Cancel', ar: 'إلغاء' },
  'Save Changes': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'Featured Brands': { en: 'Featured Brands', ar: 'العلامات التجارية المميزة' },
  'Add Brand': { en: 'Add Brand', ar: 'إضافة علامة تجارية' },
  'currencyLE': { en: 'EGP', ar: 'ج.م' },
  'Delete': { en: 'Delete', ar: 'حذف' },
  'No featured brands added yet': { en: 'No featured brands added yet', ar: 'لم تتم إضافة علامات تجارية مميزة بعد' },
  "Today's Exclusive Offer": { en: "Today's Exclusive Offer", ar: 'العرض الحصري اليوم' },
  'No active offer': { en: 'No active offer', ar: 'لا يوجد عرض نشط' },
  'Marquee Brands': { en: 'Marquee Brands', ar: 'علامات الشريط المتحرك' },
  'No marquee brands added': { en: 'No marquee brands added', ar: 'لم تتم إضافة علامات للشريط المتحرك' },
  'Edit Brand': { en: 'Edit Brand', ar: 'تعديل العلامة التجارية' },
  'Add New Brand': { en: 'Add New Brand', ar: 'إضافة علامة تجارية جديدة' },
  'Brand Name': { en: 'Brand Name', ar: 'اسم العلامة التجارية' },
  'Signature/Description': { en: 'Signature/Description', ar: 'التوقيع/الوصف' },
  'Slug': { en: 'Slug', ar: 'المعرف' },
  'Price': { en: 'Price', ar: 'السعر' }
}

const safeTranslate = (key: string) => {
  const translations = appTranslations[key as keyof typeof appTranslations]
  if (!translations) return key
  const lang = languageStore.currentLanguage as 'en' | 'ar'
  return translations[lang] || translations.en || key
}

// Load homepage data
const loadHomepageData = async () => {
  await homepageStore.loadHomepageData()
  // Initialize hero form
  const hero = homepageData.value.heroBanner || {}
  Object.assign(heroBannerForm, hero)
}

// Hero banner
const handleHeroImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const file = input.files[0]
  if (file.size > 500 * 1024) {
    alert('Image too large (max 500KB)')
    return
  }
  const base64 = await fileToBase64(file)
  heroBannerForm.imageUrl = base64
}

const updateHeroBanner = async () => {
  saving.value = true
  try {
    await homepageStore.updateHomepageData({ heroBanner: heroBannerForm })
    editingHeroBanner.value = false
    showNotification('success', safeTranslate('Hero banner updated successfully'))
  } catch (error) {
    showNotification('error', safeTranslate('Failed to update hero banner'))
  } finally {
    saving.value = false
  }
}

// Brand management
const editBrand = (index: number) => {
  const brand = featuredBrands.value[index]
  Object.assign(brandForm, brand)
  editingBrandIndex.value = index
  showAddBrandModal.value = true
}

const deleteBrand = async (index: number) => {
  if (!confirm(safeTranslate('Are you sure you want to delete this brand?'))) return
  const brands = [...featuredBrands.value]
  brands.splice(index, 1)
  try {
    await homepageStore.updateHomepageData({ featuredBrands: brands } as any)
    showNotification('success', safeTranslate('Brand deleted successfully'))
  } catch (error) {
    showNotification('error', safeTranslate('Failed to delete brand'))
  }
}

const closeBrandModal = () => {
  showAddBrandModal.value = false
  editingBrandIndex.value = null
  brandForm.name = ''
  brandForm.signature = ''
  brandForm.image = ''
  brandForm.slug = ''
  brandForm.price = 0
}

const saveBrand = async () => {
  const brands = [...featuredBrands.value]
  const brandData = { ...brandForm, id: editingBrandIndex.value !== null ? brands[editingBrandIndex.value].id : `brand-${Date.now()}` }
  if (editingBrandIndex.value !== null) {
    brands[editingBrandIndex.value] = brandData
  } else {
    brands.push(brandData)
  }
  try {
    await homepageStore.updateHomepageData({ featuredBrands: brands } as any)
    closeBrandModal()
    showNotification('success', safeTranslate('Brand saved'))
  } catch (error) {
    showNotification('error', safeTranslate('Failed to save brand'))
  }
}

const handleBrandImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const file = input.files[0]
  if (file.size > 500 * 1024) {
    alert('Image too large (max 500KB)')
    return
  }
  brandForm.image = await fileToBase64(file)
}

// Offer management
const editOffer = (index: number) => {
  const offer = offers.value[index]
  Object.assign(offerForm, offer)
  editingOfferIndex.value = index
}

const closeOfferModal = () => {
  editingOfferIndex.value = null
  offerForm.title = ''
  offerForm.subtitle = ''
  offerForm.imageUrl = ''
  offerForm.slug = ''
  offerForm.oldPrice = 0
  offerForm.newPrice = 0
}

const handleOfferImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  const file = input.files[0]
  if (file.size > 500 * 1024) {
    alert('Image too large (max 500KB)')
    return
  }
  offerForm.imageUrl = await fileToBase64(file)
}

const saveOffer = async () => {
  const offersList = [...offers.value]
  const offerData = { ...offerForm, id: editingOfferIndex.value !== null ? offersList[editingOfferIndex.value].id : `offer-${Date.now()}` }
  if (editingOfferIndex.value !== null) {
    offersList[editingOfferIndex.value] = offerData
  } else {
    offersList.push(offerData)
  }
  try {
    await homepageStore.updateHomepageData({ activeOffers: offersList })
    closeOfferModal()
    showNotification('success', safeTranslate('Offer saved'))
  } catch (error) {
    showNotification('error', safeTranslate('Failed to save offer'))
  }
}

// Marquee brand management
const addMarqueeBrand = () => {
  // Simplified: just add a placeholder
  const newBrand = {
    id: `marquee-${Date.now()}`,
    name: 'New Brand',
    logo: '/images/placeholder-logo.png'
  }
  const brands = [...marqueeBrands.value, newBrand]
  homepageStore.updateHomepageData({ marqueeBrands: brands })
}

const deleteMarqueeBrand = async (index: number) => {
  if (!confirm(safeTranslate('Are you sure you want to delete this brand logo?'))) return
  const brands = [...marqueeBrands.value]
  brands.splice(index, 1)
  try {
    await homepageStore.updateHomepageData({ marqueeBrands: brands })
    showNotification('success', safeTranslate('Marquee brand deleted'))
  } catch (error) {
    showNotification('error', safeTranslate('Failed to delete marquee brand'))
  }
}

// Utility
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const showNotification = (type: 'success' | 'error', message: string) => {
  window.dispatchEvent(new CustomEvent('luxury-notification', {
    detail: {
      type,
      title: type === 'success' ? safeTranslate('Success') : safeTranslate('Error'),
      message,
      duration: 3000
    }
  }))
}

// Initialize
onMounted(() => {
  loadHomepageData()
})
</script>

<style scoped>
.admin-homepage-management {
  min-height: calc(100vh - 12rem);
}

/* Form styles */
input, select, textarea {
  transition: all 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  ring-width: 2px;
}

/* Button styles */
button {
  transition: all 0.2s ease-in-out;
}

/* Modal animations */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Grid item hover effects */
.border-gray-200:hover {
  border-color: var(--color-primary-500);
  transform: translateY(-2px);
}

/* Image preview styles */
img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .admin-homepage-management :deep(.bg-white) {
    background-color: #1e293b !important;
  }
  
  .admin-homepage-management :deep(.text-gray-900) {
    color: #f1f5f9 !important;
  }
  
  .admin-homepage-management :deep(.text-gray-700) {
    color: #cbd5e1 !important;
  }
  
  .admin-homepage-management :deep(.text-gray-600) {
    color: #94a3b8 !important;
  }
  
  .admin-homepage-management :deep(.border-gray-200) {
    border-color: #334155 !important;
  }
  
  .admin-homepage-management :deep(.bg-gray-50) {
    background-color: #1e293b !important;
  }
}
</style>