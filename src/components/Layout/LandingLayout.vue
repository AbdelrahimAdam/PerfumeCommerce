<!-- src/components/Layout/LandingLayout.vue -->
<template>
  <div class="landing-layout">
    <!-- Sticky Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
          <!-- Logo -->
          <router-link to="/" class="text-2xl md:text-3xl font-bold text-primary-600 tracking-tight">
            P.NOTES
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <button
              @click="toggleLanguage"
              class="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              {{ currentLanguage === 'en' ? 'العربية' : 'English' }}
            </button>
            <router-link
              to="/login"
              class="text-gray-600 hover:text-primary-600 transition-colors"
            >
              {{ t('login') }}
            </router-link>
            <router-link
              to="/register-company"
              class="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              {{ t('startStore') }}
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Dropdown -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-100">
            <div class="flex flex-col space-y-3">
              <button
                @click="toggleLanguage"
                class="text-left px-2 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              >
                {{ currentLanguage === 'en' ? 'العربية' : 'English' }}
              </button>
              <router-link
                to="/login"
                class="px-2 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
                @click="mobileMenuOpen = false"
              >
                {{ t('login') }}
              </router-link>
              <router-link
                to="/register-company"
                class="px-2 py-2 text-primary-600 font-medium hover:bg-gray-50 rounded-lg"
                @click="mobileMenuOpen = false"
              >
                {{ t('startStore') }}
              </router-link>
            </div>
          </div>
        </transition>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Responsive Footer -->
    <footer class="bg-gray-900 text-gray-400 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div class="text-sm">
            &copy; {{ new Date().getFullYear() }} P.NOTES. {{ t('allRightsReserved') }}
          </div>
          <div class="flex space-x-6 text-sm">
            <router-link to="/privacy" class="hover:text-white transition-colors">
              {{ t('privacyPolicy') }}
            </router-link>
            <router-link to="/terms" class="hover:text-white transition-colors">
              {{ t('termsOfService') }}
            </router-link>
            <router-link to="/contact" class="hover:text-white transition-colors">
              {{ t('contactUs') }}
            </router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { currentLanguage, toggleLanguage, t } = languageStore

const mobileMenuOpen = ref(false)
</script>

<style scoped>
.landing-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Ensure the main content expands to push footer down */
.flex-1 {
  flex: 1 1 0%;
}
</style>