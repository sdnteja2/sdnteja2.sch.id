// app/components/Ui/SearchButton.vue
<script setup lang="ts">
// Menggunakan referensi untuk pencarian dan status modal
const searchTerm = ref('')

interface SearchResult {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
  type: 'artikel' | 'berita' | 'guru' | 'kegiatan' | 'content'
}

const searchResults = ref<SearchResult[]>([])
const open = ref(false)
const value = ref({})

// Router untuk navigasi
const router = useRouter()

// Fetch data menggunakan client-side approach dengan useLazyAsyncData
const { data: allContent } = await useLazyAsyncData('search-content', () => {
  return Promise.all([
    // Markdown collections
    queryCollectionSearchSections('artikel'),
    queryCollectionSearchSections('berita'),
    queryCollectionSearchSections('content'),
    // YAML collections
    queryCollection('guru').all(),
    queryCollection('kegiatan').all(),
  ])
}, {
  server: false,
  default: () => [],
  transform: (data) => {
    const [artikelData, beritaData, contentData, guruData, kegiatanData] = data

    // Transform and combine results
    const searchResults = [
      ...(artikelData || []).map((item: any) => ({ ...item, type: 'artikel' })),
      ...(beritaData || []).map((item: any) => ({ ...item, type: 'berita' })),
      ...(contentData || []).map((item: any) => ({ ...item, type: 'content' })),
      // Transform YAML data to match search format
      ...(guruData || []).map((item: any) => ({
        id: item._path || item.path || item.id,
        title: item.nama || item.title,
        titles: [item.jabatan || '', item.kelas || ''].filter(Boolean),
        level: 1,
        content: `${item.nama || ''} ${item.lengkap || ''} ${item.catatan || ''} ${item.jabatan || ''} ${item.pendidikan || ''}`.trim(),
        type: 'guru',
      })),
      ...(kegiatanData || []).map((item: any) => ({
        id: item._path || item.path || item.id,
        title: item.title,
        titles: [item.tag || ''].filter(Boolean),
        level: 1,
        content: `${item.title || ''} ${item.description || ''} ${item.tag || ''}`.trim(),
        type: 'kegiatan',
      })),
    ]

    return searchResults
  },
})

// Set initial results
searchResults.value = allContent.value || []

// Reactive search function dengan debounce manual
let searchTimeout: NodeJS.Timeout | null = null

function debouncedSearch(term: string) {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    if (!term || term.length < 2) {
      // Jika tidak ada search term, gunakan semua data
      searchResults.value = allContent.value || []
      return
    }

    // Filter data di client-side
    const allData = allContent.value || []
    const filteredResults = allData.filter((item: SearchResult) => {
      const searchLower = term.toLowerCase()
      return (
        item.title.toLowerCase().includes(searchLower)
        || item.content.toLowerCase().includes(searchLower)
        || item.titles?.some((title: string) => title.toLowerCase().includes(searchLower))
      )
    })

    searchResults.value = filteredResults
  }, 300) // 300ms debounce
}

// Watch search term changes
watch(searchTerm, (newTerm) => {
  debouncedSearch(newTerm)
})

// Watch for data changes and update search results
watch(allContent, (newData) => {
  if (newData && (!searchTerm.value || searchTerm.value.length < 2)) {
    searchResults.value = newData
  }
}, { immediate: true })

// Fungsi untuk menangani pemilihan item
function onSelect(item: any) {
  if (item.to) {
    router.push(item.to) // Navigasi ke halaman yang dimaksud
  }
  open.value = false // Tutup modal setelah navigasi
}

// Grup hasil pencarian dengan kategori yang terpisah untuk UX yang lebih baik
const groups = computed(() => {
  const filteredResults = searchResults.value

  // Limit hasil untuk mengurangi lag
  const limitedResults = filteredResults.slice(0, 50)

  // Grup berdasarkan tipe content
  const groupedByType = limitedResults.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type]!.push(item)
    return acc
  }, {} as Record<string, SearchResult[]>)

  // Buat grup untuk setiap tipe yang memiliki hasil
  const groups: Array<{
    id: string
    label: string
    items: Array<{
      id: string
      label: string
      icon: string
      suffix: string
      description: string
      to: string
    }>
  }> = []

  Object.entries(groupedByType).forEach(([type, items]) => {
    if (items.length > 0) {
      groups.push({
        id: type,
        label: `${getTypeLabel(type)} (${items.length})`,
        items: items.slice(0, 10).map(item => ({
          id: item.id,
          label: item.title,
          icon: getIconByType(item.type),
          suffix: `${item.content.slice(0, 30)}...`,
          description: item.titles?.join(' > ') || '',
          to: cleanPath(item.id),
        })),
      })
    }
  })

  // Jika tidak ada pencarian, tampilkan sebagian dalam satu grup
  if (!searchTerm.value) {
    return [{
      id: 'all-content',
      label: `Semua Konten (${limitedResults.length})`,
      items: limitedResults.slice(0, 15).map(item => ({
        id: item.id,
        label: item.title,
        icon: getIconByType(item.type),
        suffix: getTypeLabel(item.type),
        description: item.titles?.join(' > ') || '',
        to: cleanPath(item.id),
      })),
    }]
  }

  return groups
})

// Helper function untuk membersihkan URL path
function cleanPath(path: string): string {
  if (!path)
    return '/'

  // Gunakan _path jika tersedia (dari Nuxt Content), fallback ke path biasa
  let cleanedPath = path

  // Hapus extension file (.yml, .md)
  cleanedPath = cleanedPath.replace(/\.(yml|yaml|md)$/, '')

  // Hapus numeric prefix (0., 1., 2., dll) untuk clean URL
  cleanedPath = cleanedPath.replace(/\/\d+\./, '/')

  // Pastikan path dimulai dengan / jika belum ada
  if (!cleanedPath.startsWith('/')) {
    cleanedPath = `/${cleanedPath}`
  }

  return cleanedPath
}

// Helper function untuk mendapatkan icon berdasarkan tipe
function getIconByType(type: string) {
  switch (type) {
    case 'artikel':
      return 'solar:document-add-linear'
    case 'berita':
      return 'solar:clipboard-linear'
    case 'guru':
      return 'solar:user-linear'
    case 'kegiatan':
      return 'solar:gallery-wide-linear'
    case 'content':
      return 'solar:home-angle-linear'
    default:
      return 'i-lucide-file'
  }
}

// Helper function untuk mendapatkan label berdasarkan tipe
function getTypeLabel(type: string) {
  switch (type) {
    case 'artikel':
      return 'Artikel'
    case 'berita':
      return 'Berita'
    case 'guru':
      return 'Guru'
    case 'kegiatan':
      return 'Kegiatan'
    case 'content':
      return 'Halaman'
    default:
      return 'Konten'
  }
}

// Shortcut keyboard untuk membuka modal pencarian
defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  },
})
</script>

<template>
  <!-- Tombol untuk membuka modal -->
  <UButton
    square
    icon="hugeicons:search-02"
    aria-label="Buka pencarian"
    @click="open = true"
  />

  <!-- Modal Command Palette -->
  <ClientOnly>
    <UModal
      v-model:open="open"
      :ui="{
        content: 'rounded-2xl w-full h-1/2 md:w-[1000px] md:h-[500px] mx-auto my-auto will-change-transform',
        overlay: 'fixed inset-0 bg-(--ui-bg-elevated)/50 backdrop-blur flex items-center justify-center p-4 md:p-0 transition-opacity duration-200',
        body: 'p-0 overflow-hidden h-full',
      }"
      close-icon="ph:x-square-duotone"
      :transition="false"
    >
      <template #content>
        <div class="h-full flex flex-col">
          <UCommandPalette
            v-model="value"
            v-model:search-term="searchTerm"
            close
            placeholder="Cari Konten ..."
            :groups="groups"
            :ui="{
              item: 'hover:bg-sky-300 dark:hover:bg-sky-700 rounded focus:bg-sky-300',
              root: 'flex flex-col min-h-0 w-full min-w-0 divide-y divide-[var(--ui-border)] h-full',
              content: 'max-h-full overflow-y-auto',
            }"
            :fuse="{
              resultLimit: 20,
              matchAllWhenSearchEmpty: false,
              fuseOptions: {
                includeMatches: false,
                threshold: 0.4,
                ignoreLocation: true,
              },
            }"
            @update:open="open = $event"
            @update:model-value="onSelect"
          />
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
