import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useTenantStore = defineStore('tenant', () => {
  const tenantId = ref<string | null>(null)
  const tenantDomain = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  /**
   * Resolve tenant from current hostname by looking up in Firestore `tenants` collection.
   * Assumes each tenant document has a `domain` field (e.g., 'company.yourdomain.com').
   */
  const resolveTenantFromDomain = async () => {
    if (isInitialized.value) return

    isLoading.value = true
    error.value = null

    try {
      const hostname = window.location.hostname
      console.log('🔍 Resolving tenant for domain:', hostname)

      // For local development: allow a dev tenant ID from env, or require login.
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        const devTenant = import.meta.env.VITE_DEV_TENANT_ID
        if (devTenant) {
          console.log('🧪 Using dev tenant fallback:', devTenant)
          tenantId.value = devTenant
          tenantDomain.value = hostname
          isInitialized.value = true
          return
        }
        // No dev tenant – we'll rely on authentication; guests will see nothing.
        // But to avoid breaking public pages, you could redirect to a "choose company" page.
        // For now, we'll set tenantId = null and let stores handle it.
        console.log('ℹ️ No dev tenant – guests will see no data.')
      }

      // Query tenants collection for a document where domain matches hostname
      const tenantsRef = collection(db, 'tenants')
      const q = query(tenantsRef, where('domain', '==', hostname), limit(1))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        error.value = `No tenant configured for domain "${hostname}"`
        tenantId.value = null
        tenantDomain.value = null
      } else {
        const doc = snapshot.docs[0]
        tenantId.value = doc.id
        tenantDomain.value = doc.data().domain
        console.log('✅ Tenant resolved:', tenantId.value)
      }
    } catch (err: any) {
      console.error('❌ Tenant resolution error:', err)
      error.value = err.message || 'Failed to resolve tenant'
      tenantId.value = null
      tenantDomain.value = null
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  return {
    tenantId,
    tenantDomain,
    isLoading,
    error,
    isInitialized,
    resolveTenantFromDomain
  }
})