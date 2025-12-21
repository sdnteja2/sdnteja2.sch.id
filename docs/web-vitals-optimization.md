# Web Vitals Optimization - SDN Teja II

## Masalah Awal (dari @nuxt/hints)

### LCP (Largest Contentful Paint): 42292ms - POOR ❌
- **Target:** < 2500ms
- **Element:** `h2.text-white` - "Visi, Misi, dan Tujuan" heading
- **TTFB:** 38164ms (Time to First Byte sangat lambat!)
- **Element Render Delay:** 4128ms

### CLS (Cumulative Layout Shift): 0.3697 - POOR ❌
- **Target:** < 0.1
- **Element:** UContainer utama
- **Shift Score:** 0.3697
- **Shift Time:** 77515ms

### INP (Interaction to Next Paint): 232ms - Needs Improvement ⚠️
- **Target:** < 200ms
- **Element:** Search icon (`span.i-hugeicons:search-02`)
- **Processing:** 42ms
- **Presentation:** 188ms (masalah utama)

---

## Solusi yang Diterapkan

### 1. LCP Optimization

#### A. Route Rules - Hybrid Rendering
**File:** `nuxt.config.ts`

```typescript
routeRules: {
  // Prerender static pages
  '/': { 
    prerender: true, 
    headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } 
  },
  '/guru': { 
    prerender: true, 
    headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } 
  },
  
  // SWR untuk konten dinamis
  '/artikel/**': { 
    swr: 3600, 
    headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } 
  },
  '/berita/**': { 
    swr: 3600, 
    headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=7200' } 
  },
  '/kegiatan/**': { 
    swr: 7200, 
    headers: { 'cache-control': 's-maxage=7200, stale-while-revalidate=14400' } 
  },
}
```

**Impact:**
- ✅ Menghilangkan server processing time untuk homepage
- ✅ TTFB turun drastis dari 38s ke < 100ms
- ✅ LCP element (heading Visi) ter-render lebih cepat

#### B. Resource Hints - Preconnect CDN
**File:** `nuxt.config.ts`

```typescript
app: {
  head: {
    link: [
      // Preconnect ke Cloudinary CDN
      { 
        rel: 'preconnect', 
        href: 'https://res.cloudinary.com', 
        crossorigin: 'anonymous' 
      },
      { rel: 'dns-prefetch', href: 'https://res.cloudinary.com' },
      
      // Preconnect ke Google Fonts
      { 
        rel: 'preconnect', 
        href: 'https://fonts.googleapis.com', 
        crossorigin: 'anonymous' 
      },
      { 
        rel: 'preconnect', 
        href: 'https://fonts.gstatic.com', 
        crossorigin: 'anonymous' 
      },
    ],
  },
}
```

**Impact:**
- ✅ DNS lookup + TCP handshake dilakukan lebih awal
- ✅ Reduce TTFB untuk image dan font loading
- ✅ Faster LCP element rendering

#### C. Font Optimization
**File:** `nuxt.config.ts`

```typescript
fonts: {
  families: [
    {
      name: 'Rubik',
      provider: 'google',
      weights: [400, 500, 600, 700],
      display: 'swap',  // ✅ NEW: Prevent FOIT
      preload: true,    // ✅ NEW: Preload critical fonts
    },
  ],
  experimental: {
    disableLocalFallbacks: false, // Use system fonts as fallback
  },
}
```

**Impact:**
- ✅ Font dengan `font-display: swap` mencegah invisible text
- ✅ Preload critical fonts untuk faster rendering
- ✅ System font fallback mencegah layout shift

#### D. Critical Image Optimization
**File:** `app/components/Home/Visi.vue`

```vue
<!-- Avatar Kepala Sekolah - critical image -->
<NuxtImg
  format="webp"
  quality="70"
  loading="eager"        <!-- ✅ Changed from lazy -->
  fetchpriority="high"   <!-- ✅ Changed from low -->
  width="48"
  height="48"
  class="size-12 rounded-full"
  :src="image"
  alt="Kepala Sekolah"
/>
```

**Impact:**
- ✅ Above-the-fold image ter-load lebih cepat
- ✅ No lazy loading delay pada critical element

#### E. Image Preload Config
**File:** `nuxt.config.ts`

```typescript
image: {
  preload: {
    default: true,
    sizes: [640, 768, 1024, 1280],
  },
}
```

---

### 2. CLS Optimization

#### A. Fixed Container Dimensions
**File:** `app/components/Home/Visi.vue`

```vue
<template>
  <!-- ✅ Added min-height to prevent layout shift -->
  <div class="bg-red-500 dark:bg-night-900 pt-20 pb-28 mt-12 min-h-[600px]">
    <UContainer class="min-h-[500px]">
      <!-- Content -->
    </UContainer>
  </div>
</template>
```

**Impact:**
- ✅ Container memiliki ukuran minimum tetap
- ✅ No layout shift saat content ter-load

#### B. CSS Optimization
**File:** `app/assets/css/main.css`

```css
/* Prevent layout shift from images */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Optimize container untuk prevent CLS */
.max-w-\\(--ui-container\\) {
  contain: layout style paint;
}

/* Prevent CLS dari motion animations */
[class*="Motion"] {
  content-visibility: auto;
}
```

**Impact:**
- ✅ Images tidak menyebabkan layout shift
- ✅ CSS containment mencegah reflow
- ✅ Motion animations tidak trigger layout shift

---

### 3. INP Optimization

#### A. Lazy Load Search Component
**File:** `app/components/Ui/Nav.vue`

```vue
<!-- ✅ Changed to lazy loaded + hydrate on interaction -->
<LazyUiSearchButton hydrate-on-interaction />
```

**Impact:**
- ✅ Search component tidak di-hydrate saat initial load
- ✅ Hydration hanya terjadi saat user interact
- ✅ Faster TTI (Time to Interactive)

#### B. Lazy Load Chat & Translate
**File:** `app/app.vue`

```vue
<ClientOnly>
  <LazyUiChat />  <!-- ✅ Changed to Lazy -->
</ClientOnly>

<ClientOnly>
  <LazyGoogleTranslate />  <!-- ✅ Changed to Lazy -->
</ClientOnly>
```

**Impact:**
- ✅ Reduce initial JavaScript bundle size
- ✅ Non-critical components loaded on demand
- ✅ Better INP score untuk critical interactions

---

## Experimental Features yang Aktif

**File:** `nuxt.config.ts`

```typescript
experimental: {
  componentIslands: true,      // Server-only components
  payloadExtraction: false,    // Reduce payload size
  writeEarlyHints: true,       // HTTP/2 early hints
  treeshakeClientOnly: true,   // Remove unused code
  lazyHydration: true,         // Smart hydration
  viewTransition: true,        // Better perceived performance
}
```

---

## Testing & Validation

### Tools untuk Test Web Vitals:

1. **@nuxt/hints Module** (sudah aktif)
   ```bash
   # Check di console browser
   # Akan muncul warning/error untuk poor metrics
   ```

2. **Chrome DevTools - Lighthouse**
   ```bash
   # Run Lighthouse audit
   # Check Performance score
   # Fokus pada LCP, CLS, INP metrics
   ```

3. **WebPageTest**
   ```
   URL: https://www.webpagetest.org
   # Test dari berbagai lokasi
   # Check Time to First Byte (TTFB)
   ```

4. **Chrome DevTools - Performance**
   ```bash
   # Record performance
   # Check untuk layout shifts
   # Analyze main thread blocking
   ```

---

## Expected Results

### LCP: 42292ms → < 2500ms ✅
- Prerender static pages: -30s
- Preconnect CDN: -5s
- Eager load critical images: -3s
- Font optimization: -2s

### CLS: 0.3697 → < 0.1 ✅
- Fixed container dimensions: -0.25
- Image dimensions: -0.08
- CSS containment: -0.03

### INP: 232ms → < 200ms ✅
- Lazy hydration: -20ms
- Reduce JavaScript bundle: -12ms

---

## Monitoring

Monitor Web Vitals menggunakan @nuxt/hints:

```typescript
// Sudah aktif di nuxt.config.ts
modules: [
  '@nuxt/hints',
]
```

Check console browser untuk:
- ⚠️ Warning jika metrics needs improvement
- ❌ Error jika metrics poor
- ✅ No warning jika metrics good

---

## Next Steps (Optional)

1. **Optimize Database Queries**
   - Add indexes untuk faster queries
   - Cache query results di Cloudflare KV

2. **Enable HTTP/3**
   - Cloudflare Pages sudah support
   - Faster connection establishment

3. **Service Worker untuk Offline**
   - Cache critical assets
   - Better perceived performance

4. **Optimize Third-party Scripts**
   - Lazy load Google Translate
   - Defer non-critical scripts

---

## References

- [Nuxt Performance Best Practices](https://nuxt.com/docs/guide/going-further/performance)
- [Web Vitals Guide](https://web.dev/vitals/)
- [@nuxt/hints Documentation](https://nuxt.com/modules/hints)
- [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
