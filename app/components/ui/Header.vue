<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const isOpen = ref(false)

// Query navigation otomatis dari content
const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

const route = useRoute()

// Transform navigation menjadi format NavigationMenuItem
const items = computed<NavigationMenuItem[]>(() => {
  if (!navigation.value)
    return []

  return navigation.value.map((item) => {
    const isActive = item.path === '/'
      ? route.path === '/'
      : route.path.startsWith(item.path) || route.path.startsWith(`${item.path}/`)

    return {
      label: item.title || 'Untitled',
      to: item.path,
      icon: item?.icon || 'i-jadu-teja2', // Ambil icon dari frontmatter navigation
      active: isActive,
      onClick: () => {
        isOpen.value = false
      },
    }
  })
})

const { data: files } = await useLazyAsyncData('search-all', () => {
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
  transform: (data) => {
    const [artikelData, beritaData, contentData, guruData, kegiatanData] = data

    // Helper function for clean URLs
    const cleanPath = (path: string) => {
      if (!path)
        return '/'
      const cleanedPath = path.replace(/\.(yml|yaml|md)$/, '').replace(/\/\d+\./, '/')
      return cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`
    }

    // Helper function for type labels
    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'artikel': return '📝 Artikel'
        case 'berita': return '📰 Berita'
        case 'guru': return '👨‍🏫 Guru'
        case 'kegiatan': return '🎯 Kegiatan'
        case 'content': return '🏠 Halaman'
        default: return '📄 Konten'
      }
    }

    return [
      ...(artikelData || []).map((item: any) => ({ ...item, type: 'artikel' })),
      ...(beritaData || []).map((item: any) => ({ ...item, type: 'berita' })),
      ...(contentData || []).map((item: any) => ({ ...item, type: 'content' })),
      // Transform YAML data to match search format
      ...(guruData || []).map((item: any) => ({
        id: item._path || item.path || item.id,
        title: item.nama || item.title,
        titles: [getTypeLabel('guru'), item.jabatan || '', item.kelas || ''].filter(Boolean),
        level: 1,
        content: `${item.nama || ''} ${item.lengkap || ''} ${item.catatan || ''} ${item.jabatan || ''} ${item.pendidikan || ''}`.trim(),
        type: 'guru',
        to: cleanPath(item._path || item.path || item.id),
      })),
      ...(kegiatanData || []).map((item: any) => ({
        id: item._path || item.path || item.id,
        title: item.title,
        titles: [getTypeLabel('kegiatan'), item.tag || ''].filter(Boolean),
        level: 1,
        content: `${item.title || ''} ${item.description || ''} ${item.tag || ''}`.trim(),
        type: 'kegiatan',
        to: cleanPath(item._path || item.path || item.id),
      })),
    ]
  },
})

const links = [{
  label: 'Docs',
  icon: 'i-lucide-book',
  to: '/docs/getting-started',
}]

const searchTerm = ref('')
const isSearchOpen = ref(false)

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

            <UContentSearch
              v-model="isSearchOpen" v-model:search-term="searchTerm" :files="files"
              :navigation="navigation" :links="links" :fuse="{ resultLimit: 42 }"
            />

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
