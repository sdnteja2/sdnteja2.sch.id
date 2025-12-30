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
    .select('title', 'path', 'kelas', 'pelajaran', 'link', 'tipe')
    .order('kelas', 'ASC')
    .all()
})

// Filter by kelas (class/grade)
const uniqueKelas = computed(() => {
  if (!bukuData.value)
    return []
  // Extract unique kelas values
  const kelasSet = new Set(bukuData.value.map(buku => buku.kelas))
  return ['All', ...Array.from(kelasSet).sort()]
})

const selectedKelas = ref('All')

// Get unique pelajaran based on selected kelas
const uniquePelajaran = computed(() => {
  if (!bukuData.value)
    return []

  let filteredByKelas = bukuData.value
  if (selectedKelas.value !== 'All') {
    filteredByKelas = bukuData.value.filter(buku => buku.kelas === selectedKelas.value)
  }

  const pelajaranSet = new Set(filteredByKelas.map(buku => buku.pelajaran))
  const uniquePelajaranList = ['All', ...Array.from(pelajaranSet).sort()]
  return uniquePelajaranList
})

const selectedPelajaran = ref('All')

// Reset pelajaran filter when kelas changes
watch(selectedKelas, () => {
  selectedPelajaran.value = 'All'
})

// Filtered buku based on selected kelas and pelajaran
const filteredBuku = computed(() => {
  if (!bukuData.value)
    return []

  let filtered = bukuData.value

  // Filter by kelas
  if (selectedKelas.value !== 'All') {
    filtered = filtered.filter(buku => buku.kelas === selectedKelas.value)
  }

  // Filter by pelajaran
  if (selectedPelajaran.value !== 'All') {
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

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Motion
          v-for="(buku, index) in paginatedBuku"
          :key="buku.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
        >
          <div class="flex h-full flex-col justify-center">
            <div
              class="ring-night-200 dark:ring-night-800 h-full overflow-hidden rounded p-4 shadow-lg ring transition-shadow hover:shadow-xl dark:bg-sky-900"
            >
              <!-- Book Info -->
              <div class="flex h-full flex-col justify-center">
                <h2 class="mb-2 line-clamp-2 text-sm font-bold">
                  {{ buku.title }}
                </h2>

                <div class="mb-4 space-y-1 text-xs">
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-semibold">Pelajaran:</span> {{ buku.pelajaran }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-semibold">Tipe:</span> {{ buku.tipe }}
                  </p>
                </div>

                <div class="flex items-center justify-between gap-2">
                  <UBadge block class="mt-2">
                    Kelas {{ buku.kelas }}
                  </UBadge>
                  <UButton :to="buku.path" icon="i-ph-arrow-square-up-right-duotone" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </Motion>
      </div>

      <!-- Empty state -->
      <div v-if="paginatedBuku.length === 0" class="py-12 text-center">
        <p class="text-gray-500 dark:text-gray-400">
          Tidak ada buku ditemukan untuk filter yang dipilih
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="totalItems > 0" class="mt-8 flex justify-center">
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
