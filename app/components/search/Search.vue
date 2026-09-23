<script setup lang="ts">
const { links, groups, searchTerm } = useSearch()

const isLoading = ref(false)

watch(searchTerm, (val) => {
  if (val && val.trim().length >= 2) {
    isLoading.value = true
  } else {
    isLoading.value = false
  }
})

interface SearchResultItem {
  id: string
  title: string
  titles: string[]
  content: string
  icon: string
  score: number
  level: number
}

const fuse = {
  resultLimit: 25,
  fuseOptions: {
    useTokenSearch: true,
    threshold: 0.2
  }
}

async function search(query: string) {
  const q = query?.trim() || ''
  if (q.length < 2) {
    isLoading.value = false
    return []
  }

  isLoading.value = true
  try {
    const res = await $fetch<SearchResultItem[]>('/api/search', {
      query: {
        q,
        limit: 25
      }
    })
    return res
  } catch (err) {
    console.warn('[Search] search query error:', err)
    return []
  } finally {
    isLoading.value = false
  }
}

function getItemIcon(item: { icon?: string, to?: string, prefix?: string }) {
  if (item.to?.startsWith('/publikasi/panduan') || item.prefix?.includes('Panduan')) {
    return 'i-lucide-book-open'
  }
  if (item.to?.startsWith('/media/buku') || item.prefix?.includes('Buku Digital')) {
    return 'i-lucide-book-copy'
  }
  if (item.to?.startsWith('/publikasi/kegiatan') || item.prefix?.includes('Kegiatan')) {
    return 'i-lucide-calendar'
  }
  if (item.to?.startsWith('/publikasi/berita') || item.prefix?.includes('Berita')) {
    return 'i-lucide-megaphone'
  }
  if (item.to?.startsWith('/publikasi/artikel') || item.prefix?.includes('Artikel')) {
    return 'i-lucide-file-text'
  }
  if (item.to?.startsWith('/data/guru') || item.prefix?.includes('Dewan Guru')) {
    return 'i-lucide-graduation-cap'
  }
  if (item.to?.startsWith('/data/bos') || item.prefix?.includes('BOS')) {
    return 'i-lucide-receipt'
  }
  if (item.to?.startsWith('/data/sekolah') || item.prefix?.includes('Sekolah')) {
    return 'i-lucide-school'
  }
  if (item.to?.startsWith('/data/siswa') || item.prefix?.includes('Siswa')) {
    return 'i-lucide-users'
  }
  if (item.to?.startsWith('/media/video') || item.prefix?.includes('Video')) {
    return 'i-lucide-video'
  }
  return item.icon || 'i-lucide-file'
}
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :links="links"
    :groups="groups"
    :search="search"
    :fuse="fuse"
    :loading="isLoading"
    placeholder="Cari artikel, panduan, guru, buku digital, BOS..."
    :transition="false"
    :unmount-on-hide="false"
  >
    <template #item-leading="{ item }">
      <UIcon
        :name="getItemIcon(item)"
        class="size-5 shrink-0 text-muted group-data-highlighted:text-primary transition-colors"
      />
    </template>

    <template #empty="{ searchTerm: term }">
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-10 gap-3 text-muted"
      >
        <UIcon
          name="i-ph-circle-notch"
          class="animate-spin text-2xl text-primary"
        />
        <p class="text-sm">
          Mencari data "{{ term }}"...
        </p>
      </div>
      <div
        v-else-if="term && term.trim().length >= 2"
        class="flex flex-col items-center justify-center py-10 gap-2 text-muted"
      >
        <UIcon
          name="i-lucide-search-x"
          class="text-2xl text-muted/60"
        />
        <p class="text-sm">
          Tidak ada data yang cocok dengan "{{ term }}"
        </p>
      </div>
      <div
        v-else-if="term"
        class="flex flex-col items-center justify-center py-8 gap-2 text-muted"
      >
        <p class="text-xs">
          Ketik minimal 2 huruf untuk memulai pencarian...
        </p>
      </div>
    </template>
  </UContentSearch>
</template>
