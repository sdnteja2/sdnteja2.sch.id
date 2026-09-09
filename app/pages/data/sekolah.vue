<script setup lang="ts">
interface FacilityItem {
  name: string
  category: string
  description: string
  features: string[]
  icon: string
}

const defaultIdentity = [
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

const defaultAddress = [
  { label: 'Alamat', value: 'Jl. Desa Teja' },
  { label: 'Desa / Kelurahan', value: 'Teja' },
  { label: 'Kecamatan', value: 'Kec. Rajagaluh' },
  { label: 'Kabupaten', value: 'Kab. Majalengka' },
  { label: 'Provinsi', value: 'Jawa Barat' },
  { label: 'Kode Pos', value: '45472' },
  { label: 'Email Resmi', value: 'sdnteja2@gmail.com' }
]

const defaultFacilities: FacilityItem[] = [
  {
    name: 'Ruang Kelas Nyaman',
    category: 'Akademik',
    description: 'Ruang belajar yang bersih, berpencahayaan alami, dan dilengkapi sarana pembelajaran interaktif.',
    features: ['Meja & kursi ramah anak', 'Ventilasi udara segar', 'Media pembelajaran aktif'],
    icon: 'i-lucide-book-open'
  },
  {
    name: 'Perpustakaan Sekolah',
    category: 'Literasi',
    description: 'Koleksi buku pengetahuan, cerita rakyat, dan pojok baca yang mendorong kecintaan literasi siswa.',
    features: ['Ratusan judul buku', 'Area baca tenang', 'Peminjaman buku teratur'],
    icon: 'i-lucide-library'
  },
  {
    name: 'Laboratorium Komputer',
    category: 'Teknologi',
    description: 'Sarana pengenalan teknologi informasi dan literasi digital sejak dini bagi seluruh peserta didik.',
    features: ['Perangkat komputer siap pakai', 'Bimbingan guru TIK', 'Simulasi asesmen digital'],
    icon: 'i-lucide-monitor'
  },
  {
    name: 'Unit Kesehatan Sekolah (UKS)',
    category: 'Kesehatan',
    description: 'Layanan pertolongan pertama dan pemeliharaan kesehatan siswa yang siap siaga dan higienis.',
    features: ['Tempat tidur periksa', 'Kotak P3K lengkap', 'Pemeriksaan berkala'],
    icon: 'i-lucide-heart-pulse'
  },
  {
    name: 'Lapangan Olahraga',
    category: 'Aktivitas Luar',
    description: 'Sarana serbaguna untuk upacara bendera, senam kebugaran, futsal, dan kegiatan pramuka.',
    features: ['Upacara bendera rutin', 'Olahraga jasmani', 'Latihan pramuka terpadu'],
    icon: 'i-lucide-trophy'
  },
  {
    name: 'Taman Sekolah & Area Hijau',
    category: 'Lingkungan',
    description: 'Lingkungan terbuka yang asri dan sejuk untuk melatih kepedulian siswa terhadap pelestarian alam.',
    features: ['Tanaman bunga & peneduh', 'Tempat istirahat nyaman', 'Edukasi peduli sampah'],
    icon: 'i-lucide-trees'
  }
]

const { data: page } = await useAsyncData('page-data-sekolah', () =>
  queryCollection('sekolah').first()
)

const { data: facilitiesDoc } = await useAsyncData('page-data-facilities', () =>
  queryCollection('facilities').first()
)

useSeoMeta({
  title: `${page.value?.title || 'Data Sekolah'} - SD Negeri Teja II`,
  description:
    page.value?.description
    || 'Profil lengkap, identitas resmi, akreditasi, sarana prasarana, dan data operasional SD Negeri Teja II Rajagaluh Majalengka.',
  ogTitle: `${page.value?.title || 'Data Sekolah'} - SD Negeri Teja II`,
  ogDescription:
    page.value?.description
    || 'Profil lengkap, identitas resmi, akreditasi, sarana prasarana, dan data operasional SD Negeri Teja II.'
})

defineOgImage('OgImage', {
  page: 'Data Sekolah',
  title: page.value?.title || 'Profil & Data Sekolah',
  description: page.value?.description || 'Profil lengkap, identitas resmi, akreditasi, dan sarana prasarana SD Negeri Teja II.'
})
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
          <NuxtLink
            to="/data"
            class="hover:text-highlighted transition-colors"
          >
            Data
          </NuxtLink>
          <span>/</span>
          <span class="text-highlighted font-medium">Sekolah</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              {{ page?.title || 'Data Sekolah' }}
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              {{ page?.description || 'Identitas resmi, legalitas, akreditasi, dan kondisi sarana prasarana penunjang kegiatan belajar mengajar SD Negeri Teja II.' }}
            </p>
          </div>

          <UBadge
            color="primary"
            variant="subtle"
            size="lg"
            class="self-start md:self-auto font-mono text-sm"
          >
            NPSN: {{ page?.npsn || '20246347' }}
          </UBadge>
        </div>
      </div>

      <!-- Identity and Address Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
              v-for="item in (page?.identity?.length ? page.identity : defaultIdentity)"
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

        <!-- Location, Map & Notice Column -->
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
                v-for="item in (page?.address?.length ? page.address : defaultAddress)"
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
                  {{ page?.verification_notice?.title || 'Verifikasi Data Resmi' }}
                </p>
                <p>
                  {{ page?.verification_notice?.description || 'Data ini tersinkronisasi dengan Data Pokok Pendidikan (Dapodik) Kementerian Pendidikan Dasar dan Menengah RI.' }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Facilities Section (Data dari content/facilities.yml tanpa foto) -->
      <div class="space-y-4">
        <div>
          <h2 class="text-2xl font-bold text-highlighted">
            Sarana & Prasarana
          </h2>
          <p class="text-muted text-sm mt-1">
            Fasilitas pendukung pembelajaran yang tersedia untuk menciptakan lingkungan belajar yang aman dan menyenangkan.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <UCard
            v-for="fac in (facilitiesDoc?.items?.length ? facilitiesDoc.items : defaultFacilities)"
            :key="fac.name"
            class="hover:border-primary/50 transition-colors flex flex-col justify-between"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2">
                <div class="size-10 rounded-xl bg-muted border border-default flex items-center justify-center text-primary shrink-0">
                  <UIcon
                    :name="fac.icon"
                    class="size-5"
                  />
                </div>
                <UBadge
                  variant="subtle"
                  color="neutral"
                  size="xs"
                >
                  {{ fac.category }}
                </UBadge>
              </div>

              <div class="space-y-1">
                <h3 class="font-bold text-highlighted text-base">
                  {{ fac.name }}
                </h3>
                <p class="text-xs text-muted leading-relaxed">
                  {{ fac.description }}
                </p>
              </div>

              <div
                v-if="fac.features?.length"
                class="pt-3 border-t border-default space-y-1.5"
              >
                <div
                  v-for="(feature, fIdx) in fac.features"
                  :key="fIdx"
                  class="flex items-center gap-2 text-xs text-muted"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="size-3.5 text-primary shrink-0"
                  />
                  <span class="truncate">{{ feature }}</span>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
