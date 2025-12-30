// Composable untuk dynamic resource preloading
export function useDynamicPreload() {
  if (!import.meta.client)
    return

  // Preload fonts yang ditemukan di CSS
  const preloadFonts = () => {
    // Tunggu sampai CSS ter-load
    setTimeout(() => {
      const fontUrls = new Set<string>()

      // Scan semua stylesheet untuk font URLs
      Array.from(document.styleSheets).forEach((sheet) => {
        try {
          Array.from(sheet.cssRules || []).forEach((rule) => {
            const cssText = rule.cssText || ''
            // Find font URLs dalam CSS
            const fontMatches = cssText.match(/url\(['"]?([^'"]+\.(woff2?|ttf|otf))['"]?\)/gi)
            if (fontMatches) {
              fontMatches.forEach((match) => {
                const url = match.match(/url\(['"]?([^'"]+)['"]?\)/i)?.[1]
                if (url) {
                  fontUrls.add(url)
                }
              })
            }
          })
        }
        catch {
          // Skip CORS-blocked stylesheets
        }
      })

      // Preload first 3 unique fonts
      Array.from(fontUrls).slice(0, 3).forEach((fontUrl) => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = fontUrl
        link.as = 'font'
        link.type = fontUrl.includes('.woff2') ? 'font/woff2' : 'font/woff'
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })
    }, 100)
  }

  // Preload critical JS chunks
  const preloadCriticalChunks = () => {
    // Scan untuk script tags dengan _nuxt dalam src
    const scripts = document.querySelectorAll('script[src*="/_nuxt/"]')
    const preloadedUrls = new Set<string>()

    scripts.forEach((script) => {
      const src = script.getAttribute('src')
      if (src && !preloadedUrls.has(src)) {
        preloadedUrls.add(src)

        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = src
        link.as = 'script'
        document.head.appendChild(link)
      }
    })
  }

  // Preload WASM files
  const preloadWasm = () => {
    // Look for WASM references in existing scripts
    const scripts = document.querySelectorAll('script')
    scripts.forEach((script) => {
      if (script.textContent?.includes('.wasm')) {
        // Extract WASM URLs from script content
        const wasmMatches = script.textContent.match(/['"]([^'"]+\.wasm)['"]|`([^`]+\.wasm)`/g)
        if (wasmMatches) {
          wasmMatches.slice(0, 2).forEach((match) => {
            const wasmUrl = match.replace(/['")`]/g, '')
            if (wasmUrl.startsWith('/') || wasmUrl.startsWith('_nuxt/')) {
              const link = document.createElement('link')
              link.rel = 'preload'
              link.href = wasmUrl.startsWith('/') ? wasmUrl : `/${wasmUrl}`
              link.as = 'fetch'
              link.crossOrigin = 'anonymous'
              document.head.appendChild(link)
            }
          })
        }
      }
    })
  }

  return {
    preloadFonts,
    preloadCriticalChunks,
    preloadWasm,
  }
}
