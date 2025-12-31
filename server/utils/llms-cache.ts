// server/utils/llms-cache.ts
let llmsCache = ''
let lastFetch = 0

export async function getLLMSData() {
  const now = Date.now()
  // Refresh cache setiap 12 jam (43_200_000 ms)
  if (!llmsCache || now - lastFetch > 43_200_000) {
    const res = await fetch('https://sdnteja2.sch.id/llms.txt')
    llmsCache = await res.text()
    lastFetch = now
  }
  return llmsCache
}
