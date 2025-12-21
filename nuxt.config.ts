/* eslint-disable node/prefer-global/process */
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [// Tambahkan eksplisit untuk color mode
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/image',
    'nuxt-booster',
    '@nuxt/scripts',
    'nuxt-google-translate',
    'nuxt-llms',
    'motion-v/nuxt',
    'nuxt-visitors',
    '@nuxt/fonts',
    '@nuxt/hints',
  ],
  experimental: {
    componentIslands: true,
    payloadExtraction: false,
    // Optimasi untuk mengurangi network requests
    writeEarlyHints: true,
    // Reduce initial bundle size
    treeshakeClientOnly: true,
    // Enable smart hydration strategies for Lazy components
    lazyHydration: true,
    // View transitions untuk better perceived performance
    viewTransition: true,
  },
  linkChecker: {
    runOnBuild: false,
  },
  googleTranslate: {
    defaultLanguage: 'id',
    supportedLanguages: ['id', 'en', 'es', 'ru'],
  },
  fonts: {
    // Konfigurasi untuk font Rubik yang sudah digunakan
    families: [
      {
        name: 'Rubik',
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
    themeColor: '#F22727',
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    storageKey: 'nuxt-color-mode', // key used to store the color mode preference
    classSuffix: '',
    classPrefix: '',
    dataValue: 'theme',
    // Tambahkan konfigurasi untuk menghindari hydration mismatch
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    storage: 'localStorage',
  },
  hub: {
    database: true,
    ai: true,
  },
  content: {
    preview: {
      api: 'https://api.nuxt.studio',
      dev: true,
    },
    database: {
      type: 'd1',
      bindingName: 'teja2',
    },
  },
  llms: {
    domain: 'https://sdnteja2.sch.id',
    title: 'SDN Teja II - Sekolah Dasar Negeri Teja II',
    description: 'Website resmi SDN Teja II, Kecamatan Rajagaluh, Kabupaten Majalengka, Jawa Barat. Sekolah dasar yang berkomitmen memberikan pendidikan berkualitas dengan tenaga pendidik profesional.',
    sections: [
      {
        title: 'Profil Guru dan Tenaga Pendidik',
        description: 'Daftar lengkap guru dan tenaga pendidik SDN Teja II dengan informasi jabatan, pendidikan, kelas yang diajar, dan pengalaman pelatihan profesional. Termasuk data kepala sekolah, guru kelas, dan staf pendidikan lainnya.',
        contentCollection: 'guru',
        contentFilters: [
          { field: 'extension', operator: '=', value: 'yml' },
        ],
      },
      {
        title: 'Berita dan Pengumuman Sekolah',
        description: 'Berita terbaru, pengumuman resmi, dan informasi penting dari SDN Teja II termasuk kegiatan akademik, kebijakan sekolah, dan perkembangan institusi. Mencakup informasi ANBK, pergantian kepala sekolah, dan jadwal pembelajaran.',
        contentCollection: 'berita',
        contentFilters: [
          { field: 'extension', operator: '=', value: 'md' },
        ],
      },
      {
        title: 'Kegiatan dan Program Sekolah',
        description: 'Dokumentasi kegiatan sekolah, program ekstrakurikuler, acara khusus, dan berbagai aktivitas yang dilaksanakan di SDN Teja II. Termasuk serah terima jabatan, kegiatan kebersihan, dan program pengembangan karakter siswa.',
        contentCollection: 'kegiatan',
        contentFilters: [
          { field: 'extension', operator: '=', value: 'yml' },
        ],
      },
      {
        title: 'Artikel Pendidikan dan Informasi Umum',
        description: 'Artikel edukatif, panduan pendidikan, informasi PPDB/SPMB, sejarah pendidikan, rapor pendidikan, dan konten informatif lainnya yang relevan dengan dunia pendidikan dasar di Indonesia.',
        contentCollection: 'artikel',
        contentFilters: [
          { field: 'extension', operator: '=', value: 'md' },
        ],
      },
    ],
  },
  eslint: {
    config: {
      standalone: false,
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
    // Preload critical images
    preload: {
      default: true,
      sizes: [640, 768, 1024, 1280],
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
  icon: {
    customCollections: [
      {
        prefix: 'narr',
        dir: './app/assets/icons',
      },
    ],
    // Reduce icon API requests dengan bundling

  },

  booster: {
    detection: {
      performance: true,
      browserSupport: true,
      battery: true,
    },
    performanceMetrics: {
      timing: {
        fcp: 800,
        dcl: 1200,
      },
    },
    optimizeSSR: {
      cleanPreloads: true,
      cleanPrefetches: true,
      inlineStyles: true,
    },
    /**
     * IntersectionObserver rootMargin for Components and Assets
     */
    lazyOffset: {
      component: '0%',
      asset: '0%',
    },
    // Optimasi untuk target format images
    targetFormats: ['webp', 'avif', 'jpg', 'png', 'gif'],
  },
  ssr: true,
  routeRules: {
    // Static pages - prerender untuk LCP optimal
    '/': { prerender: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } },
    '/guru': { prerender: true, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } },
    
    // Stale-while-revalidate untuk konten dinamis
    '/artikel/**': { swr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } }, // 1 jam
    '/berita/**': { swr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } },
    '/kegiatan/**': { swr: 7200, headers: { 'cache-control': 's-maxage=7200, stale-while-revalidate=14400' } }, // 2 jam
    '/guru/**': { swr: 7200, headers: { 'cache-control': 's-maxage=7200, stale-while-revalidate=14400' } },
    
    // API routes
    '/api/**': { 
      cors: true,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      // ignore: ['/api/**', '/kegiatan/**'],
    },
    experimental: {
      websocket: true,
      openAPI: true,
    },
    // Bundle splitting untuk mengurangi ukuran JavaScript
    rollupConfig: {
      output: {
        manualChunks: (id) => {
          // Biarkan Nuxt menangani Vue dan dependencies utama
          if (id.includes('node_modules')) {
            // Group UI libraries
            if (id.includes('@headlessui') || id.includes('@tailwindcss')) {
              return 'ui-libs'
            }
            // Group utilities
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('validator')) {
              return 'utils'
            }
            // Group other vendor dependencies
            if (id.includes('node_modules') && !id.includes('vue') && !id.includes('@vue')) {
              return 'vendor'
            }
          }
        },
      },
    },
    // Konfigurasi cache headers untuk meningkatkan performa

  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  runtimeConfig: {
    cloudinary: {
      apiKey: process.env.NUXT_CLOUDINARY_API_KEY || '747436524922873',
      apiSecret: process.env.NUXT_CLOUDINARY_API_SECRET || 'dunxYcRv6GQls_MqTPycjkJQH3E',
      cloudName: process.env.NUXT_CLOUDINARY_CLOUD_NAME || 'dyy24w5kl',
    },
    public: {
      cloudinaryBaseUrl: `https://res.cloudinary.com/${process.env.NUXT_CLOUDINARY_CLOUD_NAME || 'dyy24w5kl'}`,
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/artikel/**': { swr: 3600 }, // Static with revalidation
    '/berita/**': { swr: 3600 },
    '/guru/**': { prerender: true },
    '/kegiatan/**': { swr: 7200 },
    '/api/**': { cors: true },
  },
})
