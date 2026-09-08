export interface CloudinaryImage {
  src: string
  alt?: string
}

export function useKegiatanImages(tag: MaybeRefOrGetter<string | undefined>) {
  const tagName = toRef(tag)
  const STORAGE_KEY_PREFIX = 'kegiatan-images-'
  const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 jam

  const data = useState<CloudinaryImage[]>(() => [])
  const pending = ref(false)
  const error = ref<Error | null>(null)

  const getFromLocalStorage = (tagKey: string): CloudinaryImage[] | null => {
    if (import.meta.client) {
      try {
        const cached = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tagKey}`)
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            return cachedData
          }
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${tagKey}`)
        }
      } catch (e) {
        console.warn('Cache error', e)
      }
    }
    return null
  }

  const saveToLocalStorage = (tagKey: string, images: CloudinaryImage[]) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${tagKey}`,
          JSON.stringify({
            data: images,
            timestamp: Date.now()
          })
        )
      } catch (e) {
        console.warn('Save cache error', e)
      }
    }
  }

  const fetchImages = async () => {
    if (!tagName.value) return

    const cached = getFromLocalStorage(tagName.value)
    if (cached && cached.length > 0) {
      data.value = cached
      return
    }

    try {
      pending.value = true
      const response = await $fetch<CloudinaryImage[]>('/api/get-images', {
        params: { tag: tagName.value }
      })

      if (Array.isArray(response)) {
        data.value = response
        if (response.length > 0) {
          saveToLocalStorage(tagName.value, response)
        }
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      pending.value = false
    }
  }

  watch(
    () => tagName.value,
    () => {
      fetchImages()
    },
    { immediate: true }
  )

  return {
    data,
    pending,
    error,
    refresh: fetchImages
  }
}
