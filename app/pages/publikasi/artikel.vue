<script setup lang="ts">
useSeoMeta({
  title: 'Artikel & Opini Edukasi - SD Negeri Teja II',
  description:
    'Kumpulan gagasan, artikel edukatif, praktik baik pembelajaran, dan refleksi pedagogis dari para pendidik SD Negeri Teja II.',
  ogTitle: 'Artikel & Opini Edukasi - SD Negeri Teja II',
  ogDescription:
    'Kumpulan gagasan, artikel edukatif, praktik baik pembelajaran, dan refleksi pedagogis dari para pendidik SD Negeri Teja II.',
  ogImage: '/cover/edu.png'
})

const searchQuery = ref('')
const selectedTopic = ref('Semua Topik')

const topicOptions = [
  'Semua Topik',
  'Literasi & Membaca',
  'Parenting & Karakter',
  'Kurikulum Merdeka',
  'Metode Belajar'
]

const articles = [
  {
    id: 1,
    title: 'Membangun Budaya Gemar Membaca Sejak Dini di Lingkungan Sekolah dan Rumah',
    author: 'Susi Susanti, S.Pd.I., M.Pd.',
    role: 'Kepala Sekolah',
    date: '10 Agustus 2026',
    readTime: '5 menit',
    topic: 'Literasi & Membaca',
    tag: 'Literasi Sekolah',
    summary:
      'Membiasakan anak membaca 15 menit setiap hari terbukti melipatgandakan kosa kata, daya imajinasi, dan kemampuan pemecahan masalah sejak usia dasar.',
    image: '/cover/buku.png'
  },
  {
    id: 2,
    title: 'Mendampingi Anak Belajar di Era Gadget: Bijak Tanpa Melarang Sepenuhnya',
    author: 'Ai Nurhayati, S.Pd.',
    role: 'Guru Kelas III',
    date: '03 Agustus 2026',
    readTime: '4 menit',
    topic: 'Parenting & Karakter',
    tag: 'Pola Asuh Digital',
    summary:
      'Panduan praktis bagi orang tua dalam membuat jadwal layar yang sehat dan memanfaatkan aplikasi edukatif secara terarah dan proporsional.',
    image: '/cover/ide.png'
  },
  {
    id: 3,
    title: 'Pembelajaran Kontekstual: Mengajak Siswa Meneliti Alam dan Kebun Desa Teja',
    author: 'Hendra Kurniawan, S.Pd.',
    role: 'Guru Kelas IV',
    date: '28 Juli 2026',
    readTime: '6 menit',
    topic: 'Kurikulum Merdeka',
    tag: 'Sains Alam Terbuka',
    summary:
      'Memanfaatkan kekayaan bentang alam pedesaan Teja sebagai laboratorium belajar terbuka. Siswa mengamati daur hidup tumbuhan secara langsung.',
    image: '/cover/edu.png'
  },
  {
    id: 4,
    title: 'Menumbuhkan Sikap Disiplin dan Gotong Royong Melalui Kegiatan Kepramukaan',
    author: 'Agus Mulyana, S.Pd.',
    role: 'Guru PJOK & Pembina Pramuka',
    date: '20 Juli 2026',
    readTime: '4 menit',
    topic: 'Parenting & Karakter',
    tag: 'Pendidikan Karakter',
    summary:
      'Gerakan Pramuka mengajarkan tanggung jawab pribadi, kepemimpinan regu, dan ketahanan mental melalui metode bermain sambil belajar yang menyenangkan.',
    image: '/cover/siswa.png'
  },
  {
    id: 5,
    title: 'Matematika Menyenangkan: Mengubah Momok Menjadi Permainan Logika Kreatif',
    author: 'Dadan Ramdani, S.Pd.',
    role: 'Guru Kelas II',
    date: '12 Juli 2026',
    readTime: '5 menit',
    topic: 'Metode Belajar',
    tag: 'Numerasi Ceria',
    summary:
      'Pemanfaatan media konkret dan permainan papan hitung sederhana dalam konsep bilangan cacah agar siswa kelas awal belajar dengan gembira.',
    image: '/cover/tugas.png'
  },
  {
    id: 6,
    title: 'Mengoptimalkan Potensi Kreativitas Siswa Melalui Gelar Karya P5',
    author: 'Asep Saepudin, S.Pd.',
    role: 'Guru Kelas VI',
    date: '01 Juli 2026',
    readTime: '4 menit',
    topic: 'Kurikulum Merdeka',
    tag: 'Projek P5',
    summary:
      'Refleksi pelaksanaan projek penguatan profil pelajar Pancasila dalam menumbuhkan kemandirian dan kolaborasi antarpeserta didik.',
    image: '/cover/sekolah.png'
  }
]

const filteredArticles = computed(() => {
  return articles.filter((item) => {
    const matchTopic
      = selectedTopic.value === 'Semua Topik'
        || item.topic === selectedTopic.value
    const matchSearch
      = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchTopic && matchSearch
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
          <span class="text-muted">Publikasi</span>
          <span>/</span>
          <span class="text-highlighted font-medium">Artikel</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Artikel & Opini Edukasi
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Gagasan pedagogis, praktik baik pembelajaran, literasi anak, dan tulisan reflektif dari dewan guru SD Negeri Teja II.
          </p>
        </div>
      </div>

      <!-- Search & Dropdown Filter Bar -->
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
            v-model="selectedTopic"
            :items="topicOptions"
            icon="i-lucide-filter"
            size="md"
            class="w-full sm:w-56"
          />
        </div>
      </div>

      <!-- Articles Grid with Thumbnails -->
      <div
        v-if="filteredArticles.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="article in filteredArticles"
          :key="article.id"
          class="group hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden"
          :ui="{ body: 'p-0 sm:p-0 flex flex-col h-full' }"
        >
          <!-- Thumbnail Image -->
          <div class="aspect-video w-full overflow-hidden bg-muted relative">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute top-3 left-3">
              <UBadge
                color="neutral"
                variant="subtle"
                size="xs"
                class="backdrop-blur-sm bg-default/90 border border-default"
              >
                {{ article.tag }}
              </UBadge>
            </div>
          </div>

          <!-- Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2.5">
              <div class="flex items-center gap-2 text-xs text-muted">
                <span>{{ article.date }}</span>
                <span>•</span>
                <span>{{ article.readTime }} baca</span>
              </div>

              <h2 class="font-bold text-highlighted text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {{ article.title }}
              </h2>

              <p class="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                {{ article.summary }}
              </p>
            </div>

            <!-- Author & Read CTA -->
            <div class="pt-4 border-t border-default flex items-center justify-between">
              <div class="space-y-0.5 min-w-0 pr-2">
                <p class="text-xs font-semibold text-highlighted truncate">
                  {{ article.author }}
                </p>
                <p class="text-[11px] text-muted truncate">
                  {{ article.role }}
                </p>
              </div>

              <span class="text-primary text-xs font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                Baca Artikel
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-3.5"
                />
              </span>
            </div>
          </div>
        </UCard>
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
          Tidak ada artikel yang sesuai dengan pencarian atau topik yang dipilih.
        </p>
        <UButton
          label="Reset Filter"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedTopic = 'Semua Topik'"
        />
      </div>
    </UContainer>
  </div>
</template>
