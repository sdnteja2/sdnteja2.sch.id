<script setup lang="ts">
useSeoMeta({
  title: 'Data Siswa & Kesiswaan - SD Negeri Teja II',
  description:
    'Statistik peserta didik, rekapitulasi rombongan belajar, program pembiasaan karakter, dan kegiatan ekstrakurikuler SD Negeri Teja II.',
  ogTitle: 'Data Siswa & Kesiswaan - SD Negeri Teja II',
  ogDescription:
    'Statistik peserta didik, rekapitulasi rombongan belajar, program pembiasaan karakter, dan kegiatan ekstrakurikuler SD Negeri Teja II.',
  ogImage: '/cover/siswa.png'
})

const studentStats = [
  { rombel: 'Kelas I', male: 14, female: 13, total: 27, wali: 'Siti Aminah, S.Pd.SD' },
  { rombel: 'Kelas II', male: 15, female: 14, total: 29, wali: 'Dadan Ramdani, S.Pd.' },
  { rombel: 'Kelas III', male: 16, female: 12, total: 28, wali: 'Ai Nurhayati, S.Pd.' },
  { rombel: 'Kelas IV', male: 13, female: 15, total: 28, wali: 'Hendra Kurniawan, S.Pd.' },
  { rombel: 'Kelas V', male: 15, female: 16, total: 31, wali: 'Rina Marlina, S.Pd.SD' },
  { rombel: 'Kelas VI', male: 14, female: 15, total: 29, wali: 'Asep Saepudin, S.Pd.' }
]

const totalMale = computed(() => studentStats.reduce((acc, curr) => acc + curr.male, 0))
const totalFemale = computed(() => studentStats.reduce((acc, curr) => acc + curr.female, 0))
const grandTotal = computed(() => studentStats.reduce((acc, curr) => acc + curr.total, 0))

const characterHabits = [
  {
    title: 'Sholat Dhuha & Kultum Pagi',
    desc: 'Pembiasaan ibadah bersama di musholla sekolah untuk menumbuhkan ketakwaan dan adab islami.',
    icon: 'i-lucide-sun'
  },
  {
    title: 'Literasi 15 Menit',
    desc: 'Membaca buku cerita dan pengetahuan umum sebelum jam pelajaran pertama dimulai di kelas maupun pojok baca.',
    icon: 'i-lucide-book-open'
  },
  {
    title: 'Senam Kesegaran Jasmani',
    desc: 'Senam bersama setiap hari Jumat pagi untuk menjaga kebugaran, kesehatan, dan semangat belajar.',
    icon: 'i-lucide-activity'
  },
  {
    title: 'Operasi Semut (Kebersihan)',
    desc: 'Gerakan peduli lingkungan menjaga kebersihan kelas, selasar, dan halaman sekolah secara gotong royong.',
    icon: 'i-lucide-sparkles'
  }
]

const extracurriculars = [
  {
    name: 'Pramuka (Siaga & Penggalang)',
    schedule: 'Jumat Sore',
    desc: 'Membentuk kemandirian, kedisiplinan, kepemimpinan, dan kecintaan pada alam.',
    icon: 'i-lucide-compass'
  },
  {
    name: 'Seni Tari Sunda & Karawitan',
    schedule: 'Sabtu Pagi',
    desc: 'Melestarikan seni budaya daerah Jawa Barat serta menumbuhkan rasa percaya diri anak.',
    icon: 'i-lucide-music'
  },
  {
    name: 'Olahraga (Futsal & Voli)',
    schedule: 'Rabu Sore',
    desc: 'Melatih sportivitas, kerjasama tim, ketangkasan fisik, dan persiapan kompetisi O2SN.',
    icon: 'i-lucide-trophy'
  },
  {
    name: 'Dokter Kecil / PMR Mula',
    schedule: 'Kamis Sore',
    desc: 'Pendidikan pertolongan pertama, pola hidup bersih dan sehat (PHBS), serta peduli sesama.',
    icon: 'i-lucide-heart'
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
          <span class="text-highlighted font-medium">Siswa</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              Data Siswa & Kesiswaan
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              Rekapitulasi data peserta didik, program pembiasaan karakter profil pelajar Pancasila, dan wadah pengembangan minat bakat.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UBadge
              color="primary"
              variant="subtle"
              size="lg"
              class="font-mono text-sm"
            >
              Total: {{ grandTotal }} Siswa
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <UCard class="text-center">
          <p class="text-xs text-muted font-medium">
            Total Siswa
          </p>
          <p class="text-2xl sm:text-3xl font-bold text-highlighted mt-1">
            {{ grandTotal }}
          </p>
          <p class="text-[11px] text-muted mt-0.5">
            Tahun Ajaran Aktif
          </p>
        </UCard>
        <UCard class="text-center">
          <p class="text-xs text-muted font-medium">
            Siswa Laki-laki
          </p>
          <p class="text-2xl sm:text-3xl font-bold text-highlighted mt-1">
            {{ totalMale }}
          </p>
          <p class="text-[11px] text-muted mt-0.5">
            Peserta Didik Putra
          </p>
        </UCard>
        <UCard class="text-center">
          <p class="text-xs text-muted font-medium">
            Siswa Perempuan
          </p>
          <p class="text-2xl sm:text-3xl font-bold text-highlighted mt-1">
            {{ totalFemale }}
          </p>
          <p class="text-[11px] text-muted mt-0.5">
            Peserta Didik Putri
          </p>
        </UCard>
        <UCard class="text-center">
          <p class="text-xs text-muted font-medium">
            Rombongan Belajar
          </p>
          <p class="text-2xl sm:text-3xl font-bold text-highlighted mt-1">
            6
          </p>
          <p class="text-[11px] text-muted mt-0.5">
            Kelas I - VI
          </p>
        </UCard>
      </div>

      <!-- Table Card: Rekap Rombel -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-table"
                class="size-5 text-primary"
              />
              <h2 class="font-semibold text-highlighted text-lg">
                Rekapitulasi Siswa per Kelas
              </h2>
            </div>
            <span class="text-xs text-muted">Semester Berjalan</span>
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-default text-xs uppercase text-muted bg-muted/30">
              <tr>
                <th class="py-3 px-4">
                  Rombel
                </th>
                <th class="py-3 px-4">
                  Wali Kelas
                </th>
                <th class="py-3 px-4 text-center">
                  Laki-Laki
                </th>
                <th class="py-3 px-4 text-center">
                  Perempuan
                </th>
                <th class="py-3 px-4 text-center font-bold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr
                v-for="row in studentStats"
                :key="row.rombel"
                class="hover:bg-muted/20 transition-colors"
              >
                <td class="py-3 px-4 font-semibold text-highlighted">
                  {{ row.rombel }}
                </td>
                <td class="py-3 px-4 text-muted">
                  {{ row.wali }}
                </td>
                <td class="py-3 px-4 text-center font-mono">
                  {{ row.male }}
                </td>
                <td class="py-3 px-4 text-center font-mono">
                  {{ row.female }}
                </td>
                <td class="py-3 px-4 text-center font-mono font-bold text-highlighted">
                  {{ row.total }}
                </td>
              </tr>
              <!-- Summary row -->
              <tr class="font-bold bg-muted/40">
                <td
                  class="py-3 px-4 text-highlighted"
                  colspan="2"
                >
                  Jumlah Keseluruhan
                </td>
                <td class="py-3 px-4 text-center font-mono">
                  {{ totalMale }}
                </td>
                <td class="py-3 px-4 text-center font-mono">
                  {{ totalFemale }}
                </td>
                <td class="py-3 px-4 text-center font-mono text-primary text-base">
                  {{ grandTotal }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>

      <!-- Pembiasaan Karakter -->
      <div class="space-y-4">
        <div>
          <h2 class="text-2xl font-bold text-highlighted">
            Program Pembiasaan Karakter
          </h2>
          <p class="text-muted text-sm mt-1">
            Membangun generasi cerdas berakhlak mulia melalui kebiasaan positif setiap hari.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UCard
            v-for="habit in characterHabits"
            :key="habit.title"
          >
            <div class="space-y-2.5">
              <div class="size-10 rounded-lg bg-muted flex items-center justify-center">
                <UIcon
                  :name="habit.icon"
                  class="size-5 text-primary"
                />
              </div>
              <h3 class="font-semibold text-highlighted text-base">
                {{ habit.title }}
              </h3>
              <p class="text-xs sm:text-sm text-muted leading-relaxed">
                {{ habit.desc }}
              </p>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Ekstrakurikuler -->
      <div class="space-y-4">
        <div>
          <h2 class="text-2xl font-bold text-highlighted">
            Kegiatan Ekstrakurikuler
          </h2>
          <p class="text-muted text-sm mt-1">
            Wadah pengembangan minat, bakat, ketangkasan, dan kreativitas siswa di luar jam tatap muka.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UCard
            v-for="ekskul in extracurriculars"
            :key="ekskul.name"
            class="hover:border-primary/50 transition-colors"
          >
            <div class="flex items-start gap-3.5">
              <div class="p-3 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <UIcon
                  :name="ekskul.icon"
                  class="size-6 text-primary"
                />
              </div>
              <div class="space-y-1.5 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="font-bold text-highlighted text-base">
                    {{ ekskul.name }}
                  </h3>
                  <UBadge
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    {{ ekskul.schedule }}
                  </UBadge>
                </div>
                <p class="text-xs sm:text-sm text-muted leading-relaxed">
                  {{ ekskul.desc }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
