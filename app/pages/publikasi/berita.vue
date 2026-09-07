<script setup lang="ts">
useSeoMeta({
  title: 'Warta & Berita Sekolah - SD Negeri Teja II',
  description:
    'Kabar terkini seputar kegiatan, prestasi, pengumuman resmi, dan perkembangan pendidikan di SD Negeri Teja II Rajagaluh.',
  ogTitle: 'Warta & Berita Sekolah - SD Negeri Teja II',
  ogDescription:
    'Kabar terkini seputar kegiatan, prestasi, pengumuman resmi, dan perkembangan pendidikan di SD Negeri Teja II.'
})

const searchQuery = ref('')
const selectedCategory = ref('Semua Kategori')

const categoryOptions = [
  'Semua Kategori',
  'Akademik',
  'Kesiswaan',
  'Prestasi',
  'Sosial & Kesehatan'
]

const newsList = [
  {
    id: 1,
    title: 'Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK) Berjalan Tertib dan Lancar',
    excerpt:
      'Siswa kelas V SDN Teja II mengikuti rangkaian simulasi dan pelaksanaan ANBK dengan memanfaatkan perangkat komputer sekolah secara tertib didampingi proktor dan pengawas ruang.',
    date: '18 Agustus 2026',
    author: 'Humas SDN Teja II',
    category: 'Akademik',
    readTime: '3 menit'
  },
  {
    id: 2,
    title: 'Peringatan Hari Pramuka: Siswa Tampilkan Keterampilan Sandi dan Baris-Berbaris',
    excerpt:
      'Gugus Depan SDN Teja II menyelenggarakan upacara peringatan Hari Pramuka dilanjutkan atraksi ketangkasan semaphore, morse, dan yel-yel ceria di lapangan sekolah.',
    date: '14 Agustus 2026',
    author: 'Pembina Pramuka',
    category: 'Kesiswaan',
    readTime: '2 menit'
  },
  {
    id: 3,
    title: 'Siswa SDN Teja II Raih Prestasi pada Lomba Calistung dan Pidato Cilik Tingkat Kecamatan',
    excerpt:
      'Prestasi membanggakan kembali diraih perwakilan peserta didik kelas III dan V pada ajang pekan kompetisi literasi di tingkat Kecamatan Rajagaluh.',
    date: '02 Agustus 2026',
    author: 'Tim Kesiswaan',
    category: 'Prestasi',
    readTime: '3 menit'
  },
  {
    id: 4,
    title: 'Edukasi Pola Hidup Bersih dan Sehat (PHBS) bersama Petugas Puskesmas Rajagaluh',
    excerpt:
      'Penyuluhan cuci tangan pakai sabun, pemeriksaan berkala kesehatan gigi anak, serta pembiasaan gizi seimbang bagi seluruh siswa kelas I sampai kelas VI.',
    date: '25 Juli 2026',
    author: 'Tim UKS',
    category: 'Sosial & Kesehatan',
    readTime: '4 menit'
  },
  {
    id: 5,
    title: 'Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah Anak Sambut Siswa Baru Kelas I',
    excerpt:
      'Hari pertama sekolah diisi dengan kegiatan ceria, pengenalan guru kelas, doa bersama, dan pembagian buku cerita perdana untuk menumbuhkan rasa nyaman siswa baru.',
    date: '15 Juli 2026',
    author: 'Panitia MPLS',
    category: 'Kesiswaan',
    readTime: '3 menit'
  },
  {
    id: 6,
    title: 'Sosialisasi Kurikulum Merdeka dan Program Parenting Bersama Komite Sekolah',
    excerpt:
      'Pertemuan awal tahun ajaran bersama orang tua/wali murid membahas penguatan literasi numerasi di rumah dan sinergi pembinaan karakter profil pelajar Pancasila.',
    date: '08 Juli 2026',
    author: 'Kepala Sekolah',
    category: 'Akademik',
    readTime: '4 menit'
  }
]

const filteredNews = computed(() => {
  return newsList.filter((item) => {
    const matchCategory
      = selectedCategory.value === 'Semua Kategori'
        || item.category === selectedCategory.value
    const matchSearch
      = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
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
          <span class="text-highlighted font-medium">Berita</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Warta & Berita Sekolah
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Informasi resmi, agenda kegiatan, pengumuman kedinasan, dan warta terbaru seputar SD Negeri Teja II.
          </p>
        </div>
      </div>

      <!-- Search & Dropdown Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari judul atau kata kunci warta..."
            size="md"
            class="w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted hidden sm:inline">Kategori:</span>
          <USelect
            v-model="selectedCategory"
            :items="categoryOptions"
            icon="i-lucide-filter"
            size="md"
            class="w-full sm:w-52"
          />
        </div>
      </div>

      <!-- News Cards Grid (No Images - Text Focused) -->
      <div
        v-if="filteredNews.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <UCard
          v-for="item in filteredNews"
          :key="item.id"
          class="group hover:border-primary/50 transition-all flex flex-col justify-between"
        >
          <div class="space-y-3.5">
            <!-- Metadata & Category Badge -->
            <div class="flex items-center justify-between gap-2">
              <UBadge
                color="neutral"
                variant="subtle"
                size="xs"
              >
                {{ item.category }}
              </UBadge>

              <span class="text-[11px] text-muted">
                {{ item.readTime }} baca
              </span>
            </div>

            <!-- Title & Excerpt -->
            <div class="space-y-2">
              <h2 class="font-bold text-highlighted text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {{ item.title }}
              </h2>

              <p class="text-xs sm:text-sm text-muted leading-relaxed line-clamp-4">
                {{ item.excerpt }}
              </p>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="pt-4 mt-4 border-t border-default flex items-center justify-between text-xs text-muted">
            <div class="flex items-center gap-1.5 truncate">
              <UIcon
                name="i-lucide-calendar"
                class="size-3.5 text-muted shrink-0"
              />
              <span class="truncate">{{ item.date }}</span>
            </div>

            <span class="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
              Detail Warta
              <UIcon
                name="i-lucide-arrow-right"
                class="size-3.5"
              />
            </span>
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
          Berita Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada warta yang cocok dengan pencarian atau kategori yang dipilih.
        </p>
        <UButton
          label="Reset Filter"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedCategory = 'Semua Kategori'"
        />
      </div>
    </UContainer>
  </div>
</template>
