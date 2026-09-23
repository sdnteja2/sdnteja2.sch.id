<script setup lang="ts">
interface BosPhase {
  phase: string
  period: string
  percentage: string
  amount: number
  status: string
  date: string
}

interface BosAllocation {
  component: string
  category: string
  amount: number
  percentage: number
  description: string
  icon: string
}

interface BosPrinciple {
  title: string
  desc: string
  icon: string
}

interface BosData {
  title: string
  description: string
  fiscal_year: string
  student_count: number
  unit_cost: number
  total_budget: number
  rekening: {
    bank: string
    branch: string
    account_number: string
    account_name: string
  }
  phases: BosPhase[]
  allocations: BosAllocation[]
  principles: BosPrinciple[]
}

const defaultBosData: BosData = {
  title: 'Transparansi Anggaran Dana BOS',
  description:
    'Laporan rencana dan realisasi Bantuan Operasional Satuan Pendidikan (BOSP) Reguler SD Negeri Teja II untuk keterbukaan informasi dan akuntabilitas pendidikan.',
  fiscal_year: 'Tahun Ajaran 2025/2026',
  student_count: 109,
  unit_cost: 940000,
  total_budget: 102460000,
  rekening: {
    bank: 'BPD Jabar Banten (Bank BJB)',
    branch: 'KCP / Cabang Rajagaluh',
    account_number: '0007064675101',
    account_name: 'SDN TEJA II'
  },
  phases: [
    {
      phase: 'Penyaluran Tahap I',
      period: 'Januari - Juni 2025',
      percentage: '50%',
      amount: 51230000,
      status: 'Terealisasi',
      date: '24 Maret 2025'
    },
    {
      phase: 'Penyaluran Tahap II',
      period: 'Juli - Desember 2025',
      percentage: '50%',
      amount: 51230000,
      status: 'Berjalan',
      date: '18 Agustus 2025'
    }
  ],
  allocations: [
    {
      component: 'Kegiatan Pembelajaran & Ekstrakurikuler',
      category: 'Kurikulum & Kesiswaan',
      amount: 22500000,
      percentage: 22.0,
      description: 'Pengadaan bahan pembelajaran Kurikulum Merdeka, perlengkapan belajar tematik, kegiatan pramuka, seni tari, dan olahraga.',
      icon: 'i-lucide-book-open'
    },
    {
      component: 'Pemeliharaan Sarana & Prasarana',
      category: 'Sarpras & Lingkungan',
      amount: 18200000,
      percentage: 17.8,
      description: 'Pengecatan ruang kelas, perbaikan sanitasi/toilet, perbaikan pintu jendela, dan perawatan berkala gedung sekolah.',
      icon: 'i-lucide-wrench'
    },
    {
      component: 'Pengembangan Perpustakaan & Literasi',
      category: 'Literasi Sekolah',
      amount: 15400000,
      percentage: 15.0,
      description: 'Pengadaan buku teks utama kurikulum merdeka, buku pengayaan pojok baca, dan pemeliharaan koleksi perpustakaan.',
      icon: 'i-lucide-library'
    },
    {
      component: 'Administrasi Kegiatan Persekolahan',
      category: 'Operasional Satuan Pendidikan',
      amount: 14360000,
      percentage: 14.0,
      description: 'Kebutuhan ATK kantor & guru, langganan daya dan jasa (listrik, internet sekolah), dan surat-menyurat resmi.',
      icon: 'i-lucide-clipboard-list'
    },
    {
      component: 'Asesmen & Evaluasi Pembelajaran',
      category: 'Asesmen Akademik',
      amount: 12500000,
      percentage: 12.2,
      description: 'Penyelenggaraan Asesmen Sumatif (PTS, PAS), Asesmen Nasional Berbasis Komputer (ANBK), dan pelaporan hasil belajar.',
      icon: 'i-lucide-file-check'
    },
    {
      component: 'Penyediaan Alat Multi Media & IT',
      category: 'Digitalisasi Pembelajaran',
      amount: 8500000,
      percentage: 8.3,
      description: 'Pemeliharaan proyektor, pemeliharaan lab komputer, router internet kelas, dan sarana multimedia pendukung guru.',
      icon: 'i-lucide-monitor'
    },
    {
      component: 'Honorarium Pendidik & Staf Non-ASN',
      category: 'Tenaga Kependidikan',
      amount: 6000000,
      percentage: 5.9,
      description: 'Pembayaran honorarium guru honorer yang terdata resmi di Dapodik sesuai juknis kementerian.',
      icon: 'i-lucide-user-check'
    },
    {
      component: 'Pelaksanaan Penerimaan Peserta Didik Baru (PPDB)',
      category: 'Kesiswaan Baru',
      amount: 3000000,
      percentage: 2.9,
      description: 'Sosialisasi PPDB, formulir pendaftaran, verifikasi berkas zonasi, dan Masa Pengenalan Lingkungan Sekolah (MPLS).',
      icon: 'i-lucide-user-plus'
    },
    {
      component: 'Pengembangan Keprofesian Berkelanjutan (PKB)',
      category: 'Kompetensi Guru',
      amount: 2000000,
      percentage: 1.9,
      description: 'Partisipasi guru dalam Kelompok Kerja Guru (KKG), seminar peningkatan kompetensi, dan pelatihan metode ajar.',
      icon: 'i-lucide-graduation-cap'
    }
  ],
  principles: [
    {
      title: 'Fleksibel',
      desc: 'Pengelolaan dana dioptimalkan berdasarkan kebutuhan mendesak dan prioritas nyata sekolah.',
      icon: 'i-lucide-sliders'
    },
    {
      title: 'Efektif',
      desc: 'Pemanfaatan anggaran berfokus memberikan dampak positif terhadap kualitas belajar mengajar.',
      icon: 'i-lucide-target'
    },
    {
      title: 'Efisien',
      desc: 'Pemilihan belanja barang dan jasa dilakukan dengan hemat, tepat kualitas, dan tepat kuantitas.',
      icon: 'i-lucide-pie-chart'
    },
    {
      title: 'Akuntabel',
      desc: 'Seluruh transaksi tercatat resmi melalui Aplikasi Rencana Kegiatan dan Anggaran Sekolah (ARKAS).',
      icon: 'i-lucide-shield-check'
    },
    {
      title: 'Transparan',
      desc: 'Laporan keuangan terbuka untuk pengawasan komite sekolah, wali siswa, serta publik.',
      icon: 'i-lucide-eye'
    }
  ]
}

const { data: page } = await useAsyncData('page-data-bos', () =>
  queryCollection('bos').first()
)

const bos = computed<BosData>(() => {
  return page.value || defaultBosData
})

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val)
}

useSeoMeta({
  title: 'Transparansi Anggaran BOS',
  description:
    'Laporan transparansi alokasi, penerimaan, dan penggunaan dana Bantuan Operasional Satuan Pendidikan (BOSP) SD Negeri Teja II.',
  ogTitle: 'Transparansi Anggaran BOS | SDN Teja II',
  ogDescription:
    'Laporan transparansi alokasi, penerimaan, dan penggunaan dana Bantuan Operasional Satuan Pendidikan (BOSP) SD Negeri Teja II.'
})

defineOgImage('OgImage', {
  page: 'Anggaran BOS',
  title: 'Transparansi Anggaran Dana BOS',
  description: 'Laporan alokasi, pencairan tahap, dan belanja BOSP reguler SD Negeri Teja II Rajagaluh Majalengka.'
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
          <span class="text-highlighted font-medium">Anggaran BOS</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              {{ bos.title }}
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              {{ bos.description }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UBadge
              variant="subtle"
              color="primary"
              size="md"
            >
              <UIcon
                name="i-lucide-calendar"
                class="size-3.5 mr-1"
              />
              {{ bos.fiscal_year }}
            </UBadge>
            <UBadge
              variant="subtle"
              color="neutral"
              size="md"
            >
              109 Siswa Sasaran
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Ringkasan Anggaran Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <UCard class="hover:border-primary/50 transition-colors">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-muted text-xs">
              <span>Total Pagu BOSP</span>
              <UIcon
                name="i-lucide-wallet"
                class="size-4 text-primary"
              />
            </div>
            <div class="text-2xl sm:text-3xl font-bold text-highlighted">
              {{ formatRupiah(bos.total_budget) }}
            </div>
            <p class="text-xs text-muted">
              Pagu anggaran tahun berjalan
            </p>
          </div>
        </UCard>

        <UCard class="hover:border-primary/50 transition-colors">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-muted text-xs">
              <span>Satuan Biaya / Siswa</span>
              <UIcon
                name="i-lucide-users"
                class="size-4 text-primary"
              />
            </div>
            <div class="text-2xl sm:text-3xl font-bold text-highlighted">
              {{ formatRupiah(bos.unit_cost) }}
            </div>
            <p class="text-xs text-muted">
              Per peserta didik / tahun
            </p>
          </div>
        </UCard>

        <UCard class="hover:border-primary/50 transition-colors">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-muted text-xs">
              <span>Peserta Didik Dapodik</span>
              <UIcon
                name="i-lucide-graduation-cap"
                class="size-4 text-primary"
              />
            </div>
            <div class="text-2xl sm:text-3xl font-bold text-highlighted">
              {{ bos.student_count }} Siswa
            </div>
            <p class="text-xs text-muted">
              Data sinkronisasi Dapodik aktif
            </p>
          </div>
        </UCard>

        <UCard class="hover:border-primary/50 transition-colors">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-muted text-xs">
              <span>Mekanisme Salur</span>
              <UIcon
                name="i-lucide-arrow-left-right"
                class="size-4 text-primary"
              />
            </div>
            <div class="text-2xl sm:text-3xl font-bold text-primary">
              2 Tahap
            </div>
            <p class="text-xs text-muted">
              50% Tahap I • 50% Tahap II
            </p>
          </div>
        </UCard>
      </div>

      <!-- Penyaluran Tahap & Rekening Resmi Bank -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Rincian Penyaluran Tahap -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-highlighted flex items-center gap-2">
              <UIcon
                name="i-lucide-layers"
                class="size-5 text-primary"
              />
              Tahapan Penyaluran Dana BOS
            </h2>
            <span class="text-xs text-muted">Langsung ke Rekening Sekolah</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UCard
              v-for="(phase, idx) in bos.phases"
              :key="idx"
              class="border border-default/70 hover:border-primary/50 transition-all relative overflow-hidden"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-primary uppercase tracking-wider">
                    {{ phase.phase }}
                  </span>
                  <UBadge
                    :color="phase.status === 'Terealisasi' ? 'neutral' : 'primary'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ phase.status }}
                  </UBadge>
                </div>

                <div class="text-xl sm:text-2xl font-bold text-highlighted">
                  {{ formatRupiah(phase.amount) }}
                </div>

                <div class="pt-2 border-t border-default space-y-1 text-xs text-muted">
                  <div class="flex items-center justify-between">
                    <span>Periode:</span>
                    <span class="font-medium text-highlighted">{{ phase.period }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Porsi:</span>
                    <span class="font-medium text-highlighted">{{ phase.percentage }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Tanggal Update:</span>
                    <span class="font-mono text-muted">{{ phase.date }}</span>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Rekening Bank Resmi -->
        <div class="lg:col-span-5 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-highlighted flex items-center gap-2">
              <UIcon
                name="i-lucide-landmark"
                class="size-5 text-primary"
              />
              Rekening Resmi Penampung
            </h2>
          </div>

          <UCard class="border border-primary/40 bg-elevated/40 space-y-4">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="size-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-lucide-credit-card"
                    class="size-6"
                  />
                </div>
                <div>
                  <div class="text-xs font-semibold text-primary uppercase">
                    Bank Penyalur Resmi
                  </div>
                  <div class="text-base font-bold text-highlighted">
                    {{ bos.rekening.bank }}
                  </div>
                  <div class="text-xs text-muted">
                    {{ bos.rekening.branch }}
                  </div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl border border-default bg-muted/40 space-y-2">
                <div class="text-xs text-muted">
                  Nomor Rekening BOS Sekolah:
                </div>
                <div class="text-xl font-mono font-bold text-highlighted tracking-wider">
                  {{ bos.rekening.account_number }}
                </div>
                <div class="text-xs text-muted flex items-center gap-1.5 pt-1 border-t border-default/50">
                  <span>Atas Nama:</span>
                  <span class="font-semibold text-highlighted">{{ bos.rekening.account_name }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2 text-xs text-muted">
                <UIcon
                  name="i-lucide-check-circle-2"
                  class="size-4 text-emerald-500 shrink-0"
                />
                <span>Terverifikasi di Manajemen BOS (MBS) Kemendikdasmen</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Alokasi Komponen Belanja BOS -->
      <div class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 class="text-2xl font-bold text-highlighted flex items-center gap-2">
              <UIcon
                name="i-lucide-pie-chart"
                class="size-6 text-primary"
              />
              Rencana Alokasi Penggunaan Dana BOSP
            </h2>
            <p class="text-sm text-muted mt-0.5">
              Rincian alokasi kegiatan satuan pendidikan berdasarkan ketentuan Petunjuk Teknis BOSP Kemendikbudristek RI.
            </p>
          </div>
          <UBadge
            color="neutral"
            variant="subtle"
            size="md"
            class="self-start sm:self-auto"
          >
            9 Komponen Belanja
          </UBadge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <UCard
            v-for="(item, idx) in bos.allocations"
            :key="idx"
            class="hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div class="space-y-3.5">
              <div class="flex items-start justify-between gap-3">
                <div class="size-10 rounded-xl bg-muted text-primary flex items-center justify-center shrink-0">
                  <UIcon
                    :name="item.icon"
                    class="size-5"
                  />
                </div>
                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ item.percentage }}%
                </UBadge>
              </div>

              <div class="space-y-1">
                <span class="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {{ item.category }}
                </span>
                <h3 class="font-bold text-highlighted text-base leading-snug">
                  {{ item.component }}
                </h3>
                <p class="text-xs text-muted leading-relaxed pt-1">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <div class="pt-3 mt-4 border-t border-default flex items-center justify-between">
              <span class="text-xs text-muted">Alokasi:</span>
              <span class="text-base font-bold text-highlighted">{{ formatRupiah(item.amount) }}</span>
            </div>
          </UCard>
        </div>
      </div>

      <!-- 5 Prinsip Pengelolaan BOS -->
      <div class="space-y-4">
        <div>
          <h2 class="text-xl font-bold text-highlighted flex items-center gap-2">
            <UIcon
              name="i-lucide-shield-check"
              class="size-5 text-primary"
            />
            Prinsip Pengelolaan Dana BOSP
          </h2>
          <p class="text-sm text-muted mt-0.5">
            Pedoman integritas tata kelola anggaran pendidikan di SD Negeri Teja II.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <UCard
            v-for="(p, idx) in bos.principles"
            :key="idx"
            class="text-center p-4 hover:border-primary/40 transition-colors"
          >
            <div class="space-y-2 flex flex-col items-center">
              <div class="size-10 rounded-xl bg-muted text-primary flex items-center justify-center">
                <UIcon
                  :name="p.icon"
                  class="size-5"
                />
              </div>
              <h4 class="font-bold text-sm text-highlighted">
                {{ p.title }}
              </h4>
              <p class="text-xs text-muted leading-relaxed">
                {{ p.desc }}
              </p>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Notice Keterbukaan & Regulasi -->
      <UCard class="border-dashed border-default bg-elevated/20 p-5 rounded-2xl">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
              <UIcon
                name="i-lucide-info"
                class="size-4 text-primary"
              />
              Keterbukaan Informasi Publik & Pengaduan
            </div>
            <p class="text-xs text-muted max-w-3xl leading-relaxed">
              Pengelolaan dana BOSP SD Negeri Teja II diawasi oleh Komite Sekolah, Dinas Pendidikan Kabupaten Majalengka, dan Inspektorat Daerah. Jika terdapat pertanyaan atau masukan, masyarakat dapat menyampaikan secara langsung melalui komite atau kontak resmi sekolah.
            </p>
          </div>
          <UButton
            to="/sekolah#kontak"
            label="Hubungi Sekolah"
            color="neutral"
            variant="subtle"
            size="sm"
            class="shrink-0"
          />
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
