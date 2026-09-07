<script setup lang="ts">
useSeoMeta({
  title: 'Galeri Video Pembelajaran - SD Negeri Teja II',
  description:
    'Kumpulan video profil sekolah, materi pembelajaran interaktif, dokumentasi kegiatan pentas seni, dan senam siswa SD Negeri Teja II.',
  ogTitle: 'Galeri Video Pembelajaran - SD Negeri Teja II',
  ogDescription:
    'Kumpulan video profil sekolah, materi pembelajaran interaktif, dokumentasi pentas seni, dan senam siswa SD Negeri Teja II.',
  ogImage: '/cover/sekolah.png'
})

const videos = [
  {
    id: 1,
    title: 'Profil Resmi SD Negeri Teja II Rajagaluh Majalengka',
    category: 'Profil Sekolah',
    duration: '04:25',
    desc: 'Mengenal lebih dekat lingkungan sekolah ramah anak, sarana prasarana, visi misi, serta semangat guru dan siswa SDN Teja II.',
    thumbnail: '/cover/sekolah.png',
    date: 'Tahun 2026',
    views: '1.2 rb penonton'
  },
  {
    id: 2,
    title: 'Dokumentasi Pentas Seni & Gelar Karya P5 Siswa Kelas I - VI',
    category: 'Pentas Seni',
    duration: '07:18',
    desc: 'Penampilan tari daerah khas Jawa Barat, paduan suara lagu wajib nasional, dan pameran hasil karya projek penguatan profil pelajar Pancasila.',
    thumbnail: '/cover/tugas.png',
    date: 'Juni 2026',
    views: '850 penonton'
  },
  {
    id: 3,
    title: 'Senam Bersama Profil Pelajar Pancasila & Senam Anak Sehat',
    category: 'Kebugaran',
    duration: '03:45',
    desc: 'Keseruan siswa dan dewan guru melaksanakan senam pagi bersama di halaman sekolah setiap Jumat pagi untuk menjaga kebugaran jasmani.',
    thumbnail: '/cover/siswa.png',
    date: 'Mei 2026',
    views: '670 penonton'
  },
  {
    id: 4,
    title: 'Praktik Baik Guru: Mengenalkan Sains Menyenangkan Melalui Eksperimen Air',
    category: 'Pembelajaran',
    duration: '05:50',
    desc: 'Simulasi pembelajaran IPAS kelas IV membuktikan sifat-sifat zat cair menggunakan alat peraga sederhana di kelas.',
    thumbnail: '/cover/edu.png',
    date: 'April 2026',
    views: '540 penonton'
  },
  {
    id: 5,
    title: 'Atraksi Semaphore & Yel-Yel Regu Pramuka Penggalang SDN Teja II',
    category: 'Pramuka',
    duration: '04:10',
    desc: 'Ketangkasan regu pramuka SDN Teja II dalam menampilkan formasi baris-berbaris dan pengiriman sandi semaphore cepat.',
    thumbnail: '/cover/guru.png',
    date: 'Maret 2026',
    views: '920 penonton'
  },
  {
    id: 6,
    title: 'Pembiasaan Sholat Dhuha Berjamaah & Kultum Akhlak Mulia',
    category: 'Keagamaan',
    duration: '03:30',
    desc: 'Momen khusyuk ibadah pagi bersama dan latihan berpidato menyampaikan nilai kejujuran oleh perwakilan murid.',
    thumbnail: '/cover/ide.png',
    date: 'Februari 2026',
    views: '780 penonton'
  }
]
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="space-y-10">
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

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Galeri Video & Dokumentasi
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Kanal tayangan video profil, rekaman pentas kreasi, video pembelajaran interaktif, dan dokumentasi aktivitas siswa SD Negeri Teja II.
          </p>
        </div>
      </div>

      <!-- Videos Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="video in videos"
          :key="video.id"
          class="group hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
          :ui="{ body: 'p-0 sm:p-0 flex flex-col h-full' }"
        >
          <!-- Video Thumbnail with Play Button Overlay -->
          <div class="aspect-video w-full overflow-hidden bg-muted relative">
            <img
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div class="size-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <UIcon
                  name="i-lucide-play"
                  class="size-5 ms-0.5"
                />
              </div>
            </div>

            <div class="absolute bottom-2.5 right-2.5">
              <span class="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-black/75 text-white">
                {{ video.duration }}
              </span>
            </div>

            <div class="absolute top-2.5 left-2.5">
              <UBadge
                color="primary"
                variant="solid"
                size="xs"
              >
                {{ video.category }}
              </UBadge>
            </div>
          </div>

          <!-- Info -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2 text-xs text-muted">
                <span>{{ video.date }}</span>
                <span>•</span>
                <span>{{ video.views }}</span>
              </div>

              <h2 class="font-bold text-highlighted text-base leading-snug group-hover:text-primary transition-colors">
                {{ video.title }}
              </h2>

              <p class="text-xs sm:text-sm text-muted leading-relaxed">
                {{ video.desc }}
              </p>
            </div>

            <div class="pt-3 border-t border-default flex items-center justify-between text-xs text-primary font-medium">
              <span>Tonton Video</span>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
