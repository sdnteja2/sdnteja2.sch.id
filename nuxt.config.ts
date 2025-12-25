// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-studio',
    'motion-v/nuxt',
    '@vueuse/nuxt',
  ],
  ui: {
    content: true,
  },
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB', // Gunakan binding yang sama dengan NuxtHub
    },
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      ignore: ['/api/**', '/admin/**'],
      failOnError: false,
    },
    experimental: {
      websocket: true,
      openAPI: true,
    },
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      wrangler: {
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'teja2',
            database_id: '21086ffa-4f15-4181-8cb6-52dcb7f5c549',
          },
        ],
      },
    },
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
  fonts: {
    // Konfigurasi untuk font heading dan body
    families: [
      {
        name: 'Momo Trust Display',
        provider: 'google',
        weights: [400],
        styles: ['normal'],
        subsets: ['latin', 'latin-ext'],
        // Optimize font display untuk better LCP
        display: 'swap',
        preload: true,
      },
      {
        name: 'Google Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        subsets: ['latin', 'latin-ext'],
        // Optimize font display untuk better LCP
        display: 'swap',
        preload: true,
      },
    ],
    defaults: {
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: {
        'sans-serif': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial'],
      },
    },
    // Gunakan Google sebagai provider utama
    provider: 'google',
    // Optimize font loading untuk better LCP
    experimental: {
      disableLocalFallbacks: false,
    },
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
   image: {
    provider: 'ipx',
    format: ['webp', 'avif'],
    quality: 80,
    domains: ['nuxtjs.org', 'res.cloudinary.com', 'img.youtube.com', 'i.vimeocdn.com'],
    alias: {
      youtube: 'https://img.youtube.com',
      vimeo: 'https://i.vimeocdn.com',
    },
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
  experimental: {
    componentIslands: true,
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-12-03',
})