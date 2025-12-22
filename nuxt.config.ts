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
  ],
   css: ['~/assets/css/main.css'],
   ui: {
    content: true
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-12-22',
})