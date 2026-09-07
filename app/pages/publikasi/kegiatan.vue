<script setup lang="ts">
useSeoMeta({
  title: 'Agenda & Dokumentasi Kegiatan - SD Negeri Teja II',
  description:
    'Rangkaian aktivitas kesiswaan, peringatan hari besar, pembiasaan karakter, dan dokumentasi agenda kegiatan SD Negeri Teja II.',
  ogTitle: 'Agenda & Dokumentasi Kegiatan - SD Negeri Teja II',
  ogDescription:
    'Rangkaian aktivitas kesiswaan, peringatan hari besar, pembiasaan karakter, dan dokumentasi agenda kegiatan SD Negeri Teja II.',
  ogImage: '/cover/tugas.png'
})

const searchQuery = ref('')
const selectedType = ref('Semua Kegiatan')

const typeOptions = [
  'Semua Kegiatan',
  'Rutin & Karakter',
  'Peringatan & Lomba',
  'Projek P5'
]

const activities = [
  {
    title: 'Gelar Karya & Pentas Seni Projek Penguatan Profil Pelajar Pancasila (P5)',
    type: 'Projek P5',
    date: 'Setiap Akhir Semester',
    location: 'Halaman Utama SDN Teja II',
    desc: 'Pameran kreasi kerajinan daur ulang siswa, olahan makanan tradisional khas Majalengka, dan penampilan tari kreasi Nusantara.',
    icon: 'i-lucide-palette',
    image: '/cover/tugas.png',
    status: 'Unggulan'
  },
  {
    title: 'Latihan Gabungan & Perkemahan Sabtu-Minggu (Persami) Pramuka',
    type: 'Peringatan & Lomba',
    date: 'Bulan Agustus & Oktober',
    location: 'Bumi Perkemahan / Area Sekolah',
    desc: 'Kegiatan kepanduan mengasah kemandirian, morse, tali-temali, api unggun ceria, dan penjelajahan alam sekitar Teja.',
    icon: 'i-lucide-tent',
    image: '/cover/siswa.png',
    status: 'Terlaksana'
  },
  {
    title: 'Pembiasaan Sholat Dhuha Berjamaah & Kultum Giliran Siswa',
    type: 'Rutin & Karakter',
    date: 'Setiap Selasa & Kamis Pagi',
    location: 'Musholla & Aula Sekolah',
    desc: 'Melatih keberanian berbicara di depan umum melalui penyampaian pesan moral dan kultum oleh perwakilan siswa kelas tinggi setelah sholat.',
    icon: 'i-lucide-heart-handshake',
    image: '/cover/sekolah.png',
    status: 'Rutin Mingguan'
  },
  {
    title: 'Peringatan Hari Kemerdekaan RI & Festival Permainan Tradisional',
    type: 'Peringatan & Lomba',
    date: '17 Agustus 2026',
    location: 'Lapangan Sekolah',
    desc: 'Upacara bendera khidmat dilanjutkan aneka perlombaan tradisional seperti bakiak, tarik tambang, balap karung, dan kuis wawasan kebangsaan.',
    icon: 'i-lucide-flag',
    image: '/cover/edu.png',
    status: 'Tahunan'
  },
  {
    title: 'Jumat Bersih, Senam Kesegaran Jasmani & Sarapan Bergizi Bersama',
    type: 'Rutin & Karakter',
    date: 'Setiap Jumat Pagi',
    location: 'Seluruh Lingkungan Sekolah',
    desc: 'Senam bersama guru dan murid, operasi kebersihan lingkungan kelas, serta sarapan sehat bersama dengan bekal bergizi dari rumah.',
    icon: 'i-lucide-smile',
    image: '/cover/guru.png',
    status: 'Rutin Mingguan'
  },
  {
    title: 'Gerakan Literasi Sekolah: Baca Buku Bersama di Bawah Pohon Rindang',
    type: 'Rutin & Karakter',
    date: 'Setiap Rabu Pagi',
    location: 'Taman Sekolah & Pojok Baca',
    desc: 'Membaca buku non-pelajaran di area terbuka taman sekolah dilanjutkan resume singkat buku yang dibaca ke dalam jurnal literasi masing-masing.',
    icon: 'i-lucide-book-open',
    image: '/cover/buku.png',
    status: 'Rutin Mingguan'
  }
]

const filteredActivities = computed(() => {
  return activities.filter((item) => {
    const matchType
      = selectedType.value === 'Semua Kegiatan'
        || item.type === selectedType.value
    const matchSearch
      = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.desc.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchType && matchSearch
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
          <span class="text-highlighted font-medium">Kegiatan</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Agenda & Dokumentasi Kegiatan
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Catatan aktivitas, kegiatan kurikuler dan ekstrakurikuler, pembiasaan karakter, serta momen kebersamaan di SD Negeri Teja II.
          </p>
        </div>
      </div>

      <!-- Search & Dropdown Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari nama kegiatan atau lokasi..."
            size="md"
            class="w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted hidden sm:inline">Jenis Kegiatan:</span>
          <USelect
            v-model="selectedType"
            :items="typeOptions"
            icon="i-lucide-filter"
            size="md"
            class="w-full sm:w-56"
          />
        </div>
      </div>

      <!-- Kegiatan Grid -->
      <div
        v-if="filteredActivities.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="item in filteredActivities"
          :key="item.title"
          class="group hover:border-primary/50 transition-all flex flex-col justify-between overflow-hidden"
          :ui="{ body: 'p-0 sm:p-0 flex flex-col h-full' }"
        >
          <div class="aspect-video w-full overflow-hidden bg-muted relative">
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute top-3 left-3">
              <UBadge
                color="neutral"
                variant="subtle"
                size="xs"
                class="backdrop-blur-sm bg-default/90 border border-default"
              >
                {{ item.status }}
              </UBadge>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2.5">
              <div class="flex items-center gap-2 text-xs text-muted">
                <UIcon
                  name="i-lucide-calendar"
                  class="size-3.5 text-primary shrink-0"
                />
                <span>{{ item.date }}</span>
              </div>

              <h2 class="font-bold text-highlighted text-base leading-snug group-hover:text-primary transition-colors">
                {{ item.title }}
              </h2>

              <p class="text-xs sm:text-sm text-muted leading-relaxed">
                {{ item.desc }}
              </p>
            </div>

            <div class="pt-3 border-t border-default flex items-center justify-between text-xs text-muted">
              <div class="flex items-center gap-1.5 truncate max-w-[200px]">
                <UIcon
                  name="i-lucide-map-pin"
                  class="size-3.5 text-muted shrink-0"
                />
                <span class="truncate">{{ item.location }}</span>
              </div>

              <UBadge
                color="neutral"
                variant="subtle"
                size="xs"
              >
                {{ item.type }}
              </UBadge>
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
          Kegiatan Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada kegiatan yang cocok dengan kata kunci atau kategori yang dipilih.
        </p>
        <UButton
          label="Reset Filter"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedType = 'Semua Kegiatan'"
        />
      </div>
    </UContainer>
  </div>
</template>
