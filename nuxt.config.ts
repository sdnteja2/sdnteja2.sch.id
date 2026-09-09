// https://nuxt.com/docs/api/configuration/nuxt-config
import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

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
    description: 'Website resmi SD Negeri Teja II, Kecamatan Rajagaluh, Kabupaten Majalengka. Sekolah ramah anak yang menumbuhkan karakter, literasi, dan potensi siswa.',
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
    '/publikasi/kegiatan': { swr: true },
    '/publikasi/kegiatan/**': { swr: true },
    '/kegiatan/**': { swr: true },
    '/media/buku': { swr: true },
    '/media/buku/**': { swr: true },
    '/buku/**': { swr: true },
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
