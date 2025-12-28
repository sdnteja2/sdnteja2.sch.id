// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  // Development optimizations
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@nuxt/ui'))
                return 'nuxt-ui'
              if (id.includes('@nuxt/content'))
                return 'nuxt-content'
              if (id.includes('vue'))
                return 'vue'
              return 'vendor'
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ['vue', '@nuxt/ui', '@nuxt/content'],
    },
  },

  // TypeScript config - disable type checking during dev
  typescript: {
    strict: false,
    typeCheck: false, // Disable during dev untuk save memory
  },

  // Component metadata - optimize
  componentMeta: {
    exclude: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/dist/**',
    ],
  },

  content: {
    database: {
      bindingName: 'DB', // Gunakan binding yang sama dengan NuxtHub
      type: 'd1',
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  eslint: {
    config: {
      standalone: false,
    },
  },
  fonts: {
    // Konfigurasi untuk font heading dan body
    defaults: {
      fallbacks: {
        'sans-serif': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial'],
      },
      styles: ['normal'],
      subsets: ['latin'],
      weights: [400, 700],
    },
    families: [
      {
        name: 'Momo Trust Display',
        provider: 'google',
        styles: ['normal'],
        subsets: ['latin', 'latin-ext'],
        weights: [400],
        // Optimize font display untuk better LCP
        display: 'swap',
        preload: true,
      },
      {
        name: 'Google Sans',
        provider: 'google',
        styles: ['normal'],
        subsets: ['latin', 'latin-ext'],
        weights: [400, 500, 600, 700],
        // Optimize font display untuk better LCP
        display: 'swap',
        preload: true,
      },
    ],
    // Gunakan Google sebagai provider utama
    provider: 'google',
    // Optimize font loading untuk better LCP
    experimental: {
      disableLocalFallbacks: false,
    },
  },
  icon: {
    // collections: ['lucide', 'hugeicons'],
    customCollections: [
      {
        dir: './app/assets/icons',
        prefix: 'teja',
      },
    ],
  },

  image: {
    alias: {
      vimeo: 'https://i.vimeocdn.com',
      youtube: 'https://img.youtube.com',
    },
    domains: ['nuxtjs.org', 'res.cloudinary.com', 'img.youtube.com', 'i.vimeocdn.com'],
    format: ['webp', 'avif'],
    presets: {
      hero: {
        modifiers: {
          fit: 'cover',
          format: 'webp',
          height: 675,
          quality: 85,
          width: 1200,
        },
      },
    },
    provider: 'ipx',
    quality: 80,
    screens: {
      '2xl': 1536,
      'lg': 1024,
      'md': 768,
      'sm': 640,
      'xl': 1280,
      'xs': 320,
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-studio',
    'nuxt-component-meta',
  ],
  nitro: {
    cloudflare: {
      deployConfig: true,
      wrangler: {
        d1_databases: [
          {
            binding: 'DB',
            database_id: '21086ffa-4f15-4181-8cb6-52dcb7f5c549',
            database_name: 'teja2',
          },
        ],
      },
    },
    experimental: {
      openAPI: true,
      websocket: true,
    },
    prerender: {
      crawlLinks: true,
      failOnError: false,
      ignore: ['/api/**', '/admin/**'],
      routes: ['/'],
    },
    preset: 'cloudflare_module',
  },
  studio: {
    repository: {
      branch: 'master',
      owner: 'sdnteja2',
      provider: 'github', // 'github' or 'gitlab'
      repo: 'sdnteja2.sch.id',
    },
    route: '/admin',
  },
})
