// ===============================
// Luxury Types
// ===============================

export type Language = 'en' | 'ar' | 'fa' | 'he'

export interface Translation {
  en: string
  ar: string
}

// ===============================
// Homepage
// ===============================

export interface HomepageData {
  heroTitle: string
  heroSubtitle: string
  aboutWork: {
    title: string
    description: string
  }
  settings: {
    isDarkMode: boolean
    defaultLanguage: Language
  }
  activeOffers?: any[]
  productCount?: number
  lastUpdated?: string
  source?: 'firebase' | 'local' | 'api'
}

// ===============================
// Category
// ===============================

export interface Category {
  id: string
  en: string
  ar: string
  description: Translation
  image: string
  featured: boolean
}

// ===============================
// Product
// ===============================

export interface Product {
  id: string
  slug: string

  name: Translation

  // Brand
  brand: string
  brandSlug?: string
  brandId?: string
  brandName?: string

  description: Translation

  price: number
  originalPrice?: number

  size: string
  concentration: string

  // NEW: classification field (gender)
  classification?: string; // 'M' | 'F' | 'U'

  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }

  imageUrl: string
  image?: string
  images: string[]

  category: string

  isBestSeller: boolean
  isFeatured?: boolean
  isNew?: boolean
  isActive?: boolean

  inStock: boolean

  rating?: number
  reviewCount?: number

  // ✅ Added SKU field (optional for existing products)
  sku?: string

  createdAt?: any
  updatedAt?: any

  meta?: {
    weight?: string
    dimensions?: string
    ingredients?: string[]
    howToUse?: Translation
  }
}

// ===============================
// Product Form
// ===============================

export interface ProductFormData {
  name: Translation
  brand: string
  description: Translation
  price: number
  originalPrice?: number
  size: string
  concentration: string
  classification?: string // NEW
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  imageUrl: string
  images: string[]
  category: string
  isBestSeller: boolean
  isFeatured?: boolean
  isNew?: boolean
  isActive?: boolean
  inStock: boolean
}

// ===============================
// Cart
// ===============================

export interface CartItem {
  id: string
  name: Translation
  imageUrl: string
  price: number
  size: string
  concentration?: string
  brand?: string
  quantity: number
  addedAt?: string
}

// ===============================
// Admin
// ===============================

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: 'admin' | 'super-admin'
  lastLogin?: Date
}

// ===============================
// Filters
// ===============================

export interface FilterOptions {
  category?: string
  categories?: string[]

  brand?: string
  brands?: string[]
  brandSlug?: string

  size?: string
  concentration?: string

  price?: number
  minPrice?: number
  maxPrice?: number

  minRating?: number

  bestseller?: boolean
  isFeatured?: boolean
  newArrival?: boolean

  sortBy?: string
  searchTerm?: string
}

// ===============================
// Orders
// ===============================

export interface OrderCustomer {
  name: string
  email: string
  phone: string
  userId?: string
}

export interface Order {
  id: string
  orderNumber: string

  customer: OrderCustomer
  items: CartItem[]

  subtotal: number
  shippingCost: number
  tax?: number
  discount?: number
  total: number

  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'

  shippingAddress: string
  trackingNumber?: string
  notes?: string

  createdAt: Date
  updatedAt: Date
  shippedAt?: Date
  deliveredAt?: Date
  cancelledAt?: Date
}

// ===============================
// Review
// ===============================

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
  helpful?: number
}

// ===============================
// Wishlist
// ===============================

export interface WishlistItem {
  id: string
  productId: string
  userId: string
  addedAt: Date
}

// ===============================
// Newsletter
// ===============================

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  subscribedAt: Date
  preferences?: {
    newArrivals: boolean
    promotions: boolean
    tips: boolean
  }
}

// ===============================
// API
// ===============================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ===============================
// Forms
// ===============================

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  language: Language
}

export interface NewsletterFormData {
  email: string
  name?: string
  language: Language
  preferences?: {
    newArrivals: boolean
    promotions: boolean
    tips: boolean
  }
}

// ===============================
// Theme
// ===============================

export interface LuxuryTheme {
  colors: {
    darkBg: string
    darkBrown: string
    gold: string
    goldLight: string
    goldDark: string
    lightBg: string
    cardBg: string
    red: string
  }
  typography: {
    serif: string
    sans: string
    arabic: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    soft: string
    medium: string
    gold: string
    luxury: string
  }
}

// ===============================
// Brand
// ===============================

export interface Brand {
  id: string
  name: string
  slug: string
  image: string
  signature?: string
  description?: string
  category?: string
  price?: number
  productCount?: number
  isActive: boolean
  productIds?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BrandWithProducts extends Brand {
  products: Product[]
}

export interface FeaturedBrand {
  id: string
  name: string
  image: string
  signature: string
  price: number
  slug: string
  category?: string
}