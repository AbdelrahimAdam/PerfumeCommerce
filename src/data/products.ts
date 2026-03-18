// src/data/products.ts
import type { Product } from '@/types'

const DEFAULT_TENANT_ID = 'default' // Replace with actual tenant ID logic

export const products: Product[] = [
  // ===================== DIOR PRODUCTS =====================
  {
    id: 'dior-001',
    name: {
      en: 'Dior Sauvage',
      ar: 'ديور سوفاج'
    },
    slug: 'dior-sauvage',
    brand: 'dior',
    category: 'luxury',
    price: 199.99,
    size: '100ml',
    concentration: 'Eau de Toilette',
    description: {
      en: 'A radically fresh, spicy, and ambery fragrance for men.',
      ar: 'عطر جديد تماماً، حار وعطري للرجال.'
    },
    imageUrl: '/images/products/dior/sauvage.jpg',
    images: ['/images/products/dior/sauvage.jpg'],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 2450,
    notes: {
      top: ['Calabrian Bergamot', 'Pepper'],
      heart: ['Lavender', 'Juniper Berry'],
      base: ['Ambroxan', 'Cedar']
    },
    inStock: true,
    stockQuantity: 150,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'dior-002',
    name: {
      en: 'Dior J\'adore',
      ar: 'ديور جادور'
    },
    slug: 'dior-j-adore',
    brand: 'dior',
    category: 'floral',
    price: 159.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A golden floral bouquet.',
      ar: 'باقة زهرية ذهبية.'
    },
    imageUrl: '/images/products/dior/j-adore.jpg',
    images: ['/images/products/dior/j-adore.jpg'],
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 1890,
    notes: {
      top: ['Ylang-Ylang', 'Pear'],
      heart: ['Rose', 'Jasmine'],
      base: ['Amber', 'Cedar']
    },
    inStock: true,
    stockQuantity: 95,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'dior-003',
    name: {
      en: 'Dior Homme',
      ar: 'ديور هوم'
    },
    slug: 'dior-homme',
    brand: 'dior',
    category: 'woody',
    price: 179.99,
    size: '100ml',
    concentration: 'Eau de Toilette',
    description: {
      en: 'A sophisticated fragrance for the modern man.',
      ar: 'عطر متطور للرجل المعاصر.'
    },
    imageUrl: '/images/products/dior/dior-home.jpg',
    images: ['/images/products/dior/dior-home.jpg'],
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 1230,
    notes: {
      top: ['Iris', 'Lavender'],
      heart: ['Cedar', 'Vetiver'],
      base: ['Leather', 'Amber']
    },
    inStock: true,
    stockQuantity: 65,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'dior-004',
    name: {
      en: 'Miss Dior',
      ar: 'ميس ديور'
    },
    slug: 'miss-dior',
    brand: 'dior',
    category: 'floral',
    price: 149.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A romantic floral fragrance.',
      ar: 'عطر زهري رومانسي.'
    },
    imageUrl: '/images/products/dior/MissDior.png',
    images: ['/images/products/dior/MissDior.png'],
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 2100,
    notes: {
      top: ['Mandarin', 'Lily of the Valley'],
      heart: ['Rose', 'Jasmine'],
      base: ['Patchouli', 'Amber']
    },
    inStock: true,
    stockQuantity: 80,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'dior-005',
    name: {
      en: 'Hypnotic Poison',
      ar: 'هيبنوتيك بويسون'
    },
    slug: 'hypnotic-poison',
    brand: 'dior',
    category: 'oriental',
    price: 169.99,
    size: '100ml',
    concentration: 'Eau de Toilette',
    description: {
      en: 'A sensual oriental fragrance.',
      ar: 'عطر شرقي حسي.'
    },
    imageUrl: '/images/products/dior/hypo-poison.jpg',
    images: ['/images/products/dior/hypo-poison.jpg'],
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 890,
    notes: {
      top: ['Almond', 'Coconut'],
      heart: ['Jasmine', 'Rose'],
      base: ['Vanilla', 'Sandalwood']
    },
    inStock: true,
    stockQuantity: 45,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'dior-006',
    name: {
      en: 'Blue Channel',
      ar: 'بلو شانيل'
    },
    slug: 'blue-channel',
    brand: 'dior',
    category: 'fresh',
    price: 189.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A fresh aromatic fragrance.',
      ar: 'عطر عطري منعش.'
    },
    imageUrl: '/images/products/dior/blue-channel.jpg',
    images: ['/images/products/dior/blue-channel.jpg'],
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 760,
    notes: {
      top: ['Grapefruit', 'Ginger'],
      heart: ['Incense', 'Nutmeg'],
      base: ['Sandalwood', 'Patchouli']
    },
    inStock: true,
    stockQuantity: 55,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },

  // ===================== CHANEL PRODUCTS =====================
  {
    id: 'chanel-001',
    name: {
      en: 'Chance Chanel',
      ar: 'شانس شانيل'
    },
    slug: 'chance-chanel',
    brand: 'chanel',
    category: 'floral',
    price: 159.99,
    size: '100ml',
    concentration: 'Eau de Toilette',
    description: {
      en: 'A surprising floral fragrance.',
      ar: 'عطر زهري مفاجئ.'
    },
    imageUrl: '/images/products/chanel/chance-chaneal.jpg',
    images: ['/images/products/chanel/chance-chaneal.jpg'],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 1950,
    notes: {
      top: ['Citrus', 'Pink Pepper'],
      heart: ['Jasmine', 'Hyacinth'],
      base: ['Patchouli', 'Vetiver']
    },
    inStock: true,
    stockQuantity: 120,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'chanel-002',
    name: {
      en: 'Coco Chanel',
      ar: 'كوكو شانيل'
    },
    slug: 'coco-chanel',
    brand: 'chanel',
    category: 'oriental',
    price: 189.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'An opulent oriental fragrance.',
      ar: 'عطر شرقي فخم.'
    },
    imageUrl: '/images/products/chanel/cocochanel.jpg',
    images: ['/images/products/chanel/cocochanel.jpg'],
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 2300,
    notes: {
      top: ['Orange', 'Bergamot'],
      heart: ['Rose', 'Jasmine'],
      base: ['Vanilla', 'Tonka Bean']
    },
    inStock: true,
    stockQuantity: 85,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'chanel-003',
    name: {
      en: 'Chance Shaneel',
      ar: 'شانس شانيل'
    },
    slug: 'chance-shaneel',
    brand: 'chanel',
    category: 'fresh',
    price: 149.99,
    size: '100ml',
    concentration: 'Eau Fraiche',
    description: {
      en: 'A fresh and vibrant fragrance.',
      ar: 'عطر منعش وحيوي.'
    },
    imageUrl: '/images/products/chanel/chance-shaneel.jpg',
    images: ['/images/products/chanel/chance-shaneel.jpg'],
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 1100,
    notes: {
      top: ['Grapefruit', 'Quince'],
      heart: ['Jasmine', 'Freesia'],
      base: ['White Musk', 'Cedar']
    },
    inStock: true,
    stockQuantity: 70,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },

  // ===================== TOM FORD PRODUCTS =====================
  {
    id: 'tom-ford-001',
    name: {
      en: 'Lost Cherry',
      ar: 'لوس شيري'
    },
    slug: 'lost-cherry',
    brand: 'tom-ford',
    category: 'oriental',
    price: 349.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A provocative blend of black cherry.',
      ar: 'مزيج استفزازي من الكرز الأسود.'
    },
    imageUrl: '/images/products/tom-ford/lost-cheery.jpg',
    images: ['/images/products/tom-ford/lost-cheery.jpg'],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 1850,
    notes: {
      top: ['Black Cherry', 'Bitter Almond'],
      heart: ['Turkish Rose', 'Plum'],
      base: ['Tonka Bean', 'Vanilla', 'Sandalwood']
    },
    inStock: true,
    stockQuantity: 40,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'tom-ford-002',
    name: {
      en: 'White Suede',
      ar: 'وايت سويد'
    },
    slug: 'white-suede',
    brand: 'tom-ford',
    category: 'woody',
    price: 299.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A sensual blend of suede.',
      ar: 'مزيج حسي من الجلد المدبوغ.'
    },
    imageUrl: '/images/products/tom-ford/white-suite.jpg',
    images: ['/images/products/tom-ford/white-suite.jpg'],
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 920,
    notes: {
      top: ['Thyme', 'Rose'],
      heart: ['Saffron', 'Muguet'],
      base: ['Suede', 'Amber', 'Musk']
    },
    inStock: true,
    stockQuantity: 35,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'tom-ford-003',
    name: {
      en: 'Amber Leather',
      ar: 'أمبر ليزر'
    },
    slug: 'amber-leather',
    brand: 'tom-ford',
    category: 'leather',
    price: 329.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A rich leather fragrance.',
      ar: 'عطر جلد غني.'
    },
    imageUrl: '/images/products/tom-ford/amberleser.jpg',
    images: ['/images/products/tom-ford/amberleser.jpg'],
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 680,
    notes: {
      top: ['Saffron', 'Cardamom'],
      heart: ['Leather', 'Jasmine'],
      base: ['Amber', 'Patchouli', 'Vanilla']
    },
    inStock: true,
    stockQuantity: 25,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'tom-ford-004',
    name: {
      en: 'Black Orchid',
      ar: 'بلاك أوركيد'
    },
    slug: 'black-orchid',
    brand: 'tom-ford',
    category: 'oriental',
    price: 279.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A luxurious oriental fragrance.',
      ar: 'عطر شرقي فاخر.'
    },
    imageUrl: '/images/products/tom-ford/black-orcad.jpg',
    images: ['/images/products/tom-ford/black-orcad.jpg'],
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 2100,
    notes: {
      top: ['Black Truffle', 'Bergamot'],
      heart: ['Black Orchid', 'Fruity Notes'],
      base: ['Patchouli', 'Vanilla', 'Incense']
    },
    inStock: true,
    stockQuantity: 50,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },

  // ===================== GUCCI PRODUCTS =====================
  {
    id: 'gucci-001',
    name: {
      en: 'Gucci Flora',
      ar: 'غوتشي فلورا'
    },
    slug: 'gucci-flora',
    brand: 'gucci',
    category: 'floral',
    price: 149.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A romantic floral fragrance.',
      ar: 'عطر زهري رومانسي.'
    },
    imageUrl: '/images/products/gucci/flora.jpg',
    images: ['/images/products/gucci/flora.jpg'],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 1650,
    notes: {
      top: ['Citrus', 'Peony'],
      heart: ['Rose', 'Osmanthus'],
      base: ['Sandalwood', 'Pink Pepper']
    },
    inStock: true,
    stockQuantity: 90,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'gucci-002',
    name: {
      en: 'Gucci Gardinia',
      ar: 'غوتشي غاردينيا'
    },
    slug: 'gucci-gardinia',
    brand: 'gucci',
    category: 'floral',
    price: 169.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A lush gardenia fragrance.',
      ar: 'عطر غاردينيا غني.'
    },
    imageUrl: '/images/products/gucci/gardinia.jpg',
    images: ['/images/products/gucci/gardinia.jpg'],
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 780,
    notes: {
      top: ['Pear', 'Bergamot'],
      heart: ['Gardenia', 'Tuberose'],
      base: ['Patchouli', 'Brown Sugar']
    },
    inStock: true,
    stockQuantity: 60,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'gucci-003',
    name: {
      en: 'Red Gucci',
      ar: 'ريد غوتشي'
    },
    slug: 'red-gucci',
    brand: 'gucci',
    category: 'woody',
    price: 159.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A bold woody fragrance.',
      ar: 'عطر خشبي جريء.'
    },
    imageUrl: '/images/products/gucci/red-gouchi.jpg',
    images: ['/images/products/gucci/red-gouchi.jpg'],
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 450,
    notes: {
      top: ['Bergamot', 'Pink Pepper'],
      heart: ['Rose', 'Geranium'],
      base: ['Patchouli', 'Oud', 'Vanilla']
    },
    inStock: true,
    stockQuantity: 40,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },

  // ===================== VERSACE PRODUCTS =====================
  {
    id: 'versace-001',
    name: {
      en: 'Versace Eros',
      ar: 'فيرساتشي إيروس'
    },
    slug: 'versace-eros',
    brand: 'versace',
    category: 'fresh',
    price: 129.99,
    size: '100ml',
    concentration: 'Eau de Toilette',
    description: {
      en: 'A bold, intense fragrance.',
      ar: 'عطر جريء ومكثف.'
    },
    imageUrl: '/images/products/versace/eros.jpg',
    images: ['/images/products/versace/eros.jpg'],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 3200,
    notes: {
      top: ['Mint', 'Green Apple', 'Lemon'],
      heart: ['Geranium', 'Ambroxan'],
      base: ['Tonka Bean', 'Vanilla', 'Oakmoss']
    },
    inStock: true,
    stockQuantity: 150,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'versace-002',
    name: {
      en: 'Bright Crystal',
      ar: 'برايت كريستال'
    },
    slug: 'bright-crystal',
    brand: 'versace',
    category: 'floral',
    price: 119.99,
    size: '100ml',
    concentration: 'Eau de Toilette',
    description: {
      en: 'A fresh floral fragrance.',
      ar: 'عطر زهري منعش.'
    },
    imageUrl: '/images/products/versace/bright-crystal.jpg',
    images: ['/images/products/versace/bright-crystal.jpg'],
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 2450,
    notes: {
      top: ['Yuzu', 'Pomegranate'],
      heart: ['Peony', 'Lotus Flower'],
      base: ['Musk', 'Mahogany']
    },
    inStock: true,
    stockQuantity: 110,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },

  // ===================== YVES SAINT LAURENT PRODUCTS =====================
  {
    id: 'ysl-001',
    name: {
      en: 'Black Opium',
      ar: 'بلاك أوبيوم'
    },
    slug: 'black-opium',
    brand: 'yves-saint-laurent',
    category: 'oriental',
    price: 149.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A glamorous, addictive fragrance.',
      ar: 'عطر جذاب وإدماني.'
    },
    imageUrl: '/images/products/yves-saint-laurent/black-opioum.jpg',
    images: ['/images/products/yves-saint-laurent/black-opioum.jpg'],
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 2850,
    notes: {
      top: ['Coffee', 'Pink Pepper'],
      heart: ['Jasmine', 'Orange Blossom'],
      base: ['Vanilla', 'Patchouli', 'Cedar']
    },
    inStock: true,
    stockQuantity: 130,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1640995200, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  },
  {
    id: 'ysl-002',
    name: {
      en: 'Manifesto',
      ar: 'مانيفستو'
    },
    slug: 'manifesto',
    brand: 'yves-saint-laurent',
    category: 'floral',
    price: 139.99,
    size: '100ml',
    concentration: 'Eau de Parfum',
    description: {
      en: 'A luminous floral fragrance.',
      ar: 'عطر زهري مضيء.'
    },
    imageUrl: '/images/products/yves-saint-laurent/manafisto.jpg',
    images: ['/images/products/yves-saint-laurent/manafisto.jpg'],
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 980,
    notes: {
      top: ['Bergamot', 'Blackcurrant'],
      heart: ['Jasmine', 'Orange Blossom'],
      base: ['Vanilla', 'Tonka Bean', 'Sandalwood']
    },
    inStock: true,
    stockQuantity: 75,
    tenantId: DEFAULT_TENANT_ID,
    createdAt: { seconds: 1643673600, nanoseconds: 0 },
    updatedAt: { seconds: 1704067200, nanoseconds: 0 }
  }
]

// Helper functions
export const getProductsByBrand = (brandSlug: string): Product[] => {
  return products.filter(product => product.brand === brandSlug)
}

export const getFeaturedProductForBrand = (brandSlug: string): Product | undefined => {
  const brandProducts = getProductsByBrand(brandSlug)
  return brandProducts.find(p => p.isFeatured) || 
         brandProducts.find(p => p.isBestSeller) || 
         brandProducts[0]
}

export const getAllProducts = (): Product[] => {
  return products
}

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug)
}

export const getFeaturedProducts = (limit: number = 6): Product[] => {
  return products
    .filter(p => p.isFeatured || p.isBestSeller)
    .slice(0, limit)
}

export const getNewArrivals = (limit: number = 6): Product[] => {
  return [...products]
    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    .slice(0, limit)
}