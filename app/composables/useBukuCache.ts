// app/composables/useBukuCache.ts
export interface BukuMetadata {
  title: string
  kelas: string
  pelajaran: string
  link: string
  tipe: string
  path: string
}

export function useBukuCache(slug: string) {
  const STORAGE_KEY_PREFIX = 'buku-cache-'
  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 Jam
  
  const cacheKey = `${STORAGE_KEY_PREFIX}${slug}`

  const getFromLocalStorage = (): BukuMetadata | null => {
    if (import.meta.client) {
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            return data
          }
          localStorage.removeItem(cacheKey)
        }
      } catch (e) {
        console.warn('Buku Cache Error:', e)
      }
    }
    return null
  }

  const saveToLocalStorage = (data: BukuMetadata) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }))
      } catch (e) {
        console.warn('Failed to save Buku Cache:', e)
      }
    }
  }

  return {
    getFromLocalStorage,
    saveToLocalStorage
  }
}
