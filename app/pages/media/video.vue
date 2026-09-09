<script setup lang="ts">
useSeoMeta({
  title: 'Video Pembelajaran - SD Negeri Teja II',
  description:
    'Koleksi video materi pembelajaran Kurikulum Merdeka interaktif untuk Kelas 1 hingga Kelas 6 di SD Negeri Teja II.',
  ogTitle: 'Video Pembelajaran - SD Negeri Teja II',
  ogDescription:
    'Koleksi video materi pembelajaran Kurikulum Merdeka interaktif untuk Kelas 1 hingga Kelas 6 di SD Negeri Teja II.',
  ogImage: '/cover/sekolah.png'
})

defineOgImage('OgImage', {
  page: 'Media',
  title: 'Video Pembelajaran',
  description: 'Materi video Kurikulum Merdeka interaktif untuk mendampingi belajar siswa SD Negeri Teja II.'
})

interface VideoItem {
  title: string
  idVideo: string
  link: string
  kelas: string
  pelajaran: string
}

const { data: rawVideos } = await useAsyncData('video-pembelajaran', async () => {
  try {
    return await queryCollection('video').all()
  } catch (err) {
    console.error('Gagal mengambil data video:', err)
    return []
  }
})

const videos = computed<VideoItem[]>(() => {
  return ((rawVideos.value || []) as VideoItem[]).sort((a, b) => {
    if (a.kelas !== b.kelas) {
      return Number(a.kelas) - Number(b.kelas)
    }
    return a.pelajaran.localeCompare(b.pelajaran)
  })
})

const searchQuery = ref('')
const selectedKelas = ref('Semua Kelas')
const selectedPelajaran = ref('Semua Pelajaran')
const currentPage = ref(1)
const itemsPerPage = 12

const kelasOptions = [
  'Semua Kelas',
  'Kelas 1',
  'Kelas 2',
  'Kelas 3',
  'Kelas 4',
  'Kelas 5',
  'Kelas 6'
]

// Dynamic pelajaran list based on selected kelas
const pelajaranOptions = computed(() => {
  let list = videos.value
  if (selectedKelas.value !== 'Semua Kelas') {
    const k = selectedKelas.value.replace('Kelas ', '')
    list = list.filter(v => v.kelas === k)
  }
  const set = new Set(list.map(v => v.pelajaran).filter(Boolean))
  return ['Semua Pelajaran', ...Array.from(set).sort()]
})

// Reset pelajaran and page when kelas changes
watch(selectedKelas, () => {
  selectedPelajaran.value = 'Semua Pelajaran'
  currentPage.value = 1
})

watch([searchQuery, selectedPelajaran], () => {
  currentPage.value = 1
})

const filteredVideos = computed(() => {
  return videos.value.filter((item) => {
    const matchKelas
      = selectedKelas.value === 'Semua Kelas'
        || item.kelas === selectedKelas.value.replace('Kelas ', '')

    const matchPelajaran
      = selectedPelajaran.value === 'Semua Pelajaran'
        || item.pelajaran === selectedPelajaran.value

    const q = searchQuery.value.trim().toLowerCase()
    const matchSearch
      = !q
        || item.title.toLowerCase().includes(q)
        || item.pelajaran.toLowerCase().includes(q)

    return matchKelas && matchPelajaran && matchSearch
  })
})

const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredVideos.value.slice(start, start + itemsPerPage)
})

const resetFilter = () => {
  searchQuery.value = ''
  selectedKelas.value = 'Semua Kelas'
  selectedPelajaran.value = 'Semua Pelajaran'
  currentPage.value = 1
}

const onPageChange = (page: number) => {
  currentPage.value = page
  if (import.meta.client) {
    const target = document.getElementById('video-grid-top')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
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
          <span class="text-muted">Media</span>
          <span>/</span>
          <span class="text-highlighted font-medium">Video</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              Video Pembelajaran
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              Materi video edukatif Kurikulum Merdeka interaktif untuk mendampingi belajar siswa SD Negeri Teja II.
            </p>
          </div>

          <UBadge
            color="primary"
            variant="subtle"
            size="md"
            class="self-start md:self-auto"
          >
            {{ videos.length }} Video Pembelajaran
          </UBadge>
        </div>
      </div>

      <!-- Filter Bar -->
      <div
        id="video-grid-top"
        class="p-4 rounded-2xl border border-default bg-elevated/40 space-y-3"
      >
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <!-- Search Input -->
          <div class="sm:col-span-6 lg:col-span-6">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Cari materi atau pelajaran..."
              size="md"
              class="w-full"
            />
          </div>

          <!-- Class Selector -->
          <div class="sm:col-span-3 lg:col-span-3">
            <USelect
              v-model="selectedKelas"
              :items="kelasOptions"
              icon="i-lucide-graduation-cap"
              size="md"
              class="w-full"
            />
          </div>

          <!-- Subject Selector -->
          <div class="sm:col-span-3 lg:col-span-3">
            <USelect
              v-model="selectedPelajaran"
              :items="pelajaranOptions"
              icon="i-lucide-book-open"
              size="md"
              class="w-full"
            />
          </div>
        </div>

        <!-- Filter summary & active indicators -->
        <div class="flex items-center justify-between text-xs text-muted pt-1 border-t border-default/60">
          <span>
            Menampilkan
            <strong class="text-highlighted">{{ filteredVideos.length }}</strong>
            dari {{ videos.length }} video
          </span>

          <button
            v-if="searchQuery || selectedKelas !== 'Semua Kelas' || selectedPelajaran !== 'Semua Pelajaran'"
            class="text-primary hover:underline flex items-center gap-1 font-medium transition-colors"
            @click="resetFilter"
          >
            <UIcon
              name="i-lucide-rotate-ccw"
              class="size-3.5"
            />
            Reset Filter
          </button>
        </div>
      </div>

      <!-- Video Grid -->
      <div
        v-if="paginatedVideos.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="item in paginatedVideos"
          :key="item.idVideo"
          class="group hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden"
          :ui="{ body: 'p-0 sm:p-0 flex flex-col h-full' }"
        >
          <!-- YouTube Player with Nuxt Scripts Facade -->
          <div class="relative aspect-video w-full overflow-hidden bg-black rounded-t-xl">
            <ScriptYouTubePlayer
              :video-id="item.idVideo"
              thumbnail-size="hqdefault"
              class="w-full h-full"
            >
              <template #awaitingLoad>
                <div class="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/10 transition-colors cursor-pointer">
                  <div class="size-14 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <UIcon
                      name="i-lucide-play"
                      class="size-6 ms-0.5"
                    />
                  </div>
                </div>
              </template>
            </ScriptYouTubePlayer>

            <!-- Class badge pinned on top -->
            <div class="absolute top-2.5 left-2.5 pointer-events-none z-10">
              <UBadge
                color="primary"
                variant="solid"
                size="xs"
                class="shadow-sm font-semibold"
              >
                Kelas {{ item.kelas }}
              </UBadge>
            </div>
          </div>

          <!-- Video Info -->
          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-2">
              <div class="flex items-center gap-2 flex-wrap">
                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ item.pelajaran }}
                </UBadge>
              </div>

              <h2 class="font-bold text-highlighted text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {{ item.title }}
              </h2>
            </div>

            <div class="pt-3 border-t border-default flex items-center justify-between text-xs">
              <span class="text-muted">SD Negeri Teja II</span>

              <UButton
                :to="item.link"
                target="_blank"
                rel="noopener noreferrer"
                label="Buka di YouTube"
                icon="i-lucide-external-link"
                trailing
                color="neutral"
                variant="ghost"
                size="xs"
                class="hover:text-primary"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-16 space-y-3 rounded-2xl border border-dashed border-default p-8"
      >
        <UIcon
          name="i-lucide-video-off"
          class="size-12 text-muted mx-auto"
        />
        <p class="text-highlighted font-semibold text-lg">
          Video Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada video pembelajaran yang cocok dengan filter atau kata kunci pencarian Anda.
        </p>
        <UButton
          label="Reset Filter"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="resetFilter"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredVideos.length > itemsPerPage"
        class="flex justify-center pt-4"
      >
        <UPagination
          :page="currentPage"
          :total="filteredVideos.length"
          :items-per-page="itemsPerPage"
          color="primary"
          variant="subtle"
          @update:page="onPageChange"
        />
      </div>
    </UContainer>
  </div>
</template>
