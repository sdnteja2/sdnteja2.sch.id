<script setup lang="ts">
useSeoMeta({
  title: 'Pojok Baca & Buku Digital - SD Negeri Teja II',
  description:
    'Koleksi buku teks Kurikulum Merdeka, cerita fabel nusantara, ensiklopedia cilik, dan bacaan pengayaan literasi siswa SD Negeri Teja II.',
  ogTitle: 'Pojok Baca & Buku Digital - SD Negeri Teja II',
  ogDescription:
    'Koleksi buku teks Kurikulum Merdeka, cerita fabel nusantara, ensiklopedia cilik, dan bacaan pengayaan literasi siswa SD Negeri Teja II.',
  ogImage: '/cover/buku.png'
})

const searchQuery = ref('')
const selectedGenre = ref('Semua Kategori')

const genreOptions = [
  'Semua Kategori',
  'Buku Pelajaran',
  'Cerita Nusantara',
  'Sains Cilik',
  'Budi Pekerti'
]

const books = [
  {
    id: 1,
    title: 'Bahasa Indonesia: Aku Bisa! Kelas I',
    author: 'Kementerian Pendidikan Dasar dan Menengah',
    category: 'Buku Pelajaran',
    level: 'Kelas 1',
    pages: '124 Halaman',
    desc: 'Buku teks utama Kurikulum Merdeka mengenalkan huruf, kata bermakna, dan kalimat sederhana melalui gambar berwarna yang ramah anak.',
    icon: 'i-lucide-book-open',
    badge: 'Kurikulum Merdeka'
  },
  {
    id: 2,
    title: 'Kisah Kancil Cerdik dan Buaya yang Sabar',
    author: 'Cerita Rakyat Indonesia',
    category: 'Cerita Nusantara',
    level: 'Semua Kelas',
    pages: '36 Halaman',
    desc: 'Dongeng fabel sarat pesan moral tentang kecerdikan yang harus digunakan untuk kebaikan serta pentingnya menepati janji.',
    icon: 'i-lucide-sparkles',
    badge: 'Cerita Fabel'
  },
  {
    id: 3,
    title: 'IPAS: Menjelajahi Bumi dan Antariksa Kelas IV',
    author: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan',
    category: 'Buku Pelajaran',
    level: 'Kelas 4',
    pages: '168 Halaman',
    desc: 'Mengajak siswa memahami bentang alam, gaya dan gerak, serta keanekaragaman flora fauna di lingkungan sekitar tempat tinggal.',
    icon: 'i-lucide-globe',
    badge: 'Kurikulum Merdeka'
  },
  {
    id: 4,
    title: 'Keajaiban Tubuh Manusia: Mengenal Panca Indra',
    author: 'Tim Literasi Sains Anak',
    category: 'Sains Cilik',
    level: 'Kelas 2 - 4',
    pages: '48 Halaman',
    desc: 'Ensiklopedia bergambar yang menjelaskan bagaimana mata melihat, telinga mendengar, dan cara merawat kebersihan tubuh dengan benar.',
    icon: 'i-lucide-eye',
    badge: 'Ensiklopedia'
  },
  {
    id: 5,
    title: 'Kisah Sahabat Kecil yang Jujur dan Dermawan',
    author: 'Tim Pembina Budi Pekerti',
    category: 'Budi Pekerti',
    level: 'Semua Kelas',
    pages: '42 Halaman',
    desc: 'Kumpulan cerita pendek inspiratif tentang kebiasaan berkata jujur di sekolah, tolong menolong saat teman tertimpa musibah, dan adab sopan santun.',
    icon: 'i-lucide-heart',
    badge: 'Karakter'
  },
  {
    id: 6,
    title: 'Matematika: Belajar Berhitung Menyenangkan Kelas II',
    author: 'Kemendikbudristek RI',
    category: 'Buku Pelajaran',
    level: 'Kelas 2',
    pages: '142 Halaman',
    desc: 'Konsep bilangan cacah, penjumlahan berulang, pengukuran panjang dengan benda sekitar, dan pengenalan bangun datar sederhana.',
    icon: 'i-lucide-calculator',
    badge: 'Kurikulum Merdeka'
  }
]

const filteredBooks = computed(() => {
  return books.filter((b) => {
    const matchCat
      = selectedGenre.value === 'Semua Kategori'
        || b.category === selectedGenre.value
    const matchSearch
      = b.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        || b.author.toLowerCase().includes(searchQuery.value.toLowerCase())
        || b.desc.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchSearch
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
              Perpustakaan digital dan katalog literasi SD Negeri Teja II untuk mendukung gerakan gemar membaca guru dan peserta didik.
            </p>
          </div>

          <UBadge
            color="neutral"
            variant="subtle"
            size="md"
            class="self-start md:self-auto"
          >
            {{ books.length }} Judul Buku Pilihan
          </UBadge>
        </div>
      </div>

      <!-- Search & Dropdown Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari judul buku atau penulis..."
            size="md"
            class="w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted hidden sm:inline">Kategori Buku:</span>
          <USelect
            v-model="selectedGenre"
            :items="genreOptions"
            icon="i-lucide-filter"
            size="md"
            class="w-full sm:w-56"
          />
        </div>
      </div>

      <!-- Books Grid -->
      <div
        v-if="filteredBooks.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="book in filteredBooks"
          :key="book.id"
          class="group hover:border-primary/50 transition-all flex flex-col justify-between"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div class="size-11 rounded-xl bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <UIcon
                  :name="book.icon"
                  class="size-5 text-primary group-hover:text-white transition-colors"
                />
              </div>
              <UBadge
                color="neutral"
                variant="subtle"
                size="xs"
              >
                {{ book.badge }}
              </UBadge>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center gap-2 text-xs text-muted">
                <span>{{ book.level }}</span>
                <span>•</span>
                <span>{{ book.pages }}</span>
              </div>
              <h2 class="font-bold text-highlighted text-base group-hover:text-primary transition-colors leading-snug">
                {{ book.title }}
              </h2>
              <p class="text-xs text-muted">
                Penulis: {{ book.author }}
              </p>
              <p class="text-xs sm:text-sm text-muted leading-relaxed pt-1">
                {{ book.desc }}
              </p>
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-default flex items-center justify-between">
            <span class="text-xs text-muted">Tersedia di Perpustakaan</span>
            <UButton
              label="Baca Buku"
              size="xs"
              variant="subtle"
              color="neutral"
              trailing-icon="i-lucide-external-link"
            />
          </div>
        </UCard>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-16 space-y-3 rounded-2xl border border-dashed border-default p-8"
      >
        <UIcon
          name="i-lucide-book-x"
          class="size-10 text-muted mx-auto"
        />
        <p class="text-highlighted font-semibold text-lg">
          Buku Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada koleksi buku yang sesuai dengan pencarian atau kategori yang dipilih.
        </p>
        <UButton
          label="Reset Filter"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedGenre = 'Semua Kategori'"
        />
      </div>
    </UContainer>
  </div>
</template>
