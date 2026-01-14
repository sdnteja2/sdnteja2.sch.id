/* eslint-disable no-console */
// server/routes/cdn/[id].pdf.ts
import { createError, defineEventHandler, getRouterParam, sendStream, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  // 1. Ambil ID dengan cara paling aman (params key bisa 'id' atau 'id.pdf' tergantung route matching)
  const params = event.context.params || {}
  const rawId = params['id.pdf'] || params.id || getRouterParam(event, 'id') || ''

  // 2. BERSIHKAN ID (Cleaning)
  // - .trim() menghapus spasi di depan/belakang (sering terjadi saat copas)
  // - .replace() menghapus akhiran .pdf (case insensitive)
  const fileId = rawId.replace(/\.pdf$/i, '').trim()

  if (!fileId) {
    throw createError({ statusCode: 400, statusMessage: 'File ID is missing' })
  }

  // 3. URL Google Drive
  const googleUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

  try {
    const response = await fetch(googleUrl, {
      method: 'GET',
      headers: {
        // User-Agent sangat penting agar tidak dianggap bot oleh Google
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      // redirect: 'follow' adalah default, tapi kita pertegas
      redirect: 'follow',
    })

    // Cek jika Google error (misal 404 atau 400)
    if (!response.ok) {
      console.error('❌ Google Response Error:', response.status, response.statusText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Google Drive Error: ${response.statusText}`,
      })
    }

    // Cek Content-Type dari Google
    const contentType = response.headers.get('content-type')

    // PENTING: Jika Google mengembalikan HTML (bukan PDF), biasanya karena "Virus Scan Warning" atau "Quota Exceeded"
    if (contentType && contentType.includes('text/html')) {
      console.error('❌ Google returned HTML instead of PDF (Likely Virus Scan Warning)')
      // Kita coba ambil text-nya untuk debug
      const text = await response.text()
      console.log('Preview response:', text.substring(0, 200)) // Lihat 200 huruf pertama
      throw createError({ statusCode: 502, statusMessage: 'Google Drive returned HTML (Virus Scan/Quota)' })
    }

    // 4. Sukses -> Teruskan ke Frontend
    setResponseHeader(event, 'Content-Type', 'application/pdf')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')
    setResponseHeader(event, 'Access-Control-Allow-Origin', '*')

    // Pakai nama file yang bersih
    setResponseHeader(event, 'Content-Disposition', `inline; filename="${fileId}.pdf"`)

    if (!response.body) {
      throw createError({ statusCode: 500, statusMessage: 'Empty response body from Google Drive' })
    }

    return sendStream(event, response.body)
  }
  catch (error: any) {
    console.error('🔥 Server Error:', error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
    })
  }
})
