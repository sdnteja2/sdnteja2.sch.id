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
      // Pre-render the homepage
      routes: ['/'],
      // Then crawl all the links on the page
      crawlLinks: true,
     },
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
    routeRules: {
    '/': { prerender: true },
    '/admin/**': { ssr: true }, // Nuxt Studio route harus SSR
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
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-12-03',
})