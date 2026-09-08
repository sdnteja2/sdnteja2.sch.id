// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-studio',
    '@stefanobartoletti/nuxt-social-share'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    cloudinary: {
      apiKey: '',
      apiSecret: '',
      cloudName: ''
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
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
