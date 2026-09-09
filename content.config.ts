import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { z } from 'zod'

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])

const createBaseSchema = () =>
  z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty()
  })

const createLinkSchema = () =>
  z.object({
    label: z.string().nonempty(),
    to: z.string().nonempty(),
    icon: property(z.string().optional()).editor({ input: 'icon' }),
    size: sizeEnum.optional(),
    trailing: z.boolean().optional(),
    target: z.string().optional(),
    color: colorEnum.optional(),
    variant: variantEnum.optional()
  })

const createImageSchema = () =>
  z.object({
    src: property(z.string().nonempty()).editor({ input: 'media' }),
    alt: z.string().optional(),
    loading: z.enum(['lazy', 'eager']).optional(),
    srcset: z.string().optional()
  })

const createHighlightItemSchema = () =>
  z.object({
    icon: property(z.string().nonempty()).editor({ input: 'icon' }),
    title: z.string().nonempty(),
    description: z.string().nonempty()
  })

const createFacilityItemSchema = () =>
  z.object({
    name: z.string().nonempty(),
    category: z.string().nonempty(),
    description: z.string().nonempty(),
    image: property(z.string().nonempty()).editor({ input: 'media' }),
    icon: property(z.string().nonempty()).editor({ input: 'icon' }),
    features: z.array(z.string().nonempty())
  })

const createAlumniItemSchema = () =>
  z.object({
    nama: z.string().nonempty(),
    jabatan: z.string().nonempty(),
    kutipan: property(z.string().nonempty()).editor({ input: 'textarea' })
  })

const hiddenSeo = property(
  z.object({
    title: z.string().optional(),
    description: z.string().optional()
  }).optional()
).editor({ hidden: true })

const hiddenNavigation = property(
  z.union([
    z.boolean(),
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional()
    })
  ]).optional()
).editor({ hidden: true })

const createLabelValueSchema = () =>
  z.object({
    label: z.string().nonempty(),
    value: z.string().nonempty()
  })

const createRombelSchema = () =>
  z.object({
    rombel: z.string().nonempty(),
    male: z.number().int(),
    female: z.number().int(),
    total: z.number().int(),
    wali: z.string().nonempty()
  })

const createHabitSchema = () =>
  z.object({
    title: z.string().nonempty(),
    desc: z.string().nonempty(),
    icon: property(z.string().nonempty()).editor({ input: 'icon' })
  })

const createExtracurricularSchema = () =>
  z.object({
    name: z.string().nonempty(),
    schedule: z.string().nonempty(),
    desc: z.string().nonempty(),
    icon: property(z.string().nonempty()).editor({ input: 'icon' })
  })

export const collections = {
  index: defineCollection({
    source: '0.index.yml',
    type: 'page',
    schema: z.object({
      seo: hiddenSeo,
      navigation: hiddenNavigation,
      hero: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        title_highlight: z.string().optional(),
        description: property(z.string().nonempty()).editor({ input: 'textarea' }),
        links: z.array(createLinkSchema()),
        highlights: z.array(createHighlightItemSchema()).optional(),
        image: createImageSchema().optional(),
        mascot: z.object({
          src: property(z.string().nonempty()).editor({ input: 'media' }),
          alt: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional()
        }).optional()
      }),
      profile: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: property(z.string().nonempty()).editor({ input: 'textarea' }),
        quote: property(z.string().nonempty()).editor({ input: 'textarea' }),
        principal: z.object({
          name: z.string().nonempty(),
          role: z.string().nonempty(),
          location: z.string().nonempty(),
          avatar: property(z.string().nonempty()).editor({ input: 'media' })
        }),
        vision: property(z.string().nonempty()).editor({ input: 'textarea' }),
        missions: z.array(z.string().nonempty()),
        goals: z.array(z.string().nonempty())
      }),
      facilities_section: createBaseSchema().extend({
        headline: z.string().optional()
      }).optional(),
      alumni_section: createBaseSchema().extend({
        headline: z.string().optional(),
        cta: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          link: createLinkSchema()
        }).optional()
      }).optional()
    })
  }),
  facilities: defineCollection({
    source: 'facilities.yml',
    type: 'data',
    schema: z.object({
      items: z.array(createFacilityItemSchema())
    })
  }),
  alumni: defineCollection({
    source: 'alumni.yml',
    type: 'data',
    schema: z.object({
      items: z.array(createAlumniItemSchema())
    })
  }),
  sekolah: defineCollection({
    source: '1.sekolah.yml',
    type: 'data',
    schema: z.object({
      title: z.string().nonempty(),
      description: property(z.string().nonempty()).editor({ input: 'textarea' }),
      npsn: z.string().nonempty(),
      identity: z.array(createLabelValueSchema()),
      address: z.array(createLabelValueSchema()),
      verification_notice: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty()
      }).optional()
    })
  }),
  guru: defineCollection({
    type: 'data',
    source: 'guru/**.yml',
    schema: z.object({
      name: z.string().nonempty(),
      role: z.string().nonempty(),
      category: z.string().nonempty(),
      nip: z.string().default('-'),
      education: z.string().nonempty(),
      subject: z.string().nonempty(),
      avatar: property(z.string().nonempty()).editor({ input: 'icon' }),
      highlight: z.boolean().optional(),
      order: z.number().int().optional()
    })
  }),
  siswa: defineCollection({
    source: '2.siswa.yml',
    type: 'data',
    schema: z.object({
      title: z.string().nonempty(),
      description: property(z.string().nonempty()).editor({ input: 'textarea' }),
      academic_year: z.string().nonempty(),
      semester: z.string().nonempty(),
      rombels: z.array(createRombelSchema()),
      habits: z.array(createHabitSchema()),
      extracurriculars: z.array(createExtracurricularSchema())
    })
  }),
  berita: defineCollection({
    type: 'page',
    source: {
      include: 'berita/**',
      prefix: '/publikasi/berita'
    },
    schema: z.object({
      date: z.union([z.string(), z.date()]).optional(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional()
    })
  }),
  artikel: defineCollection({
    type: 'page',
    source: {
      include: 'artikel/**',
      prefix: '/publikasi/artikel'
    },
    schema: z.object({
      date: z.union([z.string(), z.date()]).optional(),
      author: z.string().optional(),
      image: property(z.string().optional()).editor({ input: 'media' }),
      tags: z.array(z.string()).optional(),
      readingTime: z.number().optional()
    })
  }),
  kegiatan: defineCollection({
    type: 'page',
    source: {
      include: 'kegiatan/**',
      prefix: '/publikasi/kegiatan'
    },
    schema: z.object({
      date: z.union([z.string(), z.date()]).optional(),
      tag: z.string().optional(),
      cover: property(z.string().optional()).editor({ input: 'media' }),
      gallery: z.array(z.string()).optional()
    })
  }),
  video: defineCollection({
    type: 'data',
    source: 'video/**',
    schema: z.object({
      title: z.string().nonempty(),
      idVideo: z.string().nonempty(),
      link: z.string().nonempty(),
      kelas: z.string().nonempty(),
      pelajaran: z.string().nonempty()
    })
  }),
  buku: defineCollection({
    type: 'page',
    source: {
      include: 'buku/**',
      prefix: '/media/buku'
    },
    schema: z.object({
      title: z.string(),
      kelas: z.string(),
      pelajaran: z.string(),
      link: z.string().optional(),
      tipe: z.string().optional(),
      image: z.string().optional(),
      driveId: z.string().optional()
    })
  })
}

export default defineContentConfig({
  collections
})
