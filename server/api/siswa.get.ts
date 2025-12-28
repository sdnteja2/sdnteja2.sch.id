/* eslint-disable no-console */
// Cache duration: 24 hours (in seconds)
const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds
const LOCK_TTL = 30 // Lock expires after 30 seconds
const API_URL = 'https://script.google.com/macros/s/AKfycbxzignNqy2LIzEoE9QjLCUdNx4OU4OQmsqV__0u_I7wRF2pqlWSypsXX8M1kL-FEiI/exec'

export default defineEventHandler(async (event) => {
  // Set CORS headers for all requests
  setHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  })

  // Handle preflight requests
  if (getMethod(event) === 'OPTIONS') {
    return {}
  }

  const storage = useStorage('cache')
  const cacheKey = 'siswa:data'
  const lockKey = 'siswa:lock'

  try {
    // Try to get cached data
    const cachedData = await storage.getItem(cacheKey)

    if (cachedData) {
      const { data, timestamp } = cachedData as { data: any, timestamp: number }
      const cacheAge = Date.now() - timestamp
      const isExpired = cacheAge > (CACHE_TTL * 1000)

      if (!isExpired) {
        console.log('✓ Serving cached data. Age:', Math.round(cacheAge / (60 * 60 * 1000)), 'hours')

        setHeaders(event, {
          'X-Cache': 'HIT',
          'X-Cache-Age': Math.round(cacheAge / 1000).toString(),
          'X-Cache-Expires': Math.round((CACHE_TTL * 1000 - cacheAge) / 1000).toString(),
        })

        return data
      }

      // Cache expired, try to refresh in background but serve stale data first
      console.log('⚠ Cache expired, attempting background refresh')
    }

    // Check if another request is already fetching
    const isLocked = await storage.getItem(lockKey)

    if (isLocked) {
      console.log('⏳ Another request is fetching, serving stale data')
      if (cachedData) {
        setHeader(event, 'X-Cache', 'STALE')
        return (cachedData as any).data
      }
      // Wait a bit and retry
      await new Promise(resolve => setTimeout(resolve, 500))
      const retryData = await storage.getItem(cacheKey)
      if (retryData) {
        setHeader(event, 'X-Cache', 'HIT-RETRY')
        return (retryData as any).data
      }
    }

    // Set lock to prevent concurrent fetches
    await storage.setItem(lockKey, Date.now(), { ttl: LOCK_TTL })

    console.log('📡 Fetching fresh data from Google Apps Script...')

    const response = await $fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Nuxt-Server/1.0)',
      },
      timeout: 15000, // 15 seconds timeout
    })

    // Store in cache with timestamp
    await storage.setItem(cacheKey, {
      data: response,
      timestamp: Date.now(),
    }, { ttl: CACHE_TTL + 3600 }) // Store for 25 hours (24h TTL + 1h grace)

    // Release lock
    await storage.removeItem(lockKey)

    console.log('✓ Successfully fetched and cached fresh data')

    setHeaders(event, {
      'X-Cache': 'MISS',
      'X-Cache-Updated': new Date().toISOString(),
      'X-Cache-Expires': CACHE_TTL.toString(),
    })

    return response
  }
  catch (error: any) {
    // Release lock on error
    await storage.removeItem(lockKey).catch(() => {})

    console.error('❌ Error fetching siswa data:', error.message)

    // Try to serve stale cached data on error
    const cachedData = await storage.getItem(cacheKey)
    if (cachedData) {
      console.log('⚠ Serving stale cached data due to fetch error')
      setHeader(event, 'X-Cache', 'STALE-ERROR')
      return (cachedData as any).data
    }

    // No cached data available, throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch student data',
      data: {
        error: true,
        message: error.message || 'Unable to connect to data source',
        timestamp: new Date().toISOString(),
      },
    })
  }
})
