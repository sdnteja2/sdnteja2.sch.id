<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const isOpen = ref(false)

// Query navigation otomatis dari content
const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

// Transform navigation menjadi format NavigationMenuItem
const items = computed<NavigationMenuItem[]>(() => {
  if (!navigation.value)
    return []

  return navigation.value.map(item => ({
    label: item.title || 'Untitled',
    to: item.path,
    icon: item?.icon || 'i-jadu-teja2', // Ambil icon dari frontmatter navigation
    onClick: () => {
      isOpen.value = false
    },
  }))
})

const searchTerm = ref('')
const isSearchOpen = ref(false)
const router = useRouter()

interface SearchResult {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
  type: 'artikel' | 'berita' | 'guru' | 'kegiatan' | 'content'
  icon?: string
}

const searchResults = ref<SearchResult[]>([])

// Fetch data for search
const { data: allContent } = await useLazyAsyncData('search-content-header', () => {
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

    const getIconByType = (type: string) => {
      switch (type) {
        case 'artikel': return 'solar:document-add-linear'
        case 'berita': return 'solar:clipboard-linear'
        case 'guru': return 'solar:user-linear'
        case 'kegiatan': return 'solar:gallery-wide-linear'
        case 'content': return 'solar:home-angle-linear'
        default: return 'i-lucide-file'
      }
    }

    return [
      ...(artikelData || []).map((item: any) => ({ ...item, type: 'artikel', icon: item.icon || getIconByType('artikel') })),
      ...(beritaData || []).map((item: any) => ({ ...item, type: 'berita', icon: item.icon || getIconByType('berita') })),
      ...(contentData || []).map((item: any) => ({ ...item, type: 'content', icon: item.icon || getIconByType('content') })),
      ...(guruData || []).map((item: any) => ({
        id: item._path || item.path || item.id,
        title: item.nama || item.title,
        titles: [item.jabatan || '', item.kelas || ''].filter(Boolean),
        level: 1,
        content: `${item.nama || ''} ${item.lengkap || ''} ${item.catatan || ''} ${item.jabatan || ''} ${item.pendidikan || ''}`.trim(),
        type: 'guru',
        icon: item.icon || getIconByType('guru')
      })),
      ...(kegiatanData || []).map((item: any) => ({
        id: item._path || item.path || item.id,
        title: item.title,
        titles: [item.tag || ''].filter(Boolean),
        level: 1,
        content: `${item.title || ''} ${item.description || ''} ${item.tag || ''}`.trim(),
        type: 'kegiatan',
        icon: item.icon || getIconByType('kegiatan')
      })),
    ]
  },
})

// Update search results when allContent changes
watch(allContent, (newData) => {
  if (newData) searchResults.value = newData
}, { immediate: true })

// Search logic
function getTypeLabel(type: string) {
  switch (type) {
    case 'artikel': return 'Artikel'
    case 'berita': return 'Berita'
    case 'guru': return 'Guru'
    case 'kegiatan': return 'Kegiatan'
    case 'content': return 'Halaman'
    default: return 'Konten'
  }
}

function cleanPath(path: string): string {
  if (!path) return '/'
  let cleanedPath = path.replace(/\.(yml|yaml|md)$/, '').replace(/\/\d+\./, '/')
  return cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`
}

const groups = computed(() => {
  const term = searchTerm.value.toLowerCase()
  const filtered = !term ? allContent.value : allContent.value?.filter(item => 
    item.title.toLowerCase().includes(term) || 
    item.content.toLowerCase().includes(term)
  )

  const limitedResults = (filtered || []).slice(0, 50)
  const grouped = limitedResults.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = []
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, any[]>)

  return Object.entries(grouped).map(([type, items]) => ({
    id: type,
    label: `${getTypeLabel(type)} (${items.length})`,
    items: items.map(item => ({
      id: item.id,
      label: item.title,
      icon: item.icon,
      suffix: item.content.slice(0, 30) + '...',
      to: cleanPath(item.id)
    }))
  }))
})

function onSelect(item: any) {
  if (item.to) router.push(item.to)
  isSearchOpen.value = false
}

// Define keyboard shortcuts
defineShortcuts({
  meta_k: () => {
    isSearchOpen.value = true
  },
})
</script>

<template>
  <div class="fixed top-4 mx-auto w-full  z-50">
    <UContainer>
      <div class="rounded-4xl shadow-teja p-2 px-6 md:rounded-[40px] dark:bg-sky-800/80 bg-sky-200/50 backdrop-blur">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2 text-lg font-bold">
            Teja II
          </NuxtLink>

          <div class="flex items-center gap-2">
            <div class="hidden md:block">
              <UNavigationMenu :items="items" />
            </div>
            <UTooltip text="Cari..." :kbds="['meta', 'K']">
              <UContentSearchButton @click="isSearchOpen = true" />
            </UTooltip>

            <UModal
              v-model:open="isSearchOpen"
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
                    @update:open="isSearchOpen = $event"
                    @update:model-value="onSelect"
                  />
                </div>
              </template>
            </UModal>

            <UColorModeButton />

            <div class="md:hidden">
              <UPopover v-model:open="isOpen" :content="{ align: 'end', side: 'bottom', sideOffset: 12 }">
                <UButton
                  :icon="isOpen ? 'i-lucide-x' : 'i-lucide-menu'" color="neutral" variant="ghost"
                  aria-label="Menu"
                />

                <template #content>
                  <UNavigationMenu highlight :items="items" orientation="vertical" class="p-2 min-w-48" />
                </template>
              </UPopover>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
