<script setup lang="ts">
import { Motion } from 'motion-v'

// Pagination state
const itemsPerPage = 10
const route = useRoute()
const router = useRouter()

const currentPage = ref(Number(route.query.page) || 1)
// Update query parameter saat `currentPage` berubah
watch(currentPage, (newPage) => {
  router.replace({
    query: {
      ...route.query,
      page: newPage.toString(),
    },
  })
})

const { data: mediaPage } = await useAsyncData(
  'Medias',
  async () => {
    try {
      return await queryCollection('media')
        .select('idVideo', 'title', 'kelas', 'link', 'pelajaran')
        .order('kelas', 'DESC')
        .all()
    }
    catch (error) {
      console.error('Error fetching media data:', error)
      return []
    }
  },
  {
    default: () => [],
  },
)

const video = ref()

// Filter by kelas (class/grade)
const uniqueKelas = computed(() => {
  if (!mediaPage.value)
    return []
  // Extract unique kelas values
  const kelasSet = new Set(mediaPage.value.map(media => media.kelas))
  return ['All', ...Array.from(kelasSet).sort()]
})

const selectedKelas = ref('All')

// Get unique pelajaran based on selected kelas
const uniquePelajaran = computed(() => {
  if (!mediaPage.value)
    return []

  let filteredByKelas = mediaPage.value
  if (selectedKelas.value !== 'All') {
    filteredByKelas = mediaPage.value.filter(media => media.kelas === selectedKelas.value)
  }

  const pelajaranSet = new Set(filteredByKelas.map(media => media.pelajaran))
  const uniquePelajaranList = ['All', ...Array.from(pelajaranSet).sort()]
  return uniquePelajaranList
})

const selectedPelajaran = ref('All')

// Reset pelajaran filter when kelas changes
watch(selectedKelas, (newKelas, oldKelas) => {
  console.warn('Kelas changed from', oldKelas, 'to', newKelas)

  selectedPelajaran.value = 'All'
})

// Watch pelajaran changes
watch(selectedPelajaran, (newPelajaran, oldPelajaran) => {
  console.warn('Pelajaran changed from', oldPelajaran, 'to', newPelajaran)
})

// Filtered media based on selected kelas and pelajaran
const filteredMedia = computed(() => {
  if (!mediaPage.value)
    return []

  let filtered = mediaPage.value

  // Filter by kelas
  if (selectedKelas.value !== 'All') {
    filtered = filtered.filter(media => media.kelas === selectedKelas.value)
  }

  // Filter by pelajaran
  if (selectedPelajaran.value !== 'All') {
    filtered = filtered.filter(media => media.pelajaran === selectedPelajaran.value)
  }

  return filtered
})

const totalItems = computed(() => filteredMedia.value?.length ?? 0)

// Reset to page 1 when filters change
watch([selectedKelas, selectedPelajaran], () => {
  currentPage.value = 1
})

const paginatedMedia = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return (
    filteredMedia.value?.slice(start, end).map(media => ({
      ...media,
      _thumbnailError: false,
      _thumbnailLoaded: false,
    })) ?? []
  )
})

// Handle thumbnail error
function handleImageError(event: Event, media: any) {
  console.warn(`Thumbnail failed to load for video: ${media.idVideo}`)
  media._thumbnailError = true
  media._thumbnailLoaded = false
}

// Handle thumbnail load success
function handleImageLoad(event: Event, media: any) {
  media._thumbnailLoaded = true
  media._thumbnailError = false
}

// Handle YouTube Player error
function handleThumbnailError(error: any) {
  console.warn('YouTube Player Error:', error)
}
</script>

<template>
  <div class="py-20">
    <UContainer>
      <!-- Filter section -->
      <div class="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-bold">
            Pilih Kelas:
          </h3>
          <USelect
            v-model="selectedKelas"
            :items="uniqueKelas"
            placeholder="Select Class"
            class="w-24"
          />
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-bold">
            Pilih Pelajaran:
          </h3>
          <USelect
            v-model="selectedPelajaran"
            :items="uniquePelajaran"
            placeholder="Select Subject"
            class="w-40"
            :disabled="selectedKelas === 'All'"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <Motion
          v-for="(media, index) in paginatedMedia"
          :key="media.idVideo"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
        >
          <div class="flex h-full flex-col justify-center">
            <div
              class="ring-night-200 dark:ring-night-800 h-full overflow-hidden rounded p-4 shadow-lg ring dark:bg-sky-900"
            >
              <ScriptYouTubePlayer
                ref="video"
                thumbnail-size="maxresdefault"
                :player-options="{ host: 'https://www.youtube.com' }"
                :video-id="media.idVideo"
                @error="handleThumbnailError"
              >
                <template #placeholder="{ placeholder }">
                  <div
                    class="relative aspect-video overflow-hidden rounded bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      :src="placeholder"
                      :alt="`${media.title} thumbnail`"
                      class="h-full w-full object-cover"
                      @error="(e) => handleImageError(e, media)"
                      @load="(e) => handleImageLoad(e, media)"
                    >
                    <!-- Fallback content when image fails to load -->
                    <div
                      class="bg-linear-to-br absolute inset-0 flex items-center justify-center from-sky-500 to-sky-600 text-white"
                      :class="{ hidden: !media._thumbnailError }"
                    >
                      <div class="p-6 text-center">
                        <div class="mb-4">
                          <svg
                            class="mx-auto h-16 w-16 opacity-80"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4l-2-1.5L9 9V5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 class="mb-2 text-sm font-semibold">
                          {{ media.pelajaran }}
                        </h4>
                        <p class="line-clamp-2 text-xs opacity-90">
                          {{ media.title }}
                        </p>
                        <div
                          class="mt-3 rounded-full bg-white bg-opacity-20 px-3 py-1 text-xs font-medium"
                        >
                          Kelas {{ media.kelas }}
                        </div>
                      </div>
                    </div>
                    <!-- Play button overlay -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div
                        class="flex h-16 w-16 transform items-center justify-center rounded-full bg-sky-600 bg-opacity-90 shadow-lg transition-transform hover:scale-110"
                      >
                        <svg
                          class="ml-1 h-6 w-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </template>
                <template #awaitingLoad>
                  <div
                    class="w-17 absolute left-1/2 top-1/2 h-12 -translate-x-1/2 -translate-y-1/2 transform"
                  >
                    <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                      <path
                        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                        fill="#f00"
                      />
                      <path d="M 45,24 27,14 27,34" fill="#fff" />
                    </svg>
                  </div>
                </template>
              </ScriptYouTubePlayer>
              <div class="mt-4 flex flex-col justify-center">
                <h2 class="text-sm font-bold">
                  {{ media.pelajaran }} - {{ media.title }}
                </h2>
                <div class="flex flex-row items-center justify-between">
                  <UBadge block class="mt-2">
                    Kelas {{ media.kelas }}
                  </UBadge>
                  <UButton :to="media.link" target="_blank" icon="i-ph-arrow-up-right-duotone" />
                </div>
              </div>
            </div>
          </div>
        </Motion>
      </div>

      <div class="mt-8 flex justify-center">
        <UPagination
          v-model:page="currentPage"
          show-edges
          :items-per-page="itemsPerPage"
          color="primary"
          :sibling-count="1"
          :total="totalItems"
          variant="soft"
        />
      </div>
    </UContainer>
  </div>
</template>
