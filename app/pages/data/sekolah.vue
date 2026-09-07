<script setup lang="ts">
useSeoMeta({
  title: 'Data Sekolah - SD Negeri Teja II',
  description:
    'Profil lengkap, identitas resmi, akreditasi, sarana prasarana, dan data operasional SD Negeri Teja II Rajagaluh Majalengka.',
  ogTitle: 'Data Sekolah - SD Negeri Teja II',
  ogDescription:
    'Profil lengkap, identitas resmi, akreditasi, sarana prasarana, dan data operasional SD Negeri Teja II.',
  ogImage: '/cover/sekolah.png'
})

const schoolIdentity = [
  { label: 'Nama Sekolah', value: 'SD Negeri Teja II' },
  { label: 'NPSN', value: '20246347' },
  { label: 'Bentuk Pendidikan', value: 'Sekolah Dasar (SD)' },
  { label: 'Status Sekolah', value: 'Negeri' },
  { label: 'Status Kepemilikan', value: 'Pemerintah Daerah' },
  { label: 'SK Pendirian Sekolah', value: 'Nomor 421.2/Kep.17-Disdik/2004' },
  { label: 'Kurikulum', value: 'Kurikulum Merdeka' },
  { label: 'Akreditasi', value: 'B (Baik)' },
  { label: 'Kepala Sekolah', value: 'Susi Susanti, S.Pd.I., M.Pd.' },
  { label: 'Operator Sekolah', value: 'Tim Pendataan SDN Teja II' }
]

const addressInfo = [
  { label: 'Alamat', value: 'Jl. Desa Teja' },
  { label: 'Desa / Kelurahan', value: 'Teja' },
  { label: 'Kecamatan', value: 'Kec. Rajagaluh' },
  { label: 'Kabupaten', value: 'Kab. Majalengka' },
  { label: 'Provinsi', value: 'Jawa Barat' },
  { label: 'Kode Pos', value: '45472' },
  { label: 'Email Resmi', value: 'sdnteja2@gmail.com' }
]

const facilitiesData = [
  {
    name: 'Ruang Kelas Reguler',
    count: '6 Ruang',
    desc: 'Ruang belajar nyaman untuk Kelas 1 hingga Kelas 6 berfentilasi baik.',
    icon: 'i-lucide-layout-grid'
  },
  {
    name: 'Perpustakaan & Pojok Baca',
    count: '1 Ruang',
    desc: 'Koleksi buku teks Kurikulum Merdeka, ensiklopedia anak, dan cerita bergambar.',
    icon: 'i-lucide-book-open'
  },
  {
    name: 'Lapangan Olahraga & Upacara',
    count: '1 Area',
    desc: 'Area serbaguna untuk upacara bendera, senam jumat, futsal, dan voli.',
    icon: 'i-lucide-trophy'
  },
  {
    name: 'Laboratorium Komputer',
    count: '1 Ruang',
    desc: 'Perangkat Chromebook dan komputer untuk simulasi ANBK dan literasi digital.',
    icon: 'i-lucide-monitor'
  },
  {
    name: 'Ruang UKS',
    count: '1 Ruang',
    desc: 'Peralatan pertolongan pertama, tempat istirahat dan pengukuran berkala.',
    icon: 'i-lucide-heart-pulse'
  },
  {
    name: 'Sanitasi & Toilet Siswa',
    count: '4 Unit',
    desc: 'Toilet bersih terpisah untuk putra dan putri dengan akses air bersih mengalir.',
    icon: 'i-lucide-sparkles'
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
          <span class="text-muted">Data</span>
          <span>/</span>
          <span class="text-highlighted font-medium">Sekolah</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              Data Sekolah
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              Identitas resmi, legalitas, akreditasi, dan kondisi sarana prasarana penunjang kegiatan belajar mengajar SD Negeri Teja II.
            </p>
          </div>

          <UBadge
            color="primary"
            variant="subtle"
            size="lg"
            class="self-start md:self-auto font-mono text-sm"
          >
            NPSN: 20246347
          </UBadge>
        </div>
      </div>

      <!-- Identity and Address Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main Identity Table Card -->
        <UCard class="lg:col-span-7">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-school"
                class="size-5 text-primary"
              />
              <h2 class="font-semibold text-highlighted text-lg">
                Identitas Lembaga
              </h2>
            </div>
          </template>

          <dl class="divide-y divide-default text-sm">
            <div
              v-for="item in schoolIdentity"
              :key="item.label"
              class="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4"
            >
              <dt class="font-medium text-muted">
                {{ item.label }}
              </dt>
              <dd class="mt-1 sm:mt-0 sm:col-span-2 text-highlighted font-semibold">
                {{ item.value }}
              </dd>
            </div>
          </dl>
        </UCard>

        <!-- Location & Contact Card -->
        <div class="lg:col-span-5 space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-map-pin"
                  class="size-5 text-primary"
                />
                <h2 class="font-semibold text-highlighted text-lg">
                  Lokasi & Kontak
                </h2>
              </div>
            </template>

            <dl class="divide-y divide-default text-sm">
              <div
                v-for="item in addressInfo"
                :key="item.label"
                class="py-2.5 sm:grid sm:grid-cols-3 sm:gap-2"
              >
                <dt class="font-medium text-muted">
                  {{ item.label }}
                </dt>
                <dd class="mt-1 sm:mt-0 sm:col-span-2 text-highlighted">
                  {{ item.value }}
                </dd>
              </div>
            </dl>
          </UCard>

          <UCard class="bg-muted/40 border-dashed">
            <div class="flex items-start gap-3">
              <UIcon
                name="i-lucide-info"
                class="size-5 text-primary shrink-0 mt-0.5"
              />
              <div class="text-xs sm:text-sm text-muted space-y-1">
                <p class="font-medium text-highlighted">
                  Verifikasi Data Resmi
                </p>
                <p>
                  Data ini tersinkronisasi dengan Data Pokok Pendidikan (Dapodik) Kementerian Pendidikan Dasar dan Menengah RI.
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Facilities Section -->
      <div class="space-y-4">
        <div>
          <h2 class="text-2xl font-bold text-highlighted">
            Sarana & Prasarana
          </h2>
          <p class="text-muted text-sm mt-1">
            Fasilitas pendukung pembelajaran yang tersedia untuk menciptakan lingkungan belajar yang aman dan menyenangkan.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="fac in facilitiesData"
            :key="fac.name"
            class="hover:border-primary/50 transition-colors"
          >
            <div class="flex items-start gap-3.5">
              <div class="p-2.5 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <UIcon
                  :name="fac.icon"
                  class="size-5 text-primary"
                />
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="font-semibold text-highlighted text-sm sm:text-base">
                    {{ fac.name }}
                  </h3>
                  <UBadge
                    variant="subtle"
                    color="neutral"
                    size="xs"
                  >
                    {{ fac.count }}
                  </UBadge>
                </div>
                <p class="text-xs sm:text-sm text-muted leading-relaxed">
                  {{ fac.desc }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
