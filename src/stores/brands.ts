import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Brand, BrandWithProducts } from '@/types'
import type { Product } from '@/types'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from './auth'

export const useBrandsStore = defineStore('brands', () => {
  const productsStore = useProductsStore()
  const authStore = useAuthStore()

  /* =========================
   * STATE
   * ========================= */
  const brands = ref<Brand[]>([])
  const currentBrand = ref<BrandWithProducts | null>(null)
  const isLoading = ref(false)
  const error = ref<string>('')

  /* =========================
   * GETTERS
   * ========================= */
  const activeBrands = computed(() =>
    brands.value.filter(b => b.isActive === true)
  )

  const brandCount = computed(() => brands.value.length)

  /* =========================
   * HELPERS
   * ========================= */
  const transformBrandData = (docData: any, docId: string): Brand => ({
    id: docId,
    name: docData?.name ?? '',
    slug: docData?.slug ?? '',
    image: docData?.image ?? '',
    signature: docData?.signature ?? '',
    description: docData?.description ?? '',
    category: docData?.category ?? '',
    isActive: docData?.isActive !== false,
    price: Number(docData?.price ?? 0),
    productIds: Array.isArray(docData?.productIds) ? docData.productIds : [],
    tenantId: docData?.tenantId,
    createdAt: docData?.createdAt?.toDate?.() ?? new Date(),
    updatedAt: docData?.updatedAt?.toDate?.() ?? new Date()
  })

  /* =========================
   * LOAD BRANDS (FIXED TENANT SOURCE)
   * ========================= */
  const loadBrands = async (): Promise<void> => {
    isLoading.value = true
    error.value = ''

    try {
      const tenantId = authStore.currentTenant
      if (!tenantId) {
        brands.value = []
        return
      }

      const q = query(
        collection(db, 'brands'),
        where('tenantId', '==', tenantId),
        orderBy('name')
      )

      const snapshot = await getDocs(q)

      brands.value = snapshot.docs.map(d =>
        transformBrandData(d.data(), d.id)
      )

    } catch (err: any) {
      brands.value = []
      error.value = err?.message || 'Failed to load brands'
    } finally {
      isLoading.value = false
    }
  }

  /* =========================
   * GET BRAND BY SLUG (FIXED TENANT)
   * ========================= */
  const getBrandBySlug = async (
    slug: string
  ): Promise<BrandWithProducts | null> => {
    isLoading.value = true
    error.value = ''
    currentBrand.value = null

    try {
      const tenantId = authStore.currentTenant
      if (!tenantId) return null

      const q = query(
        collection(db, 'brands'),
        where('slug', '==', slug),
        where('tenantId', '==', tenantId)
      )

      const snapshot = await getDocs(q)

      if (snapshot.empty) return null

      const brandDoc = snapshot.docs[0]
      const brand = transformBrandData(brandDoc.data(), brandDoc.id)

      // 🔥 IMPORTANT FIX: filter products by tenant
      const productsRef = collection(db, 'brands', brand.id, 'products')
      const ps = await getDocs(productsRef)

      const products: Product[] = ps.docs
        .map(d => ({ id: d.id, ...d.data() } as Product))
        .filter(p => p.tenantId === tenantId)

      currentBrand.value = {
        ...brand,
        products
      }

      return currentBrand.value
    } catch (err: any) {
      error.value = err?.message || 'Failed to load brand'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /* =========================
   * ADD BRAND + PRODUCTS
   * ========================= */
  const addBrandWithProducts = async (
    brandData: Partial<Brand>,
    productsData: Partial<Product>[]
  ): Promise<string | null> => {
    isLoading.value = true
    error.value = ''

    const batch = writeBatch(db)

    try {
      const tenantId = authStore.currentTenant
      if (!tenantId) throw new Error('No tenant ID')

      const brandRef = doc(collection(db, 'brands'))
      const brandId = brandRef.id

      batch.set(brandRef, {
        ...brandData,
        tenantId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      const productIds: string[] = []

      for (const product of productsData) {
        const productRef = doc(collection(db, 'brands', brandId, 'products'))

        batch.set(productRef, {
          ...product,
          tenantId,
          brandId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })

        productIds.push(productRef.id)
      }

      batch.update(brandRef, { productIds })

      await batch.commit()

      await Promise.all([
        loadBrands(),
        productsStore.fetchProducts()
      ])

      return brandId
    } catch (err: any) {
      error.value = err?.message || 'Failed to add brand'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /* =========================
   * UPDATE BRAND (FIX RETURN)
   * ========================= */
  const updateBrand = async (
    brandId: string,
    updates: Partial<Brand>
  ): Promise<boolean> => {
    try {
      const refDoc = doc(db, 'brands', brandId)

      await updateDoc(refDoc, {
        ...updates,
        updatedAt: serverTimestamp()
      })

      await loadBrands()
      return true
    } catch (err: any) {
      error.value = err?.message || 'Failed to update'
      return false
    }
  }

  /* =========================
   * DELETE BRAND (FIX RETURN)
   * ========================= */
  const deleteBrand = async (brandId: string): Promise<boolean> => {
    try {
      const batch = writeBatch(db)

      const brandRef = doc(db, 'brands', brandId)
      batch.delete(brandRef)

      const productsRef = collection(db, 'brands', brandId, 'products')
      const productsSnap = await getDocs(productsRef)

      productsSnap.docs.forEach(d => batch.delete(d.ref))

      await batch.commit()

      await loadBrands()
      return true
    } catch (err: any) {
      error.value = err?.message || 'Failed to delete'
      return false
    }
  }

  /* =========================
   * INIT
   * ========================= */
  const initialize = async () => {
    if (!brands.value.length) {
      await loadBrands()
    }
  }

  return {
    brands,
    currentBrand,
    isLoading,
    error,

    activeBrands,
    brandCount,

    initialize,
    loadBrands,
    getBrandBySlug,
    addBrandWithProducts,
    updateBrand,
    deleteBrand
  }
})