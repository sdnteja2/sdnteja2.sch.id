import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
// Reusable Schema Components
const SocialLink = z.object({
  icon: z.string(),
  link: z.string(),
  alt: z.string(),
})

const Pelatihan = z.object({
  title: z.string(),
  tahun: z.string(),
})

export default defineContentConfig({
  collections: {

    content: defineCollection({
      type: 'page',
      source: '**',
    }),

    pagelist: defineCollection({
      type: 'page',
      source: {
        include: '*.md',
        exclude: ['berita/**', 'artikel/**', 'guru/**', 'kegiatan/**', 'media/**'],
        prefix: '/',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),

    berita: defineCollection({
      type: 'page',
      source: {
        include: 'berita/*.md',
        prefix: '/berita',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tags: z.array(z.string()),
      }),
    }),

    guru: defineCollection({
      type: 'page',
      source: {
        include: 'guru/*.yml',
        prefix: '/guru',
      },
      schema: z.object({
        nama: z.string(),
        lengkap: z.string(),
        catatan: z.string(),
        kelas: z.string(),
        foto: z.string(),
        jabatan: z.string(),
        pendidikan: z.string(),
        pelatihan: z.array(Pelatihan),
        sosial: z.array(SocialLink).max(4).optional(),
      }),
    }),

    artikel: defineCollection({
      type: 'page',
      source: {
        include: 'artikel/*.md',
        prefix: '/artikel',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.date(),
        image: z.string(),
        tags: z.array(z.string()),
        readingTime: z.number().optional(),
      }),
    }),

    kegiatan: defineCollection({
      type: 'page',
      source: {
        include: 'kegiatan/*.yml',
        prefix: '/kegiatan',
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tag: z.string(),
        cover: z.string(),
      }),
    }),

    media: defineCollection({
      type: 'data',
      source: 'media/**',
      schema: z.object({
        title: z.string(),
        idVideo: z.string(),
        link: z.string(),
        kelas: z.enum(['1', '2', '3', '4', '5', '6']),
        pelajaran: z.string(),
      }),
      indexes: [
        { columns: ['kelas'] },
        { columns: ['pelajaran'] },
        { columns: ['idVideo'] },
        { columns: ['kelas', 'pelajaran'], name: 'idx_kelas_pelajaran' },
      ],
    }),

    buku: defineCollection({
      type: 'page',
      source: {
        include: 'buku/**/*.yml',
        prefix: '/buku',
      },
      schema: z.object({
        title: z.string(),
        kelas: z.enum(['1', '2', '3', '4', '5', '6']),
        pelajaran: z.string(),
        link: z.string(),
        tipe: z.enum(['Buku Siswa', 'Buku Guru']),
      }),
    }),
  },
})
