<script setup lang="ts">
const { data: newsList } = await useAsyncData('publikasi-berita-list', () =>
  queryCollection('berita').order('date', 'DESC').all()
)

useSeoMeta({
  title: 'Warta & Berita Sekolah - SD Negeri Teja II',
  description:
    'Kabar terkini seputar kegiatan, prestasi, pengumuman resmi, dan perkembangan pendidikan di SD Negeri Teja II Rajagaluh.',
  ogTitle: 'Warta & Berita Sekolah - SD Negeri Teja II',
  ogDescription:
    'Kabar terkini seputar kegiatan, prestasi, pengumuman resmi, dan perkembangan pendidikan di SD Negeri Teja II.'
})

const searchQuery = ref('')
const selectedTag = ref('Semua Tag')

const tagOptions = computed(() => {
  const set = new Set<string>()
  newsList.value?.forEach((item) => {
    item.tags?.forEach((t: string) => set.add(t))
  })
  return ['Semua Tag', ...Array.from(set)]
})

const formatDate = (val: string | Date | undefined) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const filteredNews = computed(() => {
  if (!newsList.value) return []
  return newsList.value.filter((item) => {
    const matchTag
      = selectedTag.value === 'Semua Tag'
        || item.tags?.includes(selectedTag.value)
    const query = searchQuery.value.toLowerCase()
    const matchSearch
      = item.title?.toLowerCase().includes(query)
        || item.description?.toLowerCase().includes(query)
        || item.tags?.some((t: string) => t.toLowerCase().includes(query))
    return matchTag && matchSearch
  })
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="space-y-8">
      <!-- Breadcrumb & Header -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-sm text-muted">
          <NuxtLink
            to="/"
            class="hover:text-highlighted transition-colors"
          >
            Home
          </NuxtLink>
          <span>/</span>
          <NuxtLink
            to="/publikasi"
            class="hover:text-highlighted transition-colors"
          >
            Publikasi
          </NuxtLink>
          <span>/</span>
          <span class="text-highlighted font-medium">Berita</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Warta & Berita Sekolah
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Informasi resmi, agenda kegiatan, pengumuman kedinasan, dan warta terbaru seputar SD Negeri Teja II.
          </p>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari warta sekolah..."
            size="md"
            class="w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted hidden sm:inline">Kategori:</span>
          <USelect
            v-model="selectedTag"
            :items="tagOptions"
            icon="i-lucide-filter"
            size="md"
            class="w-full sm:w-52"
          />
        </div>
      </div>

      <!-- News Cards Grid -->
      <div
        v-if="filteredNews.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <NuxtLink
          v-for="item in filteredNews"
          :key="item.path"
          :to="item.path"
          class="group block"
        >
          <UCard class="h-full group-hover:border-primary/50 transition-all flex flex-col justify-between">
            <div class="space-y-3.5">
              <!-- Metadata & Tags -->
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <UBadge
                    v-for="t in (item.tags || []).slice(0, 2)"
                    :key="t"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    {{ t }}
                  </UBadge>
                </div>

                <span
                  v-if="item.date"
                  class="text-[11px] text-muted flex items-center gap-1"
                >
                  <UIcon
                    name="i-lucide-calendar"
                    class="size-3"
                  />
                  {{ formatDate(item.date) }}
                </span>
              </div>

              <!-- Title & Description -->
              <div class="space-y-2">
                <h2 class="font-bold text-highlighted text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {{ item.title }}
                </h2>

                <p class="text-xs sm:text-sm text-muted leading-relaxed line-clamp-4">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="pt-4 mt-4 border-t border-default flex items-center justify-between text-xs text-muted">
              <span class="truncate">
                {{ item.author || 'Humas SDN Teja II' }}
              </span>

              <span class="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                Baca Selengkapnya
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-3.5"
                />
              </span>
            </div>
          </UCard>
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-16 space-y-3 rounded-2xl border border-dashed border-default p-8"
      >
        <UIcon
          name="i-lucide-search-x"
          class="size-10 text-muted mx-auto"
        />
        <p class="text-highlighted font-semibold text-lg">
          Warta Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada warta yang cocok dengan kata kunci atau filter yang dipilih.
        </p>
        <UButton
          label="Reset Pencarian"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedTag = 'Semua Tag'"
        />
      </div>
    </UContainer>
  </div>
</template>
