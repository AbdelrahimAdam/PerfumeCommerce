import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, query, where, getDocs, limit, DocumentData } from 'firebase/firestore'
import { db } from '@/firebase/config'

interface CachedTenant {
  tenantId: string
  tenantDomain: string
  expiry: number
}

export const useTenantStore = defineStore('tenant', () => {
  // ⚡ State
  const tenantId = ref<string | null>(null)
  const tenantDomain = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // ⚡ Cache expiry: 1 hour
  const CACHE_EXPIRY = 1000 * 60 * 60

  /**
   * Resolve tenant from current hostname (production only)
   * Uses Firestore + localStorage caching
   */
  const resolveTenantFromDomain = async (): Promise<void> => {
    if (isInitialized.value) return

    isLoading.value = true
    error.value = null

    const hostname = window.location.hostname
    const cacheKey = `tenant_${hostname}`

    try {
      // 🔹 Load cached tenant
      const cachedStr = localStorage.getItem(cacheKey)
      if (cachedStr) {
        try {
          const cached: CachedTenant = JSON.parse(cachedStr)
          if (cached.expiry && Date.now() < cached.expiry) {
            tenantId.value = cached.tenantId
            tenantDomain.value = cached.tenantDomain
            console.info('🟢 Tenant loaded from cache:', tenantId.value)
            isInitialized.value = true
            return
          } else {
            localStorage.removeItem(cacheKey) // expired
          }
        } catch {
          localStorage.removeItem(cacheKey) // corrupted cache
        }
      }

      // 🔹 Query Firestore for tenant
      const tenantsRef = collection(db, 'tenants')
      const q = query(tenantsRef, where('domain', '==', hostname), limit(1))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        error.value = `No tenant configured for domain "${hostname}"`
        tenantId.value = null
        tenantDomain.value = null
        console.warn(error.value)
        window.location.href = '/choose-company'
        return
      }

      const doc = snapshot.docs[0]
      const docData: DocumentData = doc.data()

      const resolvedDomain: string = (docData.domain as string) ?? ''
      if (!resolvedDomain) throw new Error('Tenant domain is missing in Firestore')

      tenantId.value = doc.id
      tenantDomain.value = resolvedDomain
      console.info('✅ Tenant resolved from Firestore:', tenantId.value)

      // 🔹 Cache tenant for future visits
      const cacheData: CachedTenant = {
        tenantId: tenantId.value,
        tenantDomain: tenantDomain.value,
        expiry: Date.now() + CACHE_EXPIRY
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))

    } catch (err: any) {
      console.error('❌ Tenant resolution failed:', err)
      error.value = err?.message || 'Failed to resolve tenant'
      tenantId.value = null
      tenantDomain.value = null
      window.location.href = '/error'
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  /**
   * After a company is registered, set tenant directly (bypass cache)
   */
  const setTenantAfterRegistration = (id: string, domain: string) => {
    tenantId.value = id
    tenantDomain.value = domain
    isInitialized.value = true
    isLoading.value = false

    const cacheKey = `tenant_${domain}`
    const cacheData: CachedTenant = {
      tenantId: id,
      tenantDomain: domain,
      expiry: Date.now() + CACHE_EXPIRY
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    console.info('🟢 Tenant set after registration:', id)
  }

  /**
   * Force refresh tenant (ignore cache)
   */
  const refreshTenant = async (): Promise<void> => {
    const hostname = window.location.hostname
    localStorage.removeItem(`tenant_${hostname}`)
    isInitialized.value = false
    await resolveTenantFromDomain()
  }

  return {
    tenantId,
    tenantDomain,
    isLoading,
    error,
    isInitialized,
    resolveTenantFromDomain,
    setTenantAfterRegistration,
    refreshTenant
  }
})