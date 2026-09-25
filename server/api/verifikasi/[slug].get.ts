/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const config = useRuntimeConfig(event)

  // Pastikan data SELALU instan dan real-time (tanpa cache di browser maupun CDN)
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')
  setHeader(event, 'Surrogate-Control', 'no-store')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parameter slug diperlukan'
    })
  }

  // Khusus untuk preview & demonstrasi lokal (/verifikasi/demo atau /verifikasi/contoh)
  if (slug.toLowerCase() === 'demo' || slug.toLowerCase() === 'contoh') {
    return {
      status: 'success',
      data: {
        no_surat: '421.2/028/SDN.Teja.II/IX/2026',
        perihal: 'Surat Tugas Pelaksanaan ANBK & Pembiasaan Literasi Digital',
        tanggal: '25/09/2026',
        penandatangan: 'Susi Susanti, S.Pd.I., M.Pd.',
        jabatan: 'Kepala Sekolah',
        url_dokumen: 'https://drive.google.com/drive/folders/1D7SyY8zbczZOFXfGzt3aj5WNRa6WpEZN',
        slug: slug.toUpperCase(),
        status_valid: true
      }
    }
  }

  // URL Google Apps Script Web App (diambil dari env NUXT_PUBLIC_APPS_SCRIPT_URL)
  const scriptUrl = config.public?.appsScriptUrl || process.env.NUXT_PUBLIC_APPS_SCRIPT_URL

  if (!scriptUrl) {
    return {
      status: 'pending_setup',
      message: 'URL Google Apps Script belum dikonfigurasi di environment variable.',
      slug
    }
  }

  try {
    // Tambahkan parameter timestamp agar Google Apps Script selalu membaca data baris terbaru dari Spreadsheet
    const targetUrl = `${scriptUrl}?action=tte&slug=${encodeURIComponent(slug)}&_t=${Date.now()}`
    const res = await $fetch<any>(targetUrl, {
      timeout: 12000,
      retry: 1
    })

    return res
  } catch (error: any) {
    console.error('Gagal mengambil data verifikasi dari Google Apps Script:', error)
    return {
      status: 'error',
      message: 'Gagal terhubung ke basis data Google Spreadsheet.',
      error: error?.message || 'Unknown error'
    }
  }
})
