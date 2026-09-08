<script setup lang="ts">
interface StaffMember {
  name: string
  role: string
  category: string
  nip: string
  education: string
  subject: string
  avatar: string
  highlight?: boolean
  order?: number
}

const categoryOptions = [
  'Semua Kategori',
  'Kepala Sekolah',
  'Guru Kelas',
  'Guru Mapel',
  'Tenaga Kependidikan'
]

const defaultStaffList: StaffMember[] = [
  {
    name: 'Susi Susanti, S.Pd.I., M.Pd.',
    role: 'Kepala Sekolah',
    category: 'Kepala Sekolah',
    nip: '19790514 200801 2 006',
    education: 'S2 Magister Pendidikan',
    subject: 'Manajemen Pendidikan',
    avatar: 'i-lucide-user-check',
    highlight: true,
    order: 1
  },
  {
    name: 'Siti Aminah, S.Pd.SD',
    role: 'Guru Kelas I',
    category: 'Guru Kelas',
    nip: '19840312 201001 2 015',
    education: 'S1 PGSD',
    subject: 'Tematik & Literasi Awal',
    avatar: 'i-lucide-user',
    order: 2
  },
  {
    name: 'Dadan Ramdani, S.Pd.',
    role: 'Guru Kelas II',
    category: 'Guru Kelas',
    nip: '19860724 201402 1 003',
    education: 'S1 PGSD',
    subject: 'Tematik & Numerasi Dasar',
    avatar: 'i-lucide-user',
    order: 3
  },
  {
    name: 'Ai Nurhayati, S.Pd.',
    role: 'Guru Kelas III',
    category: 'Guru Kelas',
    nip: '19881115 201903 2 008',
    education: 'S1 PGSD',
    subject: 'Tematik & Karakter',
    avatar: 'i-lucide-user',
    order: 4
  },
  {
    name: 'Hendra Kurniawan, S.Pd.',
    role: 'Guru Kelas IV',
    category: 'Guru Kelas',
    nip: '19900218 202012 1 004',
    education: 'S1 PGSD',
    subject: 'IPAS & Matematika',
    avatar: 'i-lucide-user',
    order: 5
  },
  {
    name: 'Rina Marlina, S.Pd.SD',
    role: 'Guru Kelas V',
    category: 'Guru Kelas',
    nip: '19850909 201101 2 018',
    education: 'S1 PGSD',
    subject: 'IPAS & Bahasa Indonesia',
    avatar: 'i-lucide-user',
    order: 6
  },
  {
    name: 'Asep Saepudin, S.Pd.',
    role: 'Guru Kelas VI',
    category: 'Guru Kelas',
    nip: '19830419 200902 1 002',
    education: 'S1 PGSD',
    subject: 'Persiapan Kelulusan & Sains',
    avatar: 'i-lucide-user',
    order: 7
  },
  {
    name: 'Ujang Suherman, S.Pd.I.',
    role: 'Guru PAI & Budi Pekerti',
    category: 'Guru Mapel',
    nip: '19871201 201903 1 005',
    education: 'S1 Pendidikan Agama Islam',
    subject: 'Pendidikan Agama & Baca Tulis Al-Qur\'an',
    avatar: 'i-lucide-book-open',
    order: 8
  },
  {
    name: 'Agus Mulyana, S.Pd.',
    role: 'Guru PJOK',
    category: 'Guru Mapel',
    nip: '19910816 202221 1 007',
    education: 'S1 Pendidikan Jasmani',
    subject: 'Olahraga, Kebugaran & Ekstrakurikuler',
    avatar: 'i-lucide-trophy',
    order: 9
  },
  {
    name: 'M. Farhan, S.Kom.',
    role: 'Operator Dapodik & IT',
    category: 'Tenaga Kependidikan',
    nip: '-',
    education: 'S1 Sistem Informasi',
    subject: 'Pendataan, ANBK & Administrasi Digital',
    avatar: 'i-lucide-monitor',
    order: 10
  },
  {
    name: 'Yayu Yuliani, S.I.Pust.',
    role: 'Pengelola Perpustakaan',
    category: 'Tenaga Kependidikan',
    nip: '-',
    education: 'S1 Ilmu Perpustakaan',
    subject: 'Pengelolaan Buku & Pojok Literasi',
    avatar: 'i-lucide-library',
    order: 11
  },
  {
    name: 'Ade Kusnadi',
    role: 'Tenaga Kebersihan & Keamanan',
    category: 'Tenaga Kependidikan',
    nip: '-',
    education: 'SMA Sederajat',
    subject: 'Lingkungan Sekolah Bersih & Aman',
    avatar: 'i-lucide-shield-check',
    order: 12
  }
]

const { data: staffList } = await useAsyncData('page-data-guru-list', () =>
  queryCollection('guru').order('order', 'ASC').all()
)

const activeStaffList = computed<StaffMember[]>(() => {
  return staffList.value?.length ? staffList.value : defaultStaffList
})

useSeoMeta({
  title: 'Guru & Tenaga Kependidikan - SD Negeri Teja II',
  description:
    'Profil pendidik profesional dan staf tenaga kependidikan yang berdedikasi membimbing dan mendampingi siswa SD Negeri Teja II.',
  ogTitle: 'Guru & Tenaga Kependidikan - SD Negeri Teja II',
  ogDescription:
    'Profil pendidik profesional dan staf tenaga kependidikan yang berdedikasi membimbing dan mendampingi siswa SD Negeri Teja II.',
  ogImage: '/cover/guru.png'
})

const searchQuery = ref('')
const selectedCategory = ref('Semua Kategori')

const filteredStaff = computed(() => {
  return activeStaffList.value.filter((item) => {
    const matchCat
      = selectedCategory.value === 'Semua Kategori'
        || item.category === selectedCategory.value
    const matchSearch
      = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.role.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
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
          <NuxtLink
            to="/data"
            class="hover:text-highlighted transition-colors"
          >
            Data
          </NuxtLink>
          <span>/</span>
          <span class="text-highlighted font-medium">Guru & Tendik</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              Guru & Tenaga Kependidikan
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              Tenaga pendidik profesional dan staf pendukung yang berdedikasi mendidik, melayani, dan membina generasi berkarakter.
            </p>
          </div>

          <UBadge
            variant="subtle"
            color="neutral"
            size="md"
            class="self-start md:self-auto"
          >
            Total: {{ activeStaffList.length }} Pendidik & Staf
          </UBadge>
        </div>
      </div>

      <!-- Search & Dropdown Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari nama guru atau bidang tugas..."
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
            class="w-full sm:w-56"
          />
        </div>
      </div>

      <!-- Staff Grid -->
      <div
        v-if="filteredStaff.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <UCard
          v-for="staff in filteredStaff"
          :key="staff.name"
          :class="[
            'transition-all hover:border-primary/50 relative overflow-hidden',
            staff.highlight ? 'border-primary/60 ring-1 ring-primary/20' : ''
          ]"
        >
          <div class="space-y-4">
            <div class="flex items-start gap-3.5">
              <div
                class="size-12 rounded-xl flex items-center justify-center shrink-0"
                :class="staff.highlight ? 'bg-primary text-white' : 'bg-muted text-primary'"
              >
                <UIcon
                  :name="staff.avatar"
                  class="size-6"
                />
              </div>

              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-primary uppercase tracking-wider">
                    {{ staff.role }}
                  </span>
                  <UBadge
                    v-if="staff.highlight"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    Pimpinan
                  </UBadge>
                </div>
                <h3 class="font-bold text-highlighted text-base leading-tight">
                  {{ staff.name }}
                </h3>
              </div>
            </div>

            <div class="pt-3 border-t border-default space-y-1.5 text-xs text-muted">
              <div class="flex items-center justify-between">
                <span>Pendidikan:</span>
                <span class="font-medium text-highlighted">{{ staff.education }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Fokus Tugas:</span>
                <span class="font-medium text-highlighted truncate max-w-[180px]">{{ staff.subject }}</span>
              </div>
              <div
                v-if="staff.nip !== '-'"
                class="flex items-center justify-between"
              >
                <span>NIP:</span>
                <span class="font-mono text-muted">{{ staff.nip }}</span>
              </div>
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
          name="i-lucide-user-x"
          class="size-10 text-muted mx-auto"
        />
        <p class="text-highlighted font-semibold text-lg">
          Data Guru Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada data pendidik yang cocok dengan kata kunci atau kategori yang dipilih.
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
