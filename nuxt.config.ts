import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const contentRoutes = [
  '/',
  '/data',
  '/data/sekolah',
  '/data/guru',
  '/data/siswa',
  '/media',
  '/media/buku',
  '/media/video',
  '/publikasi',
  '/publikasi/artikel',
  '/publikasi/berita',
  '/publikasi/kegiatan'
]

const mapContentDir = (dir: string, prefix: string) => {
  const full = resolve(process.cwd(), dir)
  if (existsSync(full)) {
    readdirSync(full).forEach((file) => {
      if (file.endsWith('.md') || file.endsWith('.yml') || file.endsWith('.yaml')) {
        const slug = file.replace(/^\d+\./, '').replace(/\.(md|yml|yaml)$/, '')
        contentRoutes.push(`${prefix}/${slug}`)
      }
    })
  }
}

mapContentDir('content/artikel', '/publikasi/artikel')
mapContentDir('content/berita', '/publikasi/berita')
mapContentDir('content/kegiatan', '/publikasi/kegiatan')
mapContentDir('content/buku', '/media/buku')

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    'nuxt-studio',
    '@stefanobartoletti/nuxt-social-share',
    '@nuxt/scripts',
    'nuxt-pdf-kit'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://sdnteja2.sch.id',
    name: 'SD Negeri Teja II',
    description:
      'Website resmi SD Negeri Teja II, Kecamatan Rajagaluh, Kabupaten Majalengka. Sekolah ramah anak yang menumbuhkan karakter, literasi, dan potensi siswa.',
    defaultLocale: 'id',
    indexable: true,
    trailingSlash: false
  },

  runtimeConfig: {
    cloudinary: {
      apiKey: '',
      apiSecret: '',
      cloudName: ''
    }
  },

  routeRules: {
    '/**': { prerender: true },
    '/media/buku/**': { ogImage: false },
    '/artikel/**': { redirect: { to: '/publikasi/artikel/**', statusCode: 301 } },
    '/berita/**': { redirect: { to: '/publikasi/berita/**', statusCode: 301 } },
    '/kegiatan/**': { redirect: { to: '/publikasi/kegiatan/**', statusCode: 301 } },
    '/buku/**': { redirect: { to: '/media/buku/**', statusCode: 301 } },
    '/_og/**': {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=43200, must-revalidate',
        'CDN-Cache-Control': 'max-age=43200'
      }
    },
    '/__og-image__/**': {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=43200, must-revalidate',
        'CDN-Cache-Control': 'max-age=43200'
      }
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: contentRoutes,
      ignore: ['/__nuxt_content/']
    }
  },

  hooks: {
    'build:before'() {
      const metaPath = resolve(process.cwd(), '.nuxt/component-meta.mjs')
      try {
        if (!existsSync(metaPath)) {
          writeFileSync(metaPath, 'export default {}\n', 'utf-8')
        }
      } catch {
        // Ignore
      }
    },
    'nitro:config'() {
      const metaPath = resolve(process.cwd(), '.nuxt/component-meta.mjs')
      try {
        if (!existsSync(metaPath)) {
          writeFileSync(metaPath, 'export default {}\n', 'utf-8')
        }
      } catch {
        // Ignore
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    serverBundle: 'local'
  },

  ogImage: {
    zeroRuntime: true
  },

  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/']
      }
    ],
    sitemap: ['https://sdnteja2.sch.id/sitemap.xml']
  },

  schemaOrg: {
    identity: {
      type: 'School',
      name: 'SD Negeri Teja II',
      url: 'https://sdnteja2.sch.id',
      logo: '/logo.png'
    }
  },

  sitemap: {
    zeroRuntime: true
  },

  socialShare: {
    baseUrl: 'https://sdnteja2.sch.id'
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'sdnteja2',
      repo: 'sdnteja2.sch.id',
      branch: 'master'
    },
    editor: {
      components: {
        exclude: ['content/prose/**', 'Prose*']
      }
    }
  }
})
