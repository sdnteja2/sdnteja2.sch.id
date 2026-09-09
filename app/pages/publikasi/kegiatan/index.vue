<script setup lang="ts">
const { data: activities } = await useAsyncData('publikasi-kegiatan-list', () =>
  queryCollection('kegiatan').order('date', 'DESC').all()
)

useSeoMeta({
  title: 'Agenda & Dokumentasi Kegiatan - SD Negeri Teja II',
  description:
    'Rangkaian aktivitas kesiswaan, peringatan hari besar, pembiasaan karakter, dan dokumentasi agenda kegiatan SD Negeri Teja II.',
  ogTitle: 'Agenda & Dokumentasi Kegiatan - SD Negeri Teja II',
  ogDescription:
    'Rangkaian aktivitas kesiswaan, peringatan hari besar, pembiasaan karakter, dan dokumentasi agenda kegiatan SD Negeri Teja II.'
})

defineOgImage('OgImage', {
  page: 'Kegiatan',
  title: 'Agenda & Dokumentasi Kegiatan',
  description: 'Rangkaian aktivitas kesiswaan, pembiasaan karakter, dan dokumentasi kegiatan SD Negeri Teja II.'
})

const searchQuery = ref('')
const selectedTag = ref('Semua Kegiatan')

const tagOptions = computed(() => {
  const set = new Set<string>()
  activities.value?.forEach((item) => {
    if (item.tag) set.add(item.tag)
  })
  return ['Semua Kegiatan', ...Array.from(set)]
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

const filteredActivities = computed(() => {
  if (!activities.value) return []
  return activities.value.filter((item) => {
    const matchTag
      = selectedTag.value === 'Semua Kegiatan'
        || item.tag === selectedTag.value
    const query = searchQuery.value.toLowerCase()
    const matchSearch
      = item.title?.toLowerCase().includes(query)
        || item.description?.toLowerCase().includes(query)
        || (item.tag && item.tag.toLowerCase().includes(query))
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
          <span class="text-highlighted font-medium">Kegiatan</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Agenda & Dokumentasi Kegiatan
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Rangkaian aktivitas kesiswaan, peringatan hari besar, pembiasaan karakter, dan dokumentasi agenda kegiatan SD Negeri Teja II.
          </p>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari dokumentasi agenda atau kegiatan..."
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

      <!-- Kegiatan Cards Grid -->
      <div
        v-if="filteredActivities.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <NuxtLink
          v-for="item in filteredActivities"
          :key="item.path"
          :to="item.path"
          class="group block"
        >
          <UCard class="h-full group-hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <!-- Cover Image -->
              <div
                v-if="item.cover"
                class="h-48 -mx-4 -mt-4 mb-4 overflow-hidden bg-muted relative"
              >
                <img
                  :src="item.cover"
                  :alt="item.title"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <UBadge
                    v-if="item.tag"
                    color="primary"
                    variant="solid"
                    size="xs"
                    class="capitalize"
                  >
                    {{ item.tag }}
                  </UBadge>

                  <span
                    v-if="item.date"
                    class="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded-full"
                  >
                    <UIcon
                      name="i-lucide-calendar"
                      class="size-3"
                    />
                    {{ formatDate(item.date) }}
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <h2 class="font-bold text-highlighted text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {{ item.title }}
                </h2>

                <p class="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="pt-4 mt-4 border-t border-default flex items-center justify-between text-xs text-muted">
              <span class="text-xs text-muted">
                Dokumentasi Sekolah
              </span>

              <span class="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                Lihat Dokumentasi
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
          Kegiatan Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada kegiatan yang cocok dengan kata kunci atau filter yang dipilih.
        </p>
        <UButton
          label="Reset Pencarian"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedTag = 'Semua Kegiatan'"
        />
      </div>
    </UContainer>
  </div>
</template>
