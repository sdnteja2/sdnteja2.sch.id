import { readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { normalize, resolve, sep } from 'node:path'

export interface CloudinaryImage {
  src: string
  alt?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const tagName = (query.tag as string) || 'default'

  // 1. Cek apakah ada file lokal di public/kegiatan/[tag]
  const baseDir = resolve('public/kegiatan')
  const imageDir = resolve(baseDir, tagName)

  if (normalize(imageDir).startsWith(normalize(baseDir + sep)) && existsSync(imageDir)) {
    try {
      const files = await readdir(imageDir)
      const images = files
        .filter(file => /\.(jpg|jpeg|png|webp|avif)$/i.test(file))
        .map(filename => ({
          src: `/kegiatan/${tagName}/${filename}`,
          alt: tagName
        }))
      if (images.length > 0) {
        return images
      }
    } catch {
      // lanjut ke Cloudinary jika gagal membaca lokal
    }
  }

  // 2. Ambil dari Cloudinary jika kredensial tersedia
  const cloudName
    = (config.cloudinary as Record<string, string>)?.cloudName
      || process.env.NUXT_CLOUDINARY_CLOUD_NAME
      || process.env.CLOUDINARY_CLOUD_NAME
  const apiKey
    = (config.cloudinary as Record<string, string>)?.apiKey
      || process.env.NUXT_CLOUDINARY_API_KEY
      || process.env.CLOUDINARY_API_KEY
  const apiSecret
    = (config.cloudinary as Record<string, string>)?.apiSecret
      || process.env.NUXT_CLOUDINARY_API_SECRET
      || process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return []
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(tagName)}`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return (data.resources || []).map((img: { secure_url: string, public_id?: string }) => ({
      src: img.secure_url,
      alt: img.public_id || tagName
    }))
  } catch {
    return []
  }
})
