// app/composables/useSiswaData.ts
/* eslint-disable no-console */
export interface SiswaData {
  id?: number
  nama?: string
  name?: string
  kelas?: string | number
  class?: string | number
  nis?: number
  nisn?: string
  jk?: 'L' | 'P'
  jenis_kelamin?: 'L' | 'P'
  gender?: 'L' | 'P'
  usia?: number
  age?: number
  tanggal_lahir?: string
  birth_date?: string
  [key: string]: any
}

export interface SiswaApiResponse {
  data?: SiswaData[]
  siswa?: SiswaData[]
  students?: SiswaData[]
  [key: string]: any
}

export function useSiswaData() {
  const STORAGE_KEY = 'siswa-data-cache'
  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 jam dalam milliseconds

  // Helper: Get data from localStorage
  const getFromLocalStorage = (): SiswaData[] | null => {
    if (import.meta.client) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY)
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached)
          const age = Date.now() - timestamp

          // Jika belum expired, gunakan cache
          if (age < CACHE_DURATION) {
            console.log('✓ Loaded from localStorage. Age:', Math.round(age / (60 * 60 * 1000)), 'hours')
            return cachedData
          }
          else {
            // Clear expired cache
            console.log('⚠ localStorage cache expired, clearing...')
            localStorage.removeItem(STORAGE_KEY)
          }
        }
      }
      catch (error) {
        console.warn('⚠ Failed to read localStorage:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    return null
  }

  // Helper: Save data to localStorage
  const saveToLocalStorage = (data: SiswaData[]) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
        }))
        console.log('✓ Saved to localStorage')
      }
      catch (error) {
        console.warn('⚠ Failed to save to localStorage:', error)
      }
    }
  }

  // Initialize dengan data dari localStorage jika ada
  const data = useState<SiswaData[]>('siswa-data', () => {
    return getFromLocalStorage() || []
  })

  const pending = ref(false)
  const error = ref<Error | null>(null)
  const hasLoaded = useState<boolean>('siswa-data-loaded', () => {
    // Jika ada data dari localStorage, anggap sudah loaded
    return data.value.length > 0
  })

  // Try to fetch real data but don't block if it fails
  const fetchRealData = async () => {
    try {
      pending.value = true
      error.value = null

      // Try our server API endpoint
      const response = await $fetch('/api/siswa', {
        method: 'GET',
      })

      if (Array.isArray(response) && response.length > 0) {
        data.value = response
        hasLoaded.value = true

        // Simpan ke localStorage
        saveToLocalStorage(response)

        console.log('✓ Successfully loaded student data:', response.length, 'records')
      }
      else {
        console.warn('⚠ Server returned no data')
        data.value = []
      }
    }
    catch (fetchError: any) {
      console.error('❌ Failed to fetch student data:', fetchError.message)
      error.value = fetchError
      data.value = [] // Set empty array on error
    }
    finally {
      pending.value = false
    }
  }

  // Auto-fetch hanya jika belum pernah load dan di client side
  if (import.meta.client && !hasLoaded.value) {
    fetchRealData()
  }

  const refresh = () => {
    if (import.meta.client) {
      fetchRealData()
    }
  }

  // Computed statistics
  const totalSiswa = computed(() => data.value?.length || 0)

  const siswaLakiLaki = computed(() =>
    data.value?.filter(siswa =>
      siswa.jk === 'L' || siswa.jenis_kelamin === 'L' || siswa.gender === 'L',
    ).length || 0,
  )

  const siswaPerempuan = computed(() =>
    data.value?.filter(siswa =>
      siswa.jk === 'P' || siswa.jenis_kelamin === 'P' || siswa.gender === 'P',
    ).length || 0,
  )

  const availableKelas = computed(() => {
    if (!data.value)
      return []

    const kelasSet = new Set<string | number>()
    data.value.forEach((siswa) => {
      const kelas = siswa.kelas || siswa.class
      if (kelas !== undefined && kelas !== null) {
        kelasSet.add(kelas)
      }
    })
    // Sort with numbers first, then strings
    return Array.from(kelasSet).sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number')
        return a - b
      if (typeof a === 'number')
        return -1
      if (typeof b === 'number')
        return 1
      return String(a).localeCompare(String(b))
    })
  })

  // Helper function to filter data
  const filterSiswa = (
    searchQuery?: string,
    selectedKelas?: string | number,
    selectedGender?: string,
  ) => {
    if (!data.value)
      return []

    let result = [...data.value]

    // Filter by search query
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((siswa) => {
        const nama = (siswa.nama || siswa.name || '').toLowerCase()
        const nisn = (siswa.nisn || siswa.nis || '').toString().toLowerCase()
        return nama.includes(query) || nisn.includes(query)
      })
    }

    // Filter by kelas
    if (selectedKelas !== undefined && selectedKelas !== null && selectedKelas !== '') {
      result = result.filter((siswa) => {
        const kelas = siswa.kelas || siswa.class
        // eslint-disable-next-line eqeqeq
        return kelas == selectedKelas // Use == for type coercion (number vs string)
      })
    }

    // Filter by gender
    if (selectedGender) {
      result = result.filter((siswa) => {
        const gender = siswa.jk || siswa.jenis_kelamin || siswa.gender
        return gender === selectedGender
      })
    }

    return result
  }

  // Helper function to format date
  const formatTanggal = (tanggal: string | undefined) => {
    if (!tanggal)
      return '-'

    try {
      const date = new Date(tanggal)
      if (Number.isNaN(date.getTime())) {
        // Try parsing different date formats
        const formats = [
          /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY or DD/MM/YYYY
          /(\d{1,2})-(\d{1,2})-(\d{4})/, // MM-DD-YYYY or DD-MM-YYYY
          /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
        ]

        for (const format of formats) {
          const match = tanggal.match(format)
          if (match) {
            const parsedDate = new Date(tanggal)
            if (!Number.isNaN(parsedDate.getTime())) {
              return parsedDate.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            }
          }
        }

        return tanggal // Return as-is if can't parse
      }

      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }
    catch {
      return tanggal
    }
  }

  // Helper function to get gender label
  const getGenderLabel = (siswa: SiswaData) => {
    const gender = siswa.jk || siswa.jenis_kelamin || siswa.gender
    switch (gender) {
      case 'L': return 'Laki-laki'
      case 'P': return 'Perempuan'
      default: return '-'
    }
  }

  // Computed property for class breakdown
  const kelasBreakdown = computed(() => {
    if (!data.value)
      return []

    const breakdown = new Map<string | number, { kelas: string | number, laki: number, perempuan: number, total: number }>()

    data.value.forEach((siswa) => {
      const kelas = siswa.kelas || siswa.class || 'Tidak Diketahui'
      const gender = siswa.jk || siswa.jenis_kelamin || siswa.gender

      if (!breakdown.has(kelas)) {
        breakdown.set(kelas, { kelas, laki: 0, perempuan: 0, total: 0 })
      }

      const kelasData = breakdown.get(kelas)!
      kelasData.total++

      if (gender === 'L') {
        kelasData.laki++
      }
      else if (gender === 'P') {
        kelasData.perempuan++
      }
    })

    // Convert map to array and sort by class
    return Array.from(breakdown.values()).sort((a, b) => {
      // Sort numbers first
      if (typeof a.kelas === 'number' && typeof b.kelas === 'number') {
        return a.kelas - b.kelas
      }
      if (typeof a.kelas === 'number')
        return -1
      if (typeof b.kelas === 'number')
        return 1

      // Custom sort for string classes (KELAS 1, KELAS 2, etc.)
      const getClassNumber = (kelas: string | number) => {
        if (typeof kelas === 'number')
          return kelas
        const match = String(kelas).match(/KELAS (\d+)|KELAS (\w+)|^(\d+)$/)
        if (match) {
          const num = match[1] || match[2] || match[3]
          if (num) {
            const parsed = Number.parseInt(num)
            return Number.isNaN(parsed) ? 999 : parsed
          }
        }
        return 999
      }
      return getClassNumber(a.kelas) - getClassNumber(b.kelas)
    })
  })

  return {
    // Data
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),

    // Actions
    refresh,

    // Computed statistics
    totalSiswa,
    siswaLakiLaki,
    siswaPerempuan,
    availableKelas,
    kelasBreakdown,

    // Helper functions
    filterSiswa,
    formatTanggal,
    getGenderLabel,
  }
}
