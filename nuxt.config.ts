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
})
