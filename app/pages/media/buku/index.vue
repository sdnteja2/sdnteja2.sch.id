<script setup lang="ts">
useSeoMeta({
  title: 'Pojok Baca & Buku Digital - SD Negeri Teja II',
  description:
    'Koleksi lengkap buku teks Kurikulum Merdeka (Buku Siswa dan Buku Guru) Kelas 1 hingga Kelas 6 SD Negeri Teja II.',
  ogTitle: 'Pojok Baca & Buku Digital - SD Negeri Teja II',
  ogDescription:
    'Koleksi lengkap buku teks Kurikulum Merdeka (Buku Siswa dan Buku Guru) Kelas 1 hingga Kelas 6 SD Negeri Teja II.'
})

defineOgImage('OgImage', {
  page: 'Buku',
  title: 'Pojok Baca & Buku Digital',
  description: 'Koleksi lengkap buku teks Kurikulum Merdeka Kelas 1 hingga Kelas 6 SD Negeri Teja II.'
})

interface BukuItem {
  title: string
  path: string
  kelas: string
  pelajaran: string
  link?: string
  tipe?: string
  image?: string
  driveId?: string
}

const { data: rawBooks } = await useAsyncData(
  'buku-list',
  async () => {
    try {
      return await queryCollection('buku').all()
    } catch (err) {
      console.error('Gagal mengambil data buku:', err)
      return []
    }
  },
  {
    getCachedData(key, nuxtApp) {
      if (nuxtApp.payload.data[key] || nuxtApp.static.data[key]) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
      if (import.meta.client) {
        try {
          const item = localStorage.getItem(`sdnteja2-cache-${key}`)
          if (item) {
            return JSON.parse(item)
          }
        } catch {
          // Ignore storage error
        }
      }
    }
  }
)

watch(
  rawBooks,
  (val) => {
    if (import.meta.client && val?.length) {
      try {
        localStorage.setItem('sdnteja2-cache-buku-list', JSON.stringify(val))
      } catch {
        // Ignore storage error
      }
    }
  },
  { immediate: true }
)

const books = computed<BukuItem[]>(() => {
  return ((rawBooks.value || []) as BukuItem[]).sort((a, b) => {
    if (a.kelas !== b.kelas) {
      return Number(a.kelas) - Number(b.kelas)
    }
    if (a.pelajaran !== b.pelajaran) {
      return a.pelajaran.localeCompare(b.pelajaran)
    }
    // Prioritaskan Buku Siswa terlebih dahulu
    if (a.tipe === 'Buku Siswa' && b.tipe !== 'Buku Siswa') return -1
    if (a.tipe !== 'Buku Siswa' && b.tipe === 'Buku Siswa') return 1
    return a.title.localeCompare(b.title)
  })
})

const searchQuery = ref('')
const selectedKelas = ref('Semua Kelas')
const selectedPelajaran = ref('Semua Mapel')
const selectedTipe = ref('Semua Tipe')
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

const tipeOptions = [
  'Semua Tipe',
  'Buku Siswa',
  'Buku Guru'
]

// Dynamic pelajaran list based on selected kelas
const pelajaranOptions = computed(() => {
  let list = books.value
  if (selectedKelas.value !== 'Semua Kelas') {
    const k = selectedKelas.value.replace('Kelas ', '')
    list = list.filter(b => b.kelas === k)
  }
  const set = new Set(list.map(b => b.pelajaran).filter(Boolean))
  return ['Semua Mapel', ...Array.from(set).sort()]
})

// Reset filters
watch(selectedKelas, () => {
  selectedPelajaran.value = 'Semua Mapel'
  currentPage.value = 1
})

watch([searchQuery, selectedPelajaran, selectedTipe], () => {
  currentPage.value = 1
})

const filteredBooks = computed(() => {
  return books.value.filter((b) => {
    const matchKelas
      = selectedKelas.value === 'Semua Kelas'
        || b.kelas === selectedKelas.value.replace('Kelas ', '')

    const matchPelajaran
      = selectedPelajaran.value === 'Semua Mapel'
        || b.pelajaran === selectedPelajaran.value

    const matchTipe
      = selectedTipe.value === 'Semua Tipe'
        || b.tipe === selectedTipe.value

    const q = searchQuery.value.trim().toLowerCase()
    const matchSearch
      = !q
        || b.title.toLowerCase().includes(q)
        || b.pelajaran.toLowerCase().includes(q)

    return matchKelas && matchPelajaran && matchTipe && matchSearch
  })
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredBooks.value.slice(start, start + itemsPerPage)
})

const resetFilter = () => {
  searchQuery.value = ''
  selectedKelas.value = 'Semua Kelas'
  selectedPelajaran.value = 'Semua Mapel'
  selectedTipe.value = 'Semua Tipe'
  currentPage.value = 1
}

const onPageChange = (page: number) => {
  currentPage.value = page
  if (import.meta.client) {
    const target = document.getElementById('buku-grid-top')
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
          <span class="text-highlighted font-medium">Buku</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              Pojok Baca & Buku Digital
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              Perpustakaan digital Kurikulum Merdeka SD Negeri Teja II untuk mendukung literasi dan belajar mandiri siswa maupun dewan guru.
            </p>
          </div>

          <UBadge
            color="primary"
            variant="subtle"
            size="md"
            class="self-start md:self-auto"
          >
            {{ books.length }} Judul Buku Tersedia
          </UBadge>
        </div>
      </div>

      <!-- Filter Bar -->
      <div
        id="buku-grid-top"
        class="p-4 rounded-2xl border border-default bg-elevated/40 space-y-3"
      >
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <!-- Search -->
          <div class="sm:col-span-5 lg:col-span-5">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Cari judul buku atau mapel..."
              size="md"
              class="w-full"
            />
          </div>

          <!-- Kelas -->
          <div class="sm:col-span-3 lg:col-span-3">
            <USelect
              v-model="selectedKelas"
              :items="kelasOptions"
              icon="i-lucide-graduation-cap"
              size="md"
              class="w-full"
            />
          </div>

          <!-- Mapel -->
          <div class="sm:col-span-2 lg:col-span-2">
            <USelect
              v-model="selectedPelajaran"
              :items="pelajaranOptions"
              icon="i-lucide-book-open"
              size="md"
              class="w-full"
            />
          </div>

          <!-- Tipe -->
          <div class="sm:col-span-2 lg:col-span-2">
            <USelect
              v-model="selectedTipe"
              :items="tipeOptions"
              icon="i-lucide-filter"
              size="md"
              class="w-full"
            />
          </div>
        </div>

        <!-- Filter Summary & Reset -->
        <div class="flex items-center justify-between text-xs text-muted pt-1 border-t border-default/60">
          <span>
            Menampilkan
            <strong class="text-highlighted">{{ filteredBooks.length }}</strong>
            dari {{ books.length }} buku
          </span>

          <button
            v-if="searchQuery || selectedKelas !== 'Semua Kelas' || selectedPelajaran !== 'Semua Mapel' || selectedTipe !== 'Semua Tipe'"
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

      <!-- Books Grid -->
      <div
        v-if="paginatedBooks.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <UCard
          v-for="book in paginatedBooks"
          :key="book.path"
          class="group hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden"
          :ui="{ body: 'p-0 sm:p-0 flex flex-col h-full' }"
        >
          <!-- Book Cover Preview -->
          <NuxtLink
            :to="book.path"
            class="block relative aspect-[3/4] w-full overflow-hidden bg-muted border-b border-default cursor-pointer"
          >
            <img
              v-if="book.image"
              :src="book.image"
              :alt="book.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            >
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-muted/80 to-muted text-muted"
            >
              <UIcon
                name="i-lucide-book-open"
                class="size-12 mb-2 text-primary/70"
              />
              <span class="text-xs font-semibold text-highlighted line-clamp-3">
                {{ book.title }}
              </span>
            </div>

            <!-- Badges overlay -->
            <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
              <UBadge
                color="primary"
                variant="solid"
                size="xs"
                class="shadow-sm font-semibold"
              >
                Kelas {{ book.kelas }}
              </UBadge>
              <UBadge
                v-if="book.tipe"
                :color="book.tipe === 'Buku Guru' ? 'warning' : 'neutral'"
                variant="subtle"
                size="xs"
                class="shadow-sm font-medium"
              >
                {{ book.tipe }}
              </UBadge>
            </div>
          </NuxtLink>

          <!-- Book Info -->
          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-1.5">
              <span class="text-xs font-medium text-primary block">
                {{ book.pelajaran }}
              </span>
              <NuxtLink
                :to="book.path"
                class="block font-bold text-highlighted text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2"
              >
                {{ book.title }}
              </NuxtLink>
            </div>

            <div class="pt-3 border-t border-default flex items-center justify-between">
              <UButton
                :to="book.path"
                label="Baca Buku"
                icon="i-lucide-book-open"
                color="primary"
                variant="subtle"
                size="xs"
                class="w-full justify-center"
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
          name="i-lucide-book-x"
          class="size-12 text-muted mx-auto"
        />
        <p class="text-highlighted font-semibold text-lg">
          Buku Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada buku teks yang cocok dengan filter kelas, mapel, atau pencarian Anda.
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
        v-if="filteredBooks.length > itemsPerPage"
        class="flex justify-center pt-4"
      >
        <UPagination
          :page="currentPage"
          :total="filteredBooks.length"
          :items-per-page="itemsPerPage"
          color="primary"
          variant="subtle"
          @update:page="onPageChange"
        />
      </div>
    </UContainer>
  </div>
</template>
