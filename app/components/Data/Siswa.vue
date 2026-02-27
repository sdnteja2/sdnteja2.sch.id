<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { motion } from 'motion-v'
// Use the composable for data fetching and utilities
import { h, resolveComponent } from 'vue'

const UButton = resolveComponent('UButton')

interface StudentData {
  nis: string | number
  nama: string
  kelas: string
  jenisKelamin: string
  usia: number | string
}

const {
  data,
  pending,
  error,
  refresh,
  totalSiswa,
  siswaLakiLaki,
  siswaPerempuan,
  kelasBreakdown,
  availableKelas,
  filterSiswa,
  getGenderLabel,
} = useSiswaData()

// Transform class breakdown data for UTable
const tableData = computed(() => {
  return kelasBreakdown.value.map(kelas => ({
    'kelas': kelas.kelas,
    'laki-laki': kelas.laki,
    'perempuan': kelas.perempuan,
    'total siswa': kelas.total,
    'persentase': `${totalSiswa.value > 0 ? Math.round((kelas.total / totalSiswa.value) * 100) : 0}%`,
  }))
})

// Stats cards data for animation
const statsCards = computed(() => [
  {
    key: 'total',
    title: 'Total',
    value: totalSiswa.value,
    bgClass: 'bg-blue-50 dark:bg-blue-900',
  },
  {
    key: 'laki',
    title: 'Laki-laki',
    value: siswaLakiLaki.value,
    bgClass: 'bg-green-50 dark:bg-green-900',
  },
  {
    key: 'perempuan',
    title: 'Perempuan',
    value: siswaPerempuan.value,
    bgClass: 'bg-pink-50 dark:bg-pink-900',
  },
])

// Filter states for student detail table
const searchQuery = ref('')
const selectedKelas = ref<string | number>('Semua Kelas')
const selectedGender = ref<string>('Semua Jenis Kelamin')

// Filtered student data
const filteredStudents = computed(() => {
  const kelasFilter = selectedKelas.value === 'Semua Kelas' ? undefined : selectedKelas.value
  const genderFilter
    = selectedGender.value === 'Semua Jenis Kelamin' ? undefined : selectedGender.value
  return filterSiswa(searchQuery.value, kelasFilter, genderFilter)
})

// Pagination
const currentPage = ref(1)
const pageSize = 10

// Reset to page 1 when filters change
watch([searchQuery, selectedKelas, selectedGender], () => {
  currentPage.value = 1
})

// Paginated data
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredStudents.value.slice(start, end)
})

// Transform student data for table
const studentTableData = computed(() => {
  return paginatedStudents.value.map(siswa => ({
    nis: siswa.nis || siswa.nisn || '-',
    nama: siswa.nama || siswa.name || '-',
    kelas: `Kelas ${siswa.kelas || siswa.class || '-'}`,
    jenisKelamin: getGenderLabel(siswa),
    usia: siswa.usia || siswa.age || 0,
  }))
})

// Define columns with sorting
const studentColumns: TableColumn<StudentData>[] = [
  {
    accessorKey: 'nis',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'NIS',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-ph-sort-ascending-duotone'
            : 'i-ph-sort-descending-duotone'
          : 'i-ph-funnel-duotone',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => h('span', { class: 'font-mono text-sm' }, row.getValue('nis')),
  },
  {
    accessorKey: 'nama',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Nama',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-ph-sort-ascending-duotone'
            : 'i-ph-sort-descending-duotone'
          : 'i-ph-funnel-duotone',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    accessorKey: 'kelas',
    header: 'Kelas',
  },
  {
    accessorKey: 'jenisKelamin',
    header: 'Jenis Kelamin',
  },
  {
    accessorKey: 'usia',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Usia',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-ph-sort-ascending-duotone'
            : 'i-ph-sort-descending-duotone'
          : 'i-ph-funnel-duotone',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => `${row.getValue('usia')} tahun`,
  },
]

// Sorting state
const sorting = ref([])

// Clear filters
function clearFilters() {
  searchQuery.value = ''
  selectedKelas.value = 'Semua Kelas'
  selectedGender.value = 'Semua Jenis Kelamin'
}

// Gender options for filter
</script>

<template>
  <UContainer class="siswa-data">
    <div class="mb-6">
      <h2 class="mb-4 text-2xl font-bold">
        Data Siswa Per Kelas
      </h2>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-6">
        <!-- Stats Cards Skeleton -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <UCard v-for="i in 3" :key="i">
            <template #header>
              <USkeleton class="h-5 w-32" />
            </template>
            <div class="p-4">
              <USkeleton class="h-8 w-20" />
            </div>
          </UCard>
        </div>

        <!-- Table Skeleton -->
        <UCard>
          <template #header>
            <USkeleton class="h-6 w-48" />
          </template>
          <div class="space-y-3">
            <div v-for="i in 5" :key="i" class="flex gap-4">
              <USkeleton class="h-4 w-16" />
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-4 w-24" />
              <USkeleton class="h-4 w-32" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="mb-4 rounded border border-sky-400 bg-sky-100 px-4 py-3 text-red-700"
      >
        <strong class="font-bold">Error:</strong>
        <span class="ml-2 block sm:inline"> Data dari server tidak dapat dimuat. </span>
        <div class="mt-2 text-sm text-sky-600">
          {{ error.message || 'Gagal memuat data dari Google Apps Script' }}
        </div>
        <UButton class="mt-2" color="warning" size="sm" @click="refresh()">
          Coba Muat Ulang
        </UButton>
      </div>

      <!-- Success State -->
      <div v-else-if="data && data.length > 0" class="space-y-6">
        <!-- Stats Cards -->
        <div class="mb-6 grid grid-cols-3 gap-4">
          <motion.div
            v-for="(card, index) in statsCards"
            :key="card.key"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.1 * index }"
          >
            <UCard>
              <template #header>
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ card.title }}
                </h3>
              </template>
              <div
                class="flex items-center justify-center rounded-lg px-4 py-3"
                :class="card.bgClass"
              >
                <p class="text-3xl font-bold">
                  {{ card.value }}
                </p>
              </div>
            </UCard>
          </motion.div>
        </div>

        <!-- Class Data Table -->
        <motion.div
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 }"
        >
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">
                Rincian Data Per Kelas
              </h3>
            </template>

            <UTable
              :loading="pending"
              loading-color="primary"
              loading-animation="carousel"
              :data="tableData"
              class="w-full"
            />

            <!-- Summary Footer -->
            <template #footer>
              <div class="flex items-center justify-between border-t pt-3 text-sm">
                <span>Total Keseluruhan:</span>
                <div class="flex gap-4">
                  <span>Laki-laki: <strong class="text-blue-600">{{ siswaLakiLaki }}</strong></span>
                  <span>Perempuan: <strong class="text-pink-600">{{ siswaPerempuan }}</strong></span>
                  <span>Total: <strong class="">{{ totalSiswa }}</strong></span>
                </div>
              </div>
            </template>
          </UCard>
        </motion.div>

        <!-- Student Detail Table with Filters -->
        <motion.div
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.6 }"
        >
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">
                  Data Detail Siswa
                </h3>
                <UBadge color="primary" variant="subtle">
                  {{ filteredStudents.length }} siswa
                </UBadge>
              </div>
            </template>

            <!-- Filters -->
            <div class="mb-4 space-y-3">
              <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <!-- Search Input -->
                <UInput
                  v-model="searchQuery"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="Cari nama atau NIS..."
                >
                  <template v-if="searchQuery" #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      :padded="false"
                      @click="searchQuery = ''"
                    />
                  </template>
                </UInput>

                <!-- Kelas Filter -->
                <USelect
                  v-model="selectedKelas"
                  :items="[
                    'Semua Kelas',
                    ...availableKelas.map((k) => ({ value: k, label: `Kelas ${k}` })),
                  ]"
                  placeholder="Pilih Kelas"
                />

                <!-- Gender Filter -->
                <USelect
                  v-model="selectedGender"
                  :items="[
                    'Semua Jenis Kelamin',
                    { value: 'L', label: 'Laki-laki' },
                    { value: 'P', label: 'Perempuan' },
                  ]"
                  placeholder="Pilih Jenis Kelamin"
                />
              </div>

              <!-- Clear Filters Button -->
              <div
                v-if="
                  searchQuery
                    || selectedKelas !== 'Semua Kelas'
                    || selectedGender !== 'Semua Jenis Kelamin'
                "
                class="flex justify-end"
              >
                <UButton
                  color="neutral"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="clearFilters"
                >
                  Reset Filter
                </UButton>
              </div>
            </div>

            <!-- Student Table -->
            <UTable
              v-model:sorting="sorting"
              :data="studentTableData"
              :columns="studentColumns"
              :loading="pending"
              class="w-full"
            />

            <!-- Empty State -->
            <div
              v-if="filteredStudents.length === 0 && !pending"
              class="py-8 text-center text-gray-500"
            >
              <p>Tidak ada data siswa yang sesuai dengan filter</p>
            </div>

            <template #footer>
              <div class="flex flex-col items-center justify-between md:flex-row">
                <div class="text-sm text-gray-600">
                  Menampilkan {{ (currentPage - 1) * pageSize + 1 }} -
                  {{ Math.min(currentPage * pageSize, filteredStudents.length) }} dari
                  {{ filteredStudents.length }} siswa
                </div>
                <UPagination
                  v-if="filteredStudents.length > pageSize"
                  v-model:page="currentPage"
                  :total="filteredStudents.length"
                  :items-per-page="pageSize"
                  show-edges
                  :sibling-count="0"
                  size="xs"
                />
              </div>
            </template>
          </UCard>
        </motion.div>
      </div>

      <!-- No Data State -->
      <div v-else class="py-12 text-center">
        <div class="mb-4">
          <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="mb-2 text-lg">
          Tidak ada data siswa
        </p>
        <p class="mb-4 text-sm">
          Data siswa belum tersedia atau gagal dimuat
        </p>
        <UButton color="info" @click="refresh()">
          Coba Muat Ulang
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
