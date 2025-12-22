// Simple in-memory cache
const cache = {
  data: null as any,
  lastFetch: 0,
  isLoading: false,
}

// Cache duration: 24 hours (in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

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

  const now = Date.now()
  const cacheAge = now - cache.lastFetch

  // Check if we have valid cached data (less than 24 hours old)
  if (cache.data && cacheAge < CACHE_DURATION) {
    console.warn('Serving cached data. Cache age:', Math.round(cacheAge / (60 * 60 * 1000)), 'hours')

    // Add cache info to headers
    setHeaders(event, {
      'X-Cache': 'HIT',
      'X-Cache-Age': Math.round(cacheAge / 1000).toString(),
      'X-Cache-Expires': Math.round((CACHE_DURATION - cacheAge) / 1000).toString(),
    })

    return cache.data
  }

  // If already loading, wait and return cached data if available
  if (cache.isLoading) {
    console.warn('Already fetching data, serving cached data if available')
    if (cache.data) {
      setHeader(event, 'X-Cache', 'STALE')
      return cache.data
    }
  }

  try {
    cache.isLoading = true
    const API_URL = 'https://script.google.com/macros/s/AKfycbxOweK92RYosECc0bruXHLGX70dP_qu0R-ReJyuALZ9xdZ-oiy4N1Cqrz8_NW5OBEU/exec'

    console.warn('Fetching fresh data from Google Apps Script...')

    const response = await $fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Nuxt-Server/1.0)',
      },
      timeout: 15000, // 15 seconds timeout
    })

    // Update cache
    cache.data = response
    cache.lastFetch = now
    cache.isLoading = false

    console.warn('Successfully fetched and cached fresh data')

    // Add cache info to headers
    setHeaders(event, {
      'X-Cache': 'MISS',
      'X-Cache-Updated': new Date().toISOString(),
      'X-Cache-Expires': Math.round(CACHE_DURATION / 1000).toString(),
    })

    return response
  }
  catch (error: any) {
    cache.isLoading = false
    console.error('Error fetching siswa data from Google Apps Script:', error.message)

    // If we have stale cached data, serve it instead of throwing error
    if (cache.data) {
      console.warn('Serving stale cached data due to fetch error')
      setHeader(event, 'X-Cache', 'STALE-ERROR')
      return cache.data
    }

    // Return error response if no cached data available
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
