<!-- src/components/Layout/HomeRouter.vue -->
<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <div class="luxury-loading-spinner"></div>
  </div>
  <component :is="activeComponent" v-else />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTenantStore } from '@/stores/tenant'
import LandingPage from '@/pages/LandingPage.vue'
import HomePage from '@/pages/HomePage.vue'

const tenantStore = useTenantStore()
const isLoading = ref(true)

// The tenant ID of the main domain (from environment or fallback)
const MAIN_TENANT_ID = import.meta.env.VITE_MAIN_TENANT_ID || 'X7NGavYOCBo7MUYReWpx'

// Decide which component to render once tenant is known
const activeComponent = computed(() => {
  // If tenant matches the main domain, show landing page
  if (tenantStore.tenantId === MAIN_TENANT_ID) {
    return LandingPage
  }
  // Otherwise (subdomain or no tenant) show the store home page
  return HomePage
})

onMounted(async () => {
  // Wait for tenant resolution with a 5-second timeout
  try {
    await tenantStore.whenReady(5000)
  } catch (err) {
    console.warn('Tenant resolution timed out or failed, falling back to store home')
  }
  // Hide the spinner
  isLoading.value = false
})
</script>

<style scoped>
.luxury-loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-top: 2px solid #d4af37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>