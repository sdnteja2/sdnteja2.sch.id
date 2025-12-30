export interface CloudinaryImage {
  src: string
  alt?: string
}

export function useKegiatanImages(tag: string | Ref<string | undefined>) {
  const tagName = isRef(tag) ? tag : ref(tag)
  const STORAGE_KEY_PREFIX = 'kegiatan-images-'
  const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 jam

  const data = useState<CloudinaryImage[]>(`images-${tagName.value}`, () => [])
  const pending = ref(false)
  const error = ref<Error | null>(null)

  const getFromLocalStorage = (tagKey: string) => {
    if (import.meta.client) {
      try {
        const cached = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tagKey}`)
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION)
            return cachedData
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${tagKey}`)
        }
      }
      catch (e) { console.warn('Cache error', e) }
    }
    return null
  }

  const saveToLocalStorage = (tagKey: string, images: CloudinaryImage[]) => {
    if (import.meta.client) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${tagKey}`, JSON.stringify({
        data: images,
        timestamp: Date.now(),
      }))
    }
  }

  const fetchImages = async () => {
    if (!tagName.value)
      return

    // Coba ambil dari localStorage dulu jika di client
    const cached = getFromLocalStorage(tagName.value)
    if (cached) {
      data.value = cached
      return
    }

    try {
      pending.value = true
      const response = await $fetch('/api/get-images', {
        params: { tag: tagName.value },
      })

      if (Array.isArray(response)) {
        data.value = response
        saveToLocalStorage(tagName.value, response)
      }
    }
    catch (e: any) {
      error.value = e
    }
    finally {
      pending.value = false
    }
  }

  // Watch perubahan tag untuk fetch ulang
  watch(tagName, () => {
    fetchImages()
  }, { immediate: true })

  return {
    data,
    pending,
    error,
    refresh: fetchImages,
  }
}
