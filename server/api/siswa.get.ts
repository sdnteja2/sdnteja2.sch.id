/* eslint-disable no-console */
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

  try {
    const API_URL = 'https://script.google.com/macros/s/AKfycbxOweK92RYosECc0bruXHLGX70dP_qu0R-ReJyuALZ9xdZ-oiy4N1Cqrz8_NW5OBEU/exec'

    console.log('Fetching siswa data from Google Apps Script...')

    const response = await $fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Nuxt-Server/1.0)',
      },
      timeout: 30000, // 30 seconds timeout
      retry: 2, // Retry up to 2 times on failure
      retryDelay: 1000, // 1 second delay between retries
    })

    // Validate response
    if (!response) {
      throw new Error('Empty response from Google Apps Script')
    }

    console.log('Successfully fetched siswa data')

    return response
  }
  catch (error: any) {
    // Log detailed error information
    console.error('Error fetching siswa data from Google Apps Script:', {
      message: error.message,
      cause: error.cause,
      statusCode: error.statusCode,
      data: error.data,
    })

    // Return error response
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch student data',
      data: {
        error: true,
        message: error.message || 'Unable to connect to data source',
        details: error.data || error.cause || 'No additional details',
        timestamp: new Date().toISOString(),
      },
    })
  }
})
