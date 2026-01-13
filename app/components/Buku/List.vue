<script setup lang="ts">
import { Motion } from 'motion-v'

// Pagination state
const itemsPerPage = 12
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

const { data: bukuData } = await useAsyncData('Buku', () => {
  return queryCollection('buku')
    .select('title', 'path', 'kelas', 'pelajaran', 'link', 'tipe', 'image')
    .order('kelas', 'ASC')
    .all()
})

// Filter by kelas (class/grade)
const uniqueKelas = computed(() => {
  if (!bukuData.value)
    return []
  // Extract unique kelas values
  const kelasSet = new Set(bukuData.value.map(buku => buku.kelas))
  return ['Semua Kelas', ...Array.from(kelasSet).sort()]
})

const selectedKelas = ref('Semua Kelas')

// Get unique pelajaran (independent filter)
const uniquePelajaran = computed(() => {
  if (!bukuData.value)
    return []

  const pelajaranSet = new Set(bukuData.value.map(buku => buku.pelajaran))
  return ['Semua Mapel', ...Array.from(pelajaranSet).sort()]
})

const selectedPelajaran = ref('Semua Mapel')

// Filtered buku based on selected kelas and pelajaran
const filteredBuku = computed(() => {
  if (!bukuData.value)
    return []

  let filtered = bukuData.value

  // Filter by kelas
  if (selectedKelas.value !== 'Semua Kelas') {
    filtered = filtered.filter(buku => buku.kelas === selectedKelas.value)
  }

  // Filter by pelajaran
  if (selectedPelajaran.value !== 'Semua Mapel') {
    filtered = filtered.filter(buku => buku.pelajaran === selectedPelajaran.value)
  }

  return filtered
})

const totalItems = computed(() => filteredBuku.value?.length ?? 0)

// Reset to page 1 when filters change
watch([selectedKelas, selectedPelajaran], () => {
  currentPage.value = 1
})

const paginatedBuku = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBuku.value?.slice(start, end) ?? []
})

// Visual helper for book colors based on class
function getBookColor(kelas: string) {
  const colors = {
    1: 'text-red-500 bg-red-100 dark:bg-red-900/20',
    2: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
    3: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
    4: 'text-green-500 bg-green-100 dark:bg-green-900/20',
    5: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
    6: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
  }
  return colors[kelas as unknown as keyof typeof colors] || 'text-primary-500 bg-primary-100 dark:bg-primary-900/20'
}
</script>

<template>
  <div class="py-12">
    <UContainer>
      <!-- Filter Header -->
      <div class="mb-10 text-center space-y-4">
        <h2 class="text-3xl font-bold">
          Perpustakaan Digital
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Akses buku pelajaran digital (BSE) untuk siswa dan guru. Filter berdasarkan kelas atau mata pelajaran yang Anda butuhkan.
        </p>

        <!-- Filters -->
        <div class="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center justify-center">
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-bold">
              Pilih Kelas:
            </h3>
            <USelect
              v-model="selectedKelas"
              :items="uniqueKelas"
              placeholder="Pilih Kelas"
              class="w-40"
              icon="i-ph-chalkboard-teacher-duotone"
            />
          </div>

          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-bold">
              Pilih Pelajaran:
            </h3>
            <USelect
              v-model="selectedPelajaran"
              :items="uniquePelajaran"
              placeholder="Pilih Pelajaran"
              class="w-56"
              :disabled="selectedKelas === 'Semua Kelas'"
              icon="i-ph-books-duotone"
            />
          </div>
        </div>

        <!-- Data Info -->
        <div class="mt-4 text-sm text-gray-500 text-center">
          <span v-if="bukuData">Menampilkan {{ filteredBuku.length }} buku dari total {{ bukuData.length }} buku</span>
          <span v-else>Memuat data buku...</span>
        </div>
      </div>

      <!-- Book Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Motion
          v-for="(buku, index) in paginatedBuku"
          :key="buku.title"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.05 * index }"
        >
          <div class="group relative h-full">
            <!-- Card Container -->
            <div class="h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <!-- Book Visual (Icon or Image) -->
              <div v-if="buku.image" class="w-full aspect-21/29 mb-4 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 relative group-hover:shadow-md transition-all">
                <NuxtImg
                  :src="buku.image"
                  :alt="buku.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  format="webp"
                  quality="50"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300"
                :class="getBookColor(buku.kelas)"
              >
                <UIcon name="i-ph-book-bookmark-duotone" class="w-8 h-8" />
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                  <UBadge size="xs" color="primary" variant="soft">
                    Kelas {{ buku.kelas }}
                  </UBadge>
                  <UBadge size="xs" :color="buku.tipe === 'Buku Guru' ? 'neutral' : 'primary'" variant="subtle">
                    {{ buku.tipe }}
                  </UBadge>
                </div>

                <h3 class="font-bold text-gray-900 dark:text-white mb-1  min-h-12 line-clamp-1">
                  {{ buku.title }}
                </h3>

                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">
                  {{ buku.pelajaran }}
                </p>
              </div>

              <!-- Footer Action -->
              <div class="pt-4 mt-auto border-t border-gray-100 dark:border-gray-700 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                <span class="text-xs text-gray-400">PDF Document</span>
                <UButton
                  :to="buku.path"
                  color="primary"
                  variant="ghost"
                  size="xs"
                  icon="i-ph-arrow-right-bold"
                >
                  Buka
                </UButton>
              </div>
            </div>
          </div>
        </Motion>
      </div>

      <!-- Empty state -->
      <div v-if="paginatedBuku.length === 0" class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl mt-8">
        <UIcon name="i-ph-books-duotone" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Tidak ada buku ditemukan
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Coba ganti filter kelas atau mata pelajaran lainnya.
        </p>
        <UButton

          variant="ghost"
          label="Reset Filter"
          @click="selectedKelas = 'Semua Kelas'; selectedPelajaran = 'Semua Mapel'"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalItems > itemsPerPage" class="flex justify-center mt-12">
        <UPagination
          v-model:page="currentPage"
          :items-per-page="itemsPerPage"
          :total="totalItems"
        />
      </div>
    </UContainer>
  </div>
</template>
