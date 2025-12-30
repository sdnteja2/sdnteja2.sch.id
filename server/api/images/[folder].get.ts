import { readdir } from 'node:fs/promises'
// eslint-disable-next-line unused-imports/no-unused-imports
import { join, normalize, resolve, sep } from 'node:path'

export default defineEventHandler(async (event) => {
  const folder = event.context.params?.folder

  if (!folder) {
    return []
  }

  const baseDir = resolve('public/kegiatan')
  const imageDir = resolve(baseDir, folder)

  if (!normalize(imageDir).startsWith(normalize(baseDir + sep))) {
    return []
  }

  try {
    const files = await readdir(imageDir)
    // eslint-disable-next-line regexp/no-unused-capturing-group
    const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    return images.map(filename => `/kegiatan/${folder}/${filename}`)
  }
  catch {
    return []
  }
})
