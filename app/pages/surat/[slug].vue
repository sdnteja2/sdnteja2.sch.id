<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

interface SuratData {
  no_surat: string
  perihal: string
  tanggal: string
  penandatangan: string
  jabatan: string
  url?: string
  url_dokumen?: string
  slug?: string
  status_valid?: boolean
}

interface ApiResponse {
  status: 'success' | 'error' | 'pending_setup'
  message?: string
  data?: SuratData
  error?: string
}

// Fetch data verifikasi dari server route proxy (real-time tanpa cache di sisi klien)
const { data: response, status, refresh } = useFetch<ApiResponse>(
  () => `/api/verifikasi/${slug.value}`,
  {
    key: `verifikasi-${slug.value}`,
    cache: 'no-cache',
    server: false
  }
)

const surat = computed<SuratData | null>(() => {
  if (response.value?.status === 'success' && response.value.data) {
    return response.value.data
  }
  return null
})

// Cek apakah url di data merupakan file PDF fisik eksternal atau link verifikasi web
const hasExternalDocumentFile = computed(() => {
  const target = surat.value?.url_dokumen || surat.value?.url || ''
  if (!target) return false
  // Jika URL mengarah ke halaman web verifikasi itu sendiri, jangan anggap sebagai file PDF
  if (target.includes('/surat/') || target.includes('/verifikasi/')) return false
  // Jika URL mengarah ke Drive / PDF / Docs
  return target.includes('drive.google.com') || target.endsWith('.pdf') || target.includes('docs.google.com')
})

const documentFileUrl = computed(() => {
  return surat.value?.url_dokumen || surat.value?.url || ''
})

const isCopied = ref(false)
function copyVerificationLink() {
  if (import.meta.client) {
    const fullUrl = window.location.href
    navigator.clipboard.writeText(fullUrl).then(() => {
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2500)
    })
  }
}

function printVerificationCertificate() {
  if (import.meta.client) {
    window.print()
  }
}

// Meta SEO
useSeoMeta({
  title: computed(() =>
    surat.value
      ? `Verifikasi Surat: ${surat.value.no_surat}`
      : 'Verifikasi Tanda Tangan Elektronik'
  ),
  description: computed(() =>
    surat.value
      ? `Verifikasi keabsahan dokumen resmi ${surat.value.perihal} yang diterbitkan oleh SD Negeri Teja II.`
      : 'Layanan verifikasi keaslian dokumen dan tanda tangan elektronik resmi SD Negeri Teja II.'
  ),
  robots: 'noindex, follow'
})
</script>

<template>
  <div class="py-8 sm:py-14 min-h-[80vh] flex flex-col justify-center print:py-0 print:min-h-0">
    <UContainer class="max-w-3xl w-full space-y-8 print:max-w-none print:p-0">
      <!-- Breadcrumb & Nav (Disembunyikan saat dicetak) -->
      <div class="flex items-center justify-between text-sm text-muted print:hidden">
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/"
            class="hover:text-highlighted transition-colors flex items-center gap-1.5"
          >
            <UIcon
              name="i-lucide-home"
              class="size-4"
            />
            Home
          </NuxtLink>
          <span>/</span>
          <span class="text-highlighted font-medium">Verifikasi Dokumen TTE</span>
        </div>

        <UBadge
          variant="subtle"
          color="neutral"
          size="sm"
        >
          Kanal Resmi Sekolah
        </UBadge>
      </div>

      <!-- 1. LOADING STATE -->
      <div
        v-if="status === 'pending'"
        class="p-8 sm:p-12 rounded-3xl border border-default bg-elevated/40 text-center space-y-4 print:hidden"
      >
        <UIcon
          name="i-lucide-loader"
          class="size-10 text-primary animate-spin mx-auto"
        />
        <h2 class="text-xl font-bold text-highlighted">
          Memeriksa Basis Data Keabsahan Dokumen...
        </h2>
        <p class="text-sm text-muted max-w-md mx-auto">
          Sistem sedang mencocokkan kode tanda tangan elektronik dengan buku register persuratan resmi SDN Teja II.
        </p>
      </div>

      <!-- 2. BERHASIL TERVERIFIKASI -->
      <div
        v-else-if="surat"
        class="space-y-6"
      >
        <!-- Kop Surat Saat Dicetak (Hanya tampil saat print) -->
        <div class="hidden print:flex items-center justify-between border-b-2 border-black pb-4 mb-6">
          <div class="space-y-1">
            <h2 class="text-xl font-bold tracking-tight text-black uppercase">
              PEMERINTAH KABUPATEN MAJALENGKA
            </h2>
            <h3 class="text-lg font-bold text-black uppercase">
              DINAS PENDIDIKAN - SD NEGERI TEJA II
            </h3>
            <p class="text-xs text-gray-700">
              Alamat: Jl. Desa Teja, Kec. Rajagaluh, Kab. Majalengka, Jawa Barat 45472 • Website: https://sdnteja2.sch.id
            </p>
          </div>
        </div>

        <!-- Verification Banner Header -->
        <div class="relative overflow-hidden rounded-3xl border border-success/40 bg-gradient-to-br from-success/15 via-success/5 to-transparent p-6 sm:p-8 text-center space-y-4 shadow-sm print:border-black print:bg-white print:p-4">
          <div class="size-16 sm:size-20 rounded-2xl bg-success/20 text-success border border-success/30 flex items-center justify-center mx-auto shadow-inner print:border-black print:bg-gray-100 print:text-black">
            <UIcon
              name="i-lucide-shield-check"
              class="size-10 sm:size-12"
            />
          </div>

          <div class="space-y-1.5">
            <UBadge
              color="success"
              variant="solid"
              size="md"
              class="font-bold tracking-wide uppercase px-3 py-1 print:border print:border-black print:bg-gray-100 print:text-black"
            >
              Dokumen Resmi Terverifikasi
            </UBadge>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-highlighted tracking-tight print:text-black">
              Tanda Tangan Elektronik Sah
            </h1>
            <p class="text-muted text-xs sm:text-sm max-w-lg mx-auto print:text-gray-700">
              Dokumen ini telah diverifikasi secara elektronik dan terdaftar sah dalam buku register administrasi persuratan SD Negeri Teja II.
            </p>
          </div>
        </div>

        <!-- Detail Card -->
        <UCard
          variant="subtle"
          class="rounded-3xl border border-default shadow-sm overflow-hidden divide-y divide-default print:border-black print:bg-white print:divide-gray-300"
        >
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <UIcon
                  name="i-lucide-file-text"
                  class="size-5 text-primary print:text-black"
                />
                <h3 class="font-bold text-highlighted text-base print:text-black">
                  Rincian Dokumen & Persuratan
                </h3>
              </div>
              <UBadge
                variant="subtle"
                color="primary"
                size="xs"
                class="font-mono print:border print:border-black print:text-black"
              >
                Kode: {{ slug }}
              </UBadge>
            </div>
          </template>

          <div class="p-4 sm:p-6 space-y-5 text-sm print:p-4 print:space-y-3">
            <!-- Nomor Surat -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 pb-4 border-b border-default/60 print:border-gray-200">
              <span class="text-xs uppercase tracking-wider text-muted font-semibold sm:w-1/3 print:text-gray-600">
                Nomor Surat
              </span>
              <span class="font-bold text-highlighted sm:w-2/3 text-base sm:text-right select-all print:text-black">
                {{ surat.no_surat }}
              </span>
            </div>

            <!-- Perihal -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 pb-4 border-b border-default/60 print:border-gray-200">
              <span class="text-xs uppercase tracking-wider text-muted font-semibold sm:w-1/3 print:text-gray-600">
                Perihal / Keperluan
              </span>
              <span class="font-semibold text-highlighted sm:w-2/3 sm:text-right print:text-black">
                {{ surat.perihal }}
              </span>
            </div>

            <!-- Tanggal Diterbitkan -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 pb-4 border-b border-default/60 print:border-gray-200">
              <span class="text-xs uppercase tracking-wider text-muted font-semibold sm:w-1/3 print:text-gray-600">
                Tanggal Diterbitkan
              </span>
              <span class="font-semibold text-highlighted sm:w-2/3 sm:text-right flex sm:justify-end items-center gap-1.5 print:text-black">
                <UIcon
                  name="i-lucide-calendar"
                  class="size-4 text-primary print:hidden"
                />
                {{ surat.tanggal }}
              </span>
            </div>

            <!-- Pejabat Penandatangan -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 pb-4 border-b border-default/60 print:border-gray-200">
              <span class="text-xs uppercase tracking-wider text-muted font-semibold sm:w-1/3 print:text-gray-600">
                Pejabat Penandatangan
              </span>
              <div class="sm:w-2/3 sm:text-right">
                <p class="font-bold text-highlighted print:text-black">
                  {{ surat.penandatangan }}
                </p>
                <p class="text-xs text-primary font-medium print:text-gray-700">
                  {{ surat.jabatan }}
                </p>
              </div>
            </div>

            <!-- Satuan Pendidikan -->
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
              <span class="text-xs uppercase tracking-wider text-muted font-semibold sm:w-1/3 print:text-gray-600">
                Satuan Pendidikan
              </span>
              <span class="font-medium text-muted sm:w-2/3 sm:text-right print:text-gray-800">
                SD Negeri Teja II, Kec. Rajagaluh, Kab. Majalengka
              </span>
            </div>
          </div>

          <!-- Footer Aksi (Disembunyikan saat dicetak) -->
          <template #footer>
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <!-- Jika ada file PDF eksternal terpisah -->
                <UButton
                  v-if="hasExternalDocumentFile"
                  :to="documentFileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="i-lucide-external-link"
                  label="Buka File PDF Asli"
                  color="primary"
                  variant="solid"
                  size="sm"
                  class="flex-1 sm:flex-initial"
                />
                <!-- Tombol Cetak Bukti Verifikasi Resmi -->
                <UButton
                  icon="i-lucide-printer"
                  label="Cetak Bukti Verifikasi (PDF)"
                  color="primary"
                  :variant="hasExternalDocumentFile ? 'subtle' : 'solid'"
                  size="sm"
                  class="flex-1 sm:flex-initial"
                  @click="printVerificationCertificate"
                />
              </div>

              <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                <UButton
                  :icon="isCopied ? 'i-lucide-check' : 'i-lucide-copy'"
                  :label="isCopied ? 'Tautan Disalin!' : 'Salin Tautan'"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="flex-1 sm:flex-initial"
                  @click="copyVerificationLink"
                />
                <UButton
                  to="/"
                  icon="i-lucide-home"
                  label="Beranda"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                />
              </div>
            </div>
          </template>
        </UCard>

        <!-- Security Disclaimer -->
        <div class="p-4 rounded-2xl bg-muted/60 border border-default text-xs text-muted flex items-start gap-3 print:border-black print:bg-white print:text-gray-700">
          <UIcon
            name="i-lucide-lock"
            class="size-4 text-primary shrink-0 mt-0.5 print:text-black"
          />
          <p>
            Informasi ini merupakan rekaman data elektronik resmi dari basis data persuratan SD Negeri Teja II. Segala bentuk duplikasi, pemalsuan nomor surat, atau pengubahan isi di luar kewenangan sekolah merupakan tindak pelanggaran hukum.
          </p>
        </div>
      </div>

      <!-- 3. ERROR / TIDAK DITEMUKAN -->
      <div
        v-else
        class="space-y-6"
      >
        <div class="rounded-3xl border border-error/40 bg-error/10 p-8 text-center space-y-4">
          <div class="size-16 rounded-2xl bg-error/20 text-error border border-error/30 flex items-center justify-center mx-auto">
            <UIcon
              name="i-lucide-shield-alert"
              class="size-10"
            />
          </div>

          <div class="space-y-1.5">
            <UBadge
              color="error"
              variant="solid"
              size="md"
              class="font-bold uppercase tracking-wide px-3 py-1"
            >
              Dokumen Tidak Ditemukan
            </UBadge>
            <h1 class="text-2xl font-bold text-highlighted">
              Kode TTE Tidak Terdaftar
            </h1>
            <p class="text-muted text-sm max-w-md mx-auto">
              Kode verifikasi <span class="font-mono font-semibold text-highlighted bg-muted px-1.5 py-0.5 rounded">{{ slug }}</span> tidak ditemukan dalam buku register resmi SD Negeri Teja II.
            </p>
          </div>

          <div class="pt-2 flex items-center justify-center gap-3">
            <UButton
              label="Coba Periksa Ulang"
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="subtle"
              size="sm"
              @click="() => refresh()"
            />
            <UButton
              to="/"
              label="Ke Beranda Sekolah"
              icon="i-lucide-arrow-left"
              color="primary"
              variant="subtle"
              size="sm"
            />
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-muted/60 border border-default text-xs text-muted flex items-start gap-3">
          <UIcon
            name="i-lucide-info"
            class="size-4 text-warning shrink-0 mt-0.5"
          />
          <p>
            Jika Anda menerima surat bertanda tangan atau stempel yang mengatasnamakan SD Negeri Teja II namun kode verifikasi ini tidak valid, silakan hubungi bagian tata usaha sekolah untuk konfirmasi langsung.
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
