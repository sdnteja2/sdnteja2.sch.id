export interface SuratData {
  no: number
  no_surat: string | number
  perihal: string
  tanggal: string
  penandatangan: string
  jabatan: string
  url: string
  slug: string
  qr_url: string
}

export function useSuratData() {
  const apiUrl = 'https://script.google.com/macros/s/AKfycbw4lspp_ReNmGs_-tysbOhazfqDuWXE0sMVvPbZA9awkLTDfpLHmtPrMmCB-EQ6woo/exec'

  /**
   * Fetch all surat data from Google Sheets
   */
  const fetchAllSuratData = async (): Promise<SuratData[]> => {
    try {
      const response = await $fetch<SuratData[]>(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response || []
    }
    catch (error) {
      console.error('Error fetching surat data:', error)
      throw error
    }
  }

  /**
   * Fetch specific surat data by slug
   */
  const fetchSuratBySlug = async (slug: string): Promise<SuratData | null> => {
    try {
      const allData = await fetchAllSuratData()
      return allData.find(item => item.slug === slug) || null
    }
    catch (error) {
      console.error('Error fetching surat by slug:', error)
      return null
    }
  }

  /**
   * Validate if a surat exists by slug
   */
  const validateSuratSlug = async (slug: string): Promise<boolean> => {
    try {
      const surat = await fetchSuratBySlug(slug)
      return surat !== null
    }
    catch {
      return false
    }
  }

  /**
   * Format tanggal for display
   */
  const formatTanggal = (tanggal: string): string => {
    try {
      // Assuming format is DD/MM/YYYY
      const parts = tanggal.split('/')
      if (parts.length !== 3)
        return tanggal

      const [day, month, year] = parts
      if (!day || !month || !year)
        return tanggal

      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))

      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    catch {
      return tanggal // Return original if formatting fails
    }
  }

  /**
   * Generate QR Code URL if not provided
   */
  const generateQRUrl = (url: string, size: string = '150x150'): string => {
    const encodedUrl = encodeURIComponent(url)
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodedUrl}`
  }

  return {
    fetchAllSuratData,
    fetchSuratBySlug,
    validateSuratSlug,
    formatTanggal,
    generateQRUrl,
  }
}
