// src/stores/currency.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Simple currency interface (only EGP)
interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  rate: number
}

export const useCurrencyStore = defineStore('currency', () => {
  // -------------------
  // STATE
  // -------------------
  const currentCurrency = ref<Currency>({
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'ج.م',
    flag: '🇪🇬',
    rate: 1
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // -------------------
  // GETTERS
  // -------------------
  const currencySymbol = computed(() => currentCurrency.value.symbol)

  // -------------------
  // ACTIONS
  // -------------------
  const initializeCurrency = () => {
    const saved = localStorage.getItem('luxury_currency')
    if (saved && saved === 'EGP') {
      // already EGP
    } else {
      localStorage.setItem('luxury_currency', 'EGP')
    }
  }

  /**
   * Format price in EGP using the appropriate locale (ar-EG)
   */
  const formatPrice = (priceEGP: number): string => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(priceEGP)
  }

  const setCurrency = (currencyCode: string) => {
    if (currencyCode !== 'EGP') {
      console.warn('Only EGP is supported')
      return
    }
    localStorage.setItem('luxury_currency', 'EGP')
  }

  const clearError = () => {
    error.value = null
  }

  // Init
  initializeCurrency()

  return {
    // State
    currentCurrency,
    isLoading,
    error,

    // Getters
    currencySymbol,

    // Actions
    initializeCurrency,
    formatPrice,
    setCurrency,
    clearError
  }
})