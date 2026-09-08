<script setup lang="ts">
const { data: articles } = await useAsyncData('publikasi-artikel-list', () =>
  queryCollection('artikel').order('date', 'DESC').all()
)

useSeoMeta({
  title: 'Artikel & Opini Edukasi - SD Negeri Teja II',
  description:
    'Kumpulan gagasan, artikel edukatif, praktik baik pembelajaran, dan refleksi pedagogis dari para pendidik SD Negeri Teja II.',
  ogTitle: 'Artikel & Opini Edukasi - SD Negeri Teja II',
  ogDescription:
    'Kumpulan gagasan, artikel edukatif, praktik baik pembelajaran, dan refleksi pedagogis dari para pendidik SD Negeri Teja II.'
})

const searchQuery = ref('')
const selectedTag = ref('Semua Topik')

const tagOptions = computed(() => {
  const set = new Set<string>()
  articles.value?.forEach((item) => {
    item.tags?.forEach((t: string) => set.add(t))
  })
  return ['Semua Topik', ...Array.from(set)]
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

const filteredArticles = computed(() => {
  if (!articles.value) return []
  return articles.value.filter((item) => {
    const matchTag
      = selectedTag.value === 'Semua Topik'
        || item.tags?.includes(selectedTag.value)
    const query = searchQuery.value.toLowerCase()
    const matchSearch
      = item.title?.toLowerCase().includes(query)
        || item.description?.toLowerCase().includes(query)
        || item.author?.toLowerCase().includes(query)
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
          <span class="text-highlighted font-medium">Artikel</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Artikel & Opini Edukasi
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Kumpulan gagasan, artikel edukatif, praktik baik pembelajaran, dan refleksi pedagogis dari pendidik SDN Teja II.
          </p>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari judul artikel, topik, atau penulis..."
            size="md"
            class="w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted hidden sm:inline">Topik:</span>
          <USelect
            v-model="selectedTag"
            :items="tagOptions"
            icon="i-lucide-filter"
            size="md"
            class="w-full sm:w-52"
          />
        </div>
      </div>

      <!-- Articles Cards Grid -->
      <div
        v-if="filteredArticles.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="item in filteredArticles"
          :key="item.path"
          :to="item.path"
          class="group block"
        >
          <UCard class="h-full group-hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <!-- Featured Image -->
              <div
                v-if="item.image"
                class="h-44 -mx-4 -mt-4 mb-4 overflow-hidden bg-muted relative"
              >
                <img
                  :src="item.image"
                  :alt="item.title"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div class="space-y-3">
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
                    v-if="item.readingTime"
                    class="text-[11px] text-muted flex items-center gap-1"
                  >
                    <UIcon
                      name="i-lucide-clock"
                      class="size-3"
                    />
                    {{ item.readingTime }} mnt baca
                  </span>
                </div>

                <!-- Title & Description -->
                <div class="space-y-2">
                  <h2 class="font-bold text-highlighted text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {{ item.title }}
                  </h2>

                  <p class="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="pt-4 mt-4 border-t border-default flex items-center justify-between text-xs text-muted">
              <div class="flex items-center gap-1.5 truncate text-muted">
                <UIcon
                  name="i-lucide-user"
                  class="size-3.5 shrink-0"
                />
                <span class="truncate">{{ item.author || 'Tim SDN Teja II' }}</span>
                <span
                  v-if="item.date"
                  class="text-[11px]"
                >
                  • {{ formatDate(item.date) }}
                </span>
              </div>

              <span class="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                Baca Artikel
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
          Artikel Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada artikel yang cocok dengan pencarian atau topik yang dipilih.
        </p>
        <UButton
          label="Reset Pencarian"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedTag = 'Semua Topik'"
        />
      </div>
    </UContainer>
  </div>
</template>
