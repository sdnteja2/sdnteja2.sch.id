// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'motion-v/nuxt',
    'nuxt-studio',
    '@nuxthub/core-nightly',
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    content: true,
  },
  studio: {
    route: '/admin',
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'sdnteja2',
      repo: 'sdnteja2.sch.id',
      branch: 'master',
    },
  },
  content: {
    database: {
      type: 'd1',
      bindingName: 'teja2',
    },
  },
  hub: {
    // D1 database
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: { databaseId: '21086ffa-4f15-4181-8cb6-52dcb7f5c549' },
    },
  },
  nitro: {
    prerender: {
      // Pre-render the homepage
      routes: ['/'],
      // Then crawl all the links on the page
      crawlLinks: true,
    },
    preset: 'cloudflare_module',

  },
  routeRules: {
    '/': { prerender: true },
    '/admin/**': { ssr: true }, // Nuxt Studio route harus SSR
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  image: {
    provider: 'ipx',
    format: ['webp', 'avif'],
    quality: 80,
    domains: ['nuxtjs.org', 'res.cloudinary.com', 'img.youtube.com', 'i.vimeocdn.com'],
    alias: {
      youtube: 'https://img.youtube.com',
      vimeo: 'https://i.vimeocdn.com',
    },
    // Preload critical images
    // preload: {
    //   default: true,
    //   sizes: [640, 768, 1024, 1280],
    // },
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
    presets: {
      hero: {
        modifiers: {
          format: 'webp',
          quality: 85,
          width: 1200,
          height: 675,
          fit: 'cover',
        },
      },
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-12-22',
})
