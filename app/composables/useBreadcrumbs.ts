export function useBreadcrumbs(breadcrumbData: Array<{ title: string, path: string, icon?: string }>) {
  const route = useRoute()

  const breadcrumbs = computed(() => {
    const paths = route.path.split('/').filter(Boolean)

    // Breadcrumb awal selalu Home
    const breadcrumbArray: { label: string, to: string, icon?: string }[] = [{ label: 'Home', to: '/', icon: 'i-ph-house-duotone' }]

    let currentPath = ''
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`

      const match = breadcrumbData.find(item => item.path === currentPath)

      // Hanya tampilkan breadcrumb jika ditemukan di data navigasi
      if (match) {
        breadcrumbArray.push({
          label: match.title,
          icon: match.icon,
          to: currentPath,
        })
      }
    })

    return breadcrumbArray
  })

  return breadcrumbs
}
