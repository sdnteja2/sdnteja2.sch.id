export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Ambil query parameter
  const query = getQuery(event)
  const tagName = query.tag || 'default' // Default tag jika tidak ada query

  // Ambil kredensial dari runtimeConfig
  const cloudName = config.cloudinary.cloudName
  const apiKey = config.cloudinary.apiKey
  const apiSecret = config.cloudinary.apiSecret

  // Periksa apakah kredensial ada
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary credentials')
  }

  // Buat header autentikasi
  // eslint-disable-next-line node/prefer-global/buffer
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  try {
    // Panggil API Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${tagName}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`)
    }

    const data = await response.json()

    // Ambil hanya URL gambar
    return data.resources.map((image: { secure_url: any }) => ({
      src: image.secure_url,
    }))
  }
  catch (error) {
    return {
      error: true,
      message: (error as Error).message,
    }
  }
})
