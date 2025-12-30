// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-12',
 modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    'nuxt-charts',
    'nuxt-studio',
    '@nuxt/scripts',
    '@nuxt/hints',
    'nuxt-google-translate',
    // 'nuxt-llms',
    // '@nuxtjs/mcp-toolkit',
  ],
  content: {
    database: {
      bindingName: 'DB', // Gunakan binding yang sama dengan NuxtHub
      type: 'd1',
    },
    build: {
      markdown: {
        toc: {
          depth: 2,
        },
      },
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
        prefix: 'jadu',
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
      openAPI: false,
      websocket: true,
    },
    minify: true,
    sourceMap: false,
    prerender: {
      crawlLinks: true,
      failOnError: false,
      ignore: ['/api/**', '/admin/**'],
      routes: ['/'],
    },

    preset: 'cloudflare_module',
  },
  googleTranslate: {
    defaultLanguage: 'id',
    supportedLanguages: ['id', 'en', 'es', 'ru'],
  },
  
  // vite: {
  //   build: {
  //     rollupOptions: {
  //       output: {
  //         manualChunks(id) {
  //           if (id.includes('node_modules')) {
  //             // 1. Kelompokkan UI & Animasi (Modul paling berat di list Anda)
  //             if (id.includes('@nuxt/ui') || id.includes('motion-v') || id.includes('@tailwindcss')) {
  //               return 'vendor-ui'
  //             }

  //             // 2. Kelompokkan Nuxt Content & Studio
  //             if (id.includes('@nuxt/content') || id.includes('nuxt-studio')) {
  //               return 'vendor-content'
  //             }

  //             // 3. Kelompokkan Charts & Data Viz
  //             if (id.includes('nuxt-charts') || id.includes('chart.js')) {
  //               return 'vendor-charts'
  //             }

  //             // 4. Kelompokkan Utilities (VueUse & Unhead)
  //             if (id.includes('@vueuse') || id.includes('@unhead')) {
  //               return 'vendor-utils'
  //             }

  //             // 5. Kelompokkan SEO & Scripts
  //             if (id.includes('@nuxtjs/seo') || id.includes('@nuxt/scripts')) {
  //               return 'vendor-marketing'
  //             }

  //             // 6. Vendor umum lainnya (kecuali core Nuxt/Vue agar tidak rusak)
  //             if (!id.includes('vue') && !id.includes('nuxt') && !id.includes('nitro')) {
  //               return 'vendor-others'
  //             }
  //           }
  //         },
  //       },
  //     },
  //   },
  // },

  // Mencegah masalah error "manualChunks" pada sisi server (SSR)
  hooks: {
    'content:file:beforeParse'(ctx) {
      const { file } = ctx;

      if (file.id.endsWith(".md")) {
        file.body = file.body.replace(/react/gi, "Vue");
      }
    },
    'content:file:afterParse'(ctx) {
      const { file, content } = ctx;

      const wordsPerMinute = 180;
      const text = typeof file.body === 'string' ? file.body : '';
      const wordCount = text.split(/\s+/).length;

      content.readingTime = Math.ceil(wordCount / wordsPerMinute);
    },
    // 'vite:extendConfig': function (config, { isServer }) {
    //   if (isServer && config.build?.rollupOptions?.output) {
    //     if (!Array.isArray(config.build.rollupOptions.output)) {
    //       config.build.rollupOptions.output.manualChunks = undefined
    //     }
    //   }
    // },
  },

  routeRules: {
    // Static pages - Prerender saat build time
    '/': { prerender: true },
    '/guru': { prerender: true },
    '/artikel': { prerender: true },
    '/berita': { prerender: true },
    '/kegiatan': { prerender: true },
    '/media': { prerender: true },

    // SWR - Otomatis mengatur cache-control & payload extraction
    '/artikel/**': { swr: 3600 },
    '/berita/**': { swr: 3600 },
    '/kegiatan/**': { swr: 7200 },
    '/guru/**': { swr: 7200 },

    // API routes
    '/api/**': { cors: true },
  },
  sitemap: {
    zeroRuntime: true,
  },
  app: {
    head: {
      link: [
        // Preconnect ke CDN untuk reduce TTFB
        { rel: 'preconnect', href: 'https://res.cloudinary.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://res.cloudinary.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      ],
    },
  },
  site: {
    url: 'https://sdnteja2.sch.id/',
    name: 'SDN TEJA II',
    description: 'Website resmi SDN Teja II, Kecamatan Rajagaluh, Kabupaten Majalengka, Jawa Barat',
    defaultLocale: 'id', // not needed if you have @nuxtjs/i18n installed
    themeColor: '#208bee',
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
  runtimeConfig: {
    cloudinary: {
      // Biarkan kosong atau dummy, Nuxt akan mengambil dari NUXT_CLOUDINARY_API_KEY
      apiKey: '',
      apiSecret: '',
      cloudName: '',
    },
    public: {
      cloudinaryBaseUrl: '', // Akan diisi oleh NUXT_PUBLIC_CLOUDINARY_BASE_URL
    },
  },
})