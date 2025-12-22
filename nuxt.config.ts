// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-studio',
    '@nuxthub/core-nightly',
  ],
   css: ['~/assets/css/main.css'],
   ui: {
    content: true
  },
  content: {
    database: {
      type: 'd1',
      bindingName: 'teja2db'
    }
  },
    hub: {
    // D1 database
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: { databaseId: '21086ffa-4f15-4181-8cb6-52dcb7f5c549' }
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
  compatibilityDate: '2025-12-22',
})