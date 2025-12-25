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
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      wrangler: {
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'teja2',
            database_id: '21086ffa-4f15-4181-8cb6-52dcb7f5c549'
          }
        ]
      },
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-12-03',
})