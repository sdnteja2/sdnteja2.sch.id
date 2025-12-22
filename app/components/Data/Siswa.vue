<script setup lang="ts">
// Use the composable for data fetching and utilities
import { Motion } from 'motion-v'

const {
  data,
  pending,
  error,
  refresh,
  totalSiswa,
  siswaLakiLaki,
  siswaPerempuan,
  kelasBreakdown,
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
    title: 'Total Siswa',
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
</script>

<template>
  <UContainer class="siswa-data">
    <div class="mb-6">
      <h2 class="text-2xl font-bold  mb-4">
        Data Siswa Per Kelas
      </h2>

      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
        <span class="ml-2 ">Memuat data siswa...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-sky-100 border border-sky-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline ml-2">
          Data dari server tidak dapat dimuat.
        </span>
        <div class="text-sm mt-2 text-sky-600">
          {{ error.message || 'Gagal memuat data dari Google Apps Script' }}
        </div>
        <UButton
          class="mt-2"
          color="warning"
          size="sm"
          @click="refresh()"
        >
          Coba Muat Ulang
        </UButton>
      </div>

      <!-- Success State -->
      <div v-else-if="data && data.length > 0" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Motion
            v-for="(card, index) in statsCards"
            :key="card.key"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.1 * index }"
          >
            <UCard>
              <template #header>
                <h3 class="font-semibold">
                  {{ card.title }}
                </h3>
              </template>
              <div class="p-4 rounded-lg" :class="card.bgClass">
                <p class="text-2xl font-bold">
                  {{ card.value }}
                </p>
              </div>
            </UCard>
          </Motion>
        </div>

        <!-- Class Data Table -->
        <Motion
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 }"
        >
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold ">
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
              <div class="flex justify-between items-center text-sm  border-t pt-3">
                <span>Total Keseluruhan:</span>
                <div class="flex gap-4">
                  <span>Laki-laki: <strong class="text-blue-600">{{ siswaLakiLaki }}</strong></span>
                  <span>Perempuan: <strong class="text-pink-600">{{ siswaPerempuan }}</strong></span>
                  <span>Total: <strong class="">{{ totalSiswa }}</strong></span>
                </div>
              </div>
            </template>
          </UCard>
        </Motion>
      </div>

      <!-- No Data State -->
      <div v-else class="text-center py-12">
        <div class=" mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-lg  mb-2">
          Tidak ada data siswa
        </p>
        <p class="text-sm  mb-4">
          Data siswa belum tersedia atau gagal dimuat
        </p>
        <UButton color="info" @click="refresh()">
          Coba Muat Ulang
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
