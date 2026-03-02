<!-- src/pages/RegisterPage.vue -->
<template>
  <div class="register-page min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-gold-lg">
              <span class="text-white font-bold text-xl">P</span>
            </div>
            <div class="text-left">
              <h1 class="text-xl font-bold text-gray-900">P.NOTES</h1>
              <p class="text-xs text-gray-500">PERFUME STORE</p>
            </div>
          </div>
        </router-link>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ t('createAccount') }}</h2>
        <p class="text-gray-600">{{ t('joinLuxuryCommunity') }}</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('firstName') }} *
              </label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                :placeholder="t('firstName')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('lastName') }} *
              </label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                :placeholder="t('lastName')"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('email') }} *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              :placeholder="t('emailPlaceholder')"
            />
          </div>

          <!-- Phone (Optional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('phone') }}
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              :placeholder="t('phonePlaceholder')"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('password') }} *
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent pr-12"
                :placeholder="t('passwordPlaceholder')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gold-500"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">{{ t('passwordRequirements') }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('confirmPassword') }} *
            </label>
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              :class="{ 'border-red-500': passwordMismatch }"
              :placeholder="t('confirmPasswordPlaceholder')"
            />
            <p v-if="passwordMismatch" class="mt-1 text-xs text-red-500">
              {{ t('passwordsDoNotMatch') }}
            </p>
          </div>

          <!-- Newsletter -->
          <div class="flex items-center">
            <input
              v-model="form.newsletter"
              type="checkbox"
              id="newsletter"
              class="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
            />
            <label for="newsletter" class="ml-2 text-sm text-gray-600">
              {{ t('subscribeNewsletter') }}
            </label>
          </div>

          <!-- Terms -->
          <div class="flex items-start">
            <input
              v-model="form.terms"
              type="checkbox"
              id="terms"
              required
              class="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500 mt-1"
            />
            <label for="terms" class="ml-2 text-sm text-gray-600">
              {{ t('agreeToTerms') }}
              <router-link to="/terms" class="text-gold-600 hover:text-gold-700 font-medium">
                {{ t('termsOfService') }}
              </router-link>
              {{ t('and') }}
              <router-link to="/privacy" class="text-gold-600 hover:text-gold-700 font-medium">
                {{ t('privacyPolicy') }}
              </router-link>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!!(loading || !form.terms || passwordMismatch)"
            class="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl font-bold shadow-gold-lg hover:shadow-gold-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <span v-if="!loading">{{ t('createAccount') }}</span>
            <div v-else class="flex items-center justify-center">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span class="ml-2">{{ t('creating') }}...</span>
            </div>
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">{{ t('or') }}</span>
            </div>
          </div>

          <!-- Login Link -->
          <p class="text-center text-sm text-gray-600">
            {{ t('alreadyHaveAccount') }}
            <router-link to="/login" class="text-gold-600 hover:text-gold-700 font-medium">
              {{ t('signIn') }}
            </router-link>
          </p>
        </form>
      </div>

      <!-- Social Proof -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          {{ t('secureRegistration') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { authNotification } from '@/utils/notifications'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t } = useLanguageStore()

const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  newsletter: false,
  terms: false
})

const passwordMismatch = computed(() => {
  return form.password && form.confirmPassword && form.password !== form.confirmPassword
})

const handleRegister = async () => {
  if (passwordMismatch.value) {
    authNotification.error(t('passwordsDoNotMatch'))
    return
  }

  loading.value = true

  try {
    const customer = await authStore.customerRegister({
      email: form.email,
      password: form.password,
      displayName: `${form.firstName} ${form.lastName}`,
      phoneNumber: form.phone
    })

    if (customer) {
      authNotification.loggedIn(customer.displayName || t('customer'))
      
      // Redirect to the page they were trying to access (e.g., checkout) or fallback to account
      const redirectTo = route.query.redirect as string || '/account'
      router.push(redirectTo)
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      authNotification.error(t('emailAlreadyInUse'))
    } else if (error.code === 'auth/weak-password') {
      authNotification.error(t('weakPassword'))
    } else if (error.code === 'auth/invalid-email') {
      authNotification.error(t('invalidEmail'))
    } else if (error.code === 'auth/network-request-failed') {
      authNotification.error(t('networkError') || 'Network error. Please check your internet connection.')
    } else {
      authNotification.error(error.message || t('registrationFailed'))
    }
  } finally {
    loading.value = false
  }
}
</script>