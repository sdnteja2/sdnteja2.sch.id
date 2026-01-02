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
    const isActive
      = item.path === '/'
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

const { data: files } = await useLazyAsyncData(
  'search-all',
  () => {
    return Promise.all([
      queryCollectionSearchSections('artikel'),
      queryCollectionSearchSections('berita'),
      queryCollectionSearchSections('content'),
      queryCollection('guru').all(),
      queryCollection('kegiatan').all(),
    ])
  },
  {
    server: false,
    transform: (data) => {
      const [artikelData, beritaData, contentData, guruData, kegiatanData] = data

      const cleanPath = (path: string) => {
        if (!path)
          return '/'
        const cleanedPath = path.replace(/\.(yml|yaml|md)$/, '').replace(/\/\d+\./, '/')
        return cleanedPath.startsWith('/') ? cleanedPath : `/${cleanedPath}`
      }

      return [
        ...(artikelData || []).map((item: any) => ({
          ...item,
          type: 'artikel',
        })),
        ...(beritaData || []).map((item: any) => ({
          ...item,
          type: 'berita',
        })),
        ...(contentData || []).map((item: any) => ({
          ...item,
          type: 'content',
        })),
        ...(guruData || []).map((item: any) => ({
          id: item._path || item.path || item.id,
          title: item.jabatan,
          titles: [item.lengkap || ''].filter(Boolean),
          level: 1,
          content: `- ${item.catatan || ''} ${item.pendidikan || ''}`.trim(),
          type: 'guru',
          to: cleanPath(item._path || item.path || item.id),
        })),
        ...(kegiatanData || []).map((item: any) => ({
          id: item._path || item.path || item.id,
          title: item.title,
          titles: [item.description || ''].filter(Boolean),
          level: 1,
          content: `${item.title || ''} ${item.description || ''} ${item.tag || ''}`.trim(),
          type: 'kegiatan',
          to: cleanPath(item._path || item.path || item.id),
        })),
      ]
    },
  },
)

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
  <div class="fixed top-4 z-50 mx-auto w-full">
    <UContainer>
      <div
        class="rounded-4xl shadow-teja bg-sky-200/50 p-2 px-3 sm:px-4 lg:px-6 backdrop-blur md:rounded-[40px] dark:bg-sky-800/80"
      >
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-1 sm:gap-2 text-base sm:text-lg font-bold">
            <UiLogo class="scale-90 sm:scale-100" />
          </NuxtLink>

          <div class="flex items-center gap-1 sm:gap-2">
            <div class="hidden lg:block">
              <UNavigationMenu :items="items" />
            </div>
            <UTooltip text="Cari..." :kbds="['meta', 'K']">
              <UContentSearchButton @click="isSearchOpen = true" />
            </UTooltip>

            <UContentSearch
              v-model="isSearchOpen"
              v-model:search-term="searchTerm"
              :files="files"
              :navigation="navigation"
              :fuse="{ resultLimit: 42 }"
              :fullscreen="false"
              :ui="{
                modal: 'sm:max-w-xl h-96',
              }"
            />

            <UColorModeButton />

            <div class="lg:hidden">
              <UPopover
                v-model:open="isOpen"
                :content="{ align: 'end', side: 'bottom', sideOffset: 12 }"
              >
                <UButton
                  :icon="isOpen ? 'i-ph-x-square-duotone' : 'i-ph-list-duotone'"
                  color="neutral"
                  variant="ghost"
                  aria-label="Menu"
                />

                <template #content>
                  <UNavigationMenu
                    highlight
                    :items="items"
                    orientation="vertical"
                    class="min-w-48 p-2"
                  />
                </template>
              </UPopover>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
