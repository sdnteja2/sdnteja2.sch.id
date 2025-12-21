export interface SiswaData {
  id?: number
  nama?: string
  name?: string
  kelas?: string
  class?: string
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
  // Data reactive refs - menggunakan shallowRef untuk performa karena data besar
  const data = shallowRef<SiswaData[]>([]) // Start with empty data
  const pending = ref(false)
  const error = ref<Error | null>(null)

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
        console.warn('Successfully loaded student data:', response.length, 'records')
      }
      else {
        console.warn('Server returned no data')
        data.value = []
      }
    }
    catch (fetchError: any) {
      console.error('Failed to fetch student data:', fetchError.message)
      error.value = fetchError
      data.value = [] // Set empty array on error
    }
    finally {
      pending.value = false
    }
  }

  // Auto-fetch on client side
  if (import.meta.client) {
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

    const kelasSet = new Set<string>()
    data.value.forEach((siswa) => {
      const kelas = siswa.kelas || siswa.class
      if (kelas && typeof kelas === 'string') {
        kelasSet.add(kelas.trim())
      }
    })
    return Array.from(kelasSet).sort()
  })

  // Helper function to filter data
  const filterSiswa = (
    searchQuery?: string,
    selectedKelas?: string,
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
        const nisn = (siswa.nisn || '').toString().toLowerCase()
        return nama.includes(query) || nisn.includes(query)
      })
    }

    // Filter by kelas
    if (selectedKelas) {
      result = result.filter((siswa) => {
        const kelas = siswa.kelas || siswa.class
        return kelas === selectedKelas
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

    const breakdown = new Map<string, { kelas: string, laki: number, perempuan: number, total: number }>()

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

    // Convert map to array and sort by class name
    return Array.from(breakdown.values()).sort((a, b) => {
      // Custom sort to put KELAS 1, KELAS 2, etc. in order
      const getClassNumber = (kelas: string) => {
        const match = kelas.match(/KELAS (\d+)/)
        return match && match[1] ? Number.parseInt(match[1]) : 999
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
