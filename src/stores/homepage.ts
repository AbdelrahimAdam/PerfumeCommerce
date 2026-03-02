// src/stores/homepage.ts
import { defineStore } from 'pinia'
import { ref, reactive, onUnmounted } from 'vue'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/stores/auth'

// =================== TYPE DEFINITIONS ===================

interface HeroBanner {
  imageUrl: string
  linkText?: string      // optional, falls back to translation
  linkUrl?: string        // optional, defaults to '/shop'
}

interface Offer {
  id?: string
  slug: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  oldPrice: number
  newPrice: number
  linkUrl?: string
  startDate?: string
  endDate?: string
  offerType: string      // 'percentage', 'fixed', 'bundle', 'free-shipping', 'buy-one-get-one'
  terms?: string
  active?: boolean
}

interface MarqueeBrand {
  id: string
  name: string
  logo: string
}

interface Settings {
  isDarkMode: boolean
  defaultLanguage: string
}

interface HomepageData {
  heroBanner: HeroBanner
  activeOffers: Offer[]
  marqueeBrands: MarqueeBrand[]
  aboutWork: {
    title: string
    description: string
  }
  settings: Settings
  lastUpdated?: string
  source?: 'firebase' | 'cache' | 'default'
}

type ListenerCallback = (data: HomepageData) => void

export const useHomepageStore = defineStore('homepage', () => {
  const authStore = useAuthStore()

  // =================== DEFAULT DATA ===================
  const defaultLocalData: HomepageData = {
    heroBanner: {
      imageUrl: '/images/banner.jpg',
      linkText: 'SHOP NOW',
      linkUrl: '/shop'
    },
    activeOffers: [
      {
        id: 'default-offer-1',
        slug: 'summer-collection',
        title: 'Summer Oud',
        subtitle: 'Limited Edition',
        description: 'A refreshing summer oud with notes of citrus and sandalwood. Perfect for warm evenings.',
        imageUrl: '/images/default-offer.jpg',
        oldPrice: 3500,
        newPrice: 2500,
        offerType: 'percentage',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        terms: 'Limited time offer. While stocks last.',
        active: true
      }
    ],
    marqueeBrands: [],
    aboutWork: {
      title: 'what about our work',
      description: 'Premium perfume collections curated with expertise and passion for luxury scents.'
    },
    settings: {
      isDarkMode: false,
      defaultLanguage: 'ar'
    },
    lastUpdated: new Date().toISOString(),
    source: 'default'
  }

  // =================== STATE ===================
  const homepageData = reactive<HomepageData>({ ...defaultLocalData })
  const isLoading = ref(false)
  const error = ref<string>('')

  let unsubscribe: (() => void) | null = null
  const isListening = ref(false)
  const listeners = new Set<ListenerCallback>()

  const CACHE_KEY = 'homepage_cache_v2'
  const CACHE_TIMESTAMP_KEY = 'homepage_cache_timestamp_v2'
  const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

  // =================== HELPERS ===================
  const checkPermission = (): boolean => {
    if (authStore.user?.role !== 'super-admin') {
      throw new Error('Permission denied: Only super admin can modify homepage')
    }
    return true
  }

  const getCachedData = (): HomepageData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp)
        if (cacheAge < CACHE_DURATION) return JSON.parse(cached)
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(CACHE_TIMESTAMP_KEY)
      }
    } catch (err) { /* ignore */ }
    return null
  }

  const saveToCache = (data: HomepageData) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, source: 'cache' }))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (err) { /* ignore */ }
  }

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TIMESTAMP_KEY)
  }

  const notifyListeners = (data: HomepageData) => {
    listeners.forEach(cb => cb(data))
  }

  // =================== FIREBASE LISTENER ===================
  const setupFirebaseListener = async (): Promise<void> => {
    if (unsubscribe) return
    try {
      const homepageRef = doc(db, 'homepage', 'content_v2')
      unsubscribe = onSnapshot(homepageRef, (docSnap) => {
        if (docSnap.exists()) {
          const firebaseData = docSnap.data() as HomepageData
          Object.assign(homepageData, { ...firebaseData, source: 'firebase' })
          saveToCache(homepageData)
          notifyListeners(homepageData)
          if (homepageData.settings?.isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          error.value = ''
          isListening.value = true
        } else {
          initializeFirebaseData()
          isListening.value = true
        }
      }, (err) => {
        error.value = `Firebase error: ${err.message}`
        isListening.value = false
      })
    } catch (err: any) {
      error.value = 'Failed to setup Firebase listener'
    }
  }

  const initializeFirebaseData = async (): Promise<boolean> => {
    try {
      checkPermission()
      const homepageRef = doc(db, 'homepage', 'content_v2')
      await setDoc(homepageRef, {
        ...homepageData,
        lastUpdated: new Date().toISOString(),
        source: 'firebase'
      })
      return true
    } catch (err: any) {
      error.value = 'Failed to initialize Firebase data: ' + err.message
      return false
    }
  }

  // =================== PUBLIC METHODS ===================
  const subscribeToUpdates = (callback: ListenerCallback): (() => void) => {
    listeners.add(callback)
    return () => listeners.delete(callback)
  }

  const loadHomepageData = async (forceRefresh: boolean = false): Promise<void> => {
    try {
      isLoading.value = true
      error.value = ''
      if (forceRefresh) clearCache()

      const cachedData = getCachedData()
      if (cachedData && !forceRefresh) {
        Object.assign(homepageData, cachedData)
        notifyListeners(cachedData)
      }

      await setupFirebaseListener()

      const homepageRef = doc(db, 'homepage', 'content_v2')
      const docSnap = await getDoc(homepageRef)
      if (docSnap.exists()) {
        const firebaseData = docSnap.data() as HomepageData
        Object.assign(homepageData, { ...firebaseData, source: 'firebase' })
        saveToCache(homepageData)
        notifyListeners(homepageData)
      } else {
        saveToCache(homepageData)
      }
    } catch (err: any) {
      error.value = 'Failed to load homepage data'
      const cachedData = getCachedData()
      if (cachedData) {
        Object.assign(homepageData, cachedData)
        notifyListeners(cachedData)
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateHomepageData = async (updates: Partial<HomepageData>): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true

      const homepageRef = doc(db, 'homepage', 'content_v2')
      const docSnap = await getDoc(homepageRef)
      const currentData = docSnap.exists() ? docSnap.data() as HomepageData : { ...homepageData }

      const newData: HomepageData = {
        ...currentData,
        ...updates,
        lastUpdated: new Date().toISOString(),
        source: 'firebase'
      }

      await setDoc(homepageRef, newData, { merge: false })

      Object.assign(homepageData, newData)
      clearCache()
      saveToCache(newData)
      notifyListeners(newData)

      return true
    } catch (err: any) {
      throw new Error(`Failed to update homepage: ${err.message}`)
    } finally {
      isLoading.value = false
    }
  }

  const toggleDarkMode = async (): Promise<boolean> => {
    try {
      checkPermission()
      const newDarkModeState = !homepageData.settings.isDarkMode
      await updateHomepageData({
        settings: { ...homepageData.settings, isDarkMode: newDarkModeState }
      })
      return newDarkModeState
    } catch (err) {
      return homepageData.settings.isDarkMode
    }
  }

  const resetToDefaults = async (): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      const resetData: HomepageData = {
        ...defaultLocalData,
        lastUpdated: new Date().toISOString(),
        source: 'default'
      }
      await updateHomepageData(resetData)
      return true
    } catch (err: any) {
      error.value = 'Failed to reset to defaults: ' + err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  const forceRefresh = async (): Promise<void> => {
    await loadHomepageData(true)
  }

  const checkConnection = async (): Promise<{ connected: boolean; lastUpdate?: string }> => {
    try {
      const docSnap = await getDoc(doc(db, 'homepage', 'content_v2'))
      return {
        connected: true,
        lastUpdate: docSnap.exists() ? (docSnap.data() as HomepageData).lastUpdated : undefined
      }
    } catch (err) {
      return { connected: false }
    }
  }

  const stopListening = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
      isListening.value = false
    }
    listeners.clear()
  }

  onUnmounted(() => stopListening())

  return {
    // STATE
    homepageData,
    isLoading,
    error,
    isListening,

    // ACTIONS
    loadHomepageData,
    stopListening,
    subscribeToUpdates,
    updateHomepageData,
    toggleDarkMode,
    resetToDefaults,
    forceRefresh,
    clearCache,
    checkConnection,
    initializeFirebaseData
  }
})