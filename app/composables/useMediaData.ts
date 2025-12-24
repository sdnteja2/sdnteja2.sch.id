/**
 * Composable untuk fetch media data
 * Data di-fetch di server saat SSR, lalu di-cache di client
 */
export const useMediaData = () => {
  return useAsyncData('media-collection', async () => {
    try {
      return await queryCollection('media')
        .select('idVideo', 'title', 'kelas', 'link', 'pelajaran')
        .order('kelas', 'DESC')
        .all()
    }
    catch (error) {
      console.error('Error fetching media data:', error)
      return []
    }
  }, {
    default: () => [],
    // Data di-fetch saat SSR dan di-cache
    server: true,
    lazy: false,
  })
}
