// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    'nuxt-delay-hydration',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxthq/studio',
    '@vueuse/nuxt',
  ],
  site: {
    url: 'https://sdnteja2.sch.id',
    name: 'SDN Teja 2',
    description: 'Selamat datang di situs resmi SDN Teja 2! Dapatkan informasi terbaru dan penting mengenai sekolah kami.',
    defaultLocale: 'id', // Bahasa default Indonesia
  },
  content: {
    documentDriven: true,
    navigation: {
      fields: ['navTitle', 'icon'],
    },
    markdown: {
      anchorLinks: false,
    },

  },
  ui: {
    icons: ['hugeicons'],
    global: true,
  },
  colorMode: {
    preference: 'dark',
  },
  fonts: {
    families: [
      {
        name: 'Poppins',
        provider: 'google',
        weights: [400, 600, 700, 800, 900], // Anda bisa menambahkan bobot yang diperlukan
        styles: ['normal', 'italic'],
      },
      {
        name: 'Lato',
        provider: 'google',
        weights: [300, 400, 700, 900], // Anda bisa menambahkan bobot yang diperlukan
        styles: ['normal', 'italic'],
      },
    ],
  },
  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 64,
          height: 64,
        },
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 150,
          height: 150,
          quality: 80,
        },
      },
      gallery: {
        modifiers: {
          format: 'webp',
          width: 1024,
          height: 768,
          quality: 85,
        },
      },
      profile: {
        modifiers: {
          format: 'webp',
          width: 400,
          height: 400,
          quality: 90,
        },
      },
      card: {
        modifiers: {
          format: 'webp',
          width: 600,
          height: 900,
          quality: 75,
        },
      },
      wide: {
        modifiers: {
          format: 'webp',
          width: 1200,
          height: 800,
          quality: 80,
        },
      },
    },
  },
})