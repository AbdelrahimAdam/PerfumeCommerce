<template>
  <component :is="activeComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTenantStore } from '@/stores/tenant'
import LandingPage from '@/pages/LandingPage.vue'
import HomePage from '@/pages/HomePage.vue' // your existing store home page

const tenantStore = useTenantStore()

// Get the main domain's tenant ID from environment variables
const MAIN_TENANT_ID = import.meta.env.VITE_MAIN_TENANT_ID || 'X7NGavYOCBo7MUYReWpx'

// If the resolved tenant ID matches the main domain's tenant ID, show landing page; otherwise show store home
const activeComponent = computed(() => {
  return tenantStore.tenantId === MAIN_TENANT_ID ? LandingPage : HomePage
})
</script>