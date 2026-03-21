<template>
  <div class="landing-layout">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 flex justify-between items-center h-16">

        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold text-primary-600">
          P.comerce
        </router-link>

        <!-- Desktop -->
        <div class="hidden md:flex items-center space-x-6">
          <button @click="toggleLanguage">
            {{ currentLanguage === 'en' ? 'العربية' : 'English' }}
          </button>

          <router-link to="/login">
            {{ t('login') }}
          </router-link>

          <router-link to="/register-company" class="bg-primary-600 text-white px-4 py-2 rounded">
            {{ t('startStore') }}
          </router-link>
        </div>

        <!-- Mobile -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
          ☰
        </button>

      </div>

      <div v-if="mobileMenuOpen" class="md:hidden p-4">
        <router-link to="/login">{{ t('login') }}</router-link>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-6 text-center">
      &copy; {{ new Date().getFullYear() }} P.comerce
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'

const { currentLanguage, toggleLanguage, t } = useLanguageStore()
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.landing-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.flex-1 {
  flex: 1;
}
</style>