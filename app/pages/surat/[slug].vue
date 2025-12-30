<script setup lang="ts">
// Import type
import type { SuratData } from '~/composables/useSuratData'

// Route params
const route = useRoute()
const slug = route.params.slug as string

// Use composables
const { formatTanggal } = useSuratData()
const toast = useToast()

// Fetch data with proper SSR handling
const { data: suratData, pending, error } = await useLazyAsyncData(
  `surat-${slug}`,
  async () => {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbw4lspp_ReNmGs_-tysbOhazfqDuWXE0sMVvPbZA9awkLTDfpLHmtPrMmCB-EQ6woo/exec'

    try {
      const response = await $fetch<SuratData[]>(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const foundData = response?.find((item: SuratData) => item.slug === slug)

      if (!foundData) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Dokumen tidak ditemukan',
        })
      }

      return foundData
    }
    catch (fetchError) {
      console.error('Error fetching surat data:', fetchError)
      throw createError({
        statusCode: 404,
        statusMessage: 'Dokumen tidak ditemukan',
      })
    }
  },
  {
    server: true,
    default: () => null,
  },
)

// Computed properties for SEO
const seoTitle = computed(() => {
  if (!suratData.value)
    return 'Dokumen Tidak Ditemukan - SDN Teja 2'
  return `Validasi Surat ${suratData.value.perihal} - SDN Teja II`
})

const seoDescription = computed(() => {
  if (!suratData.value)
    return 'Dokumen yang Anda cari tidak ditemukan dalam sistem validasi SDN Teja 2.'
  return `Verifikasi tanda tangan elektronik untuk surat ${suratData.value.perihal} yang ditandatangani oleh ${suratData.value.penandatangan}, ${suratData.value.jabatan} SDN Teja 2.`
})

const formattedDate = computed(() => {
  if (!suratData.value)
    return ''
  return formatTanggal(suratData.value.tanggal)
})

// Set SEO meta tags
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: '/logo.svg',
  ogUrl: computed(() => suratData.value?.url || ''),
  twitterCard: 'summary_large_image',
})

// Copy URL function
function copyUrl() {
  if (!suratData.value)
    return

  navigator.clipboard.writeText(suratData.value.url).then(
    () => {
      toast.add({
        title: 'Berhasil!',
        description: 'Link verifikasi berhasil disalin ke clipboard',
        color: 'success',
      })
    },
    () => {
      toast.add({
        title: 'Gagal!',
        description: 'Tidak dapat menyalin link. Silakan copy manual dari address bar.',
        color: 'error',
      })
    },
  )
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br  py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <div class="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
        <p class="text-gray-600">
          Memvalidasi tanda tangan elektronik...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !suratData" class="text-center py-12">
        <div class="bg-sky-100 border border-sky-400 text-sky-700 px-6 py-4 rounded-lg max-w-md mx-auto">
          <h2 class="text-xl font-semibold mb-2">
            Dokumen Tidak Ditemukan
          </h2>
          <p class="mb-4">
            Maaf, dokumen dengan slug "{{ route.params.slug }}" tidak ditemukan dalam sistem kami.
          </p>
          <NuxtLink to="/" class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg inline-block transition-colors">
            Kembali ke Beranda
          </NuxtLink>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="suratData" class="space-y-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold   mb-2">
            Validasi Tanda Tangan Elektronik
          </h1>
          <p class="">
            Sistem Validasi Dokumen Resmi SDN Teja 2
          </p>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Header Card -->
          <div class="bg-linear-to-r from-blue-600 to-green-600 text-white p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-1">
                  DOKUMEN TERVERIFIKASI
                </h2>
                <p class="opacity-90">
                  Tanda tangan elektronik valid
                </p>
              </div>
              <div class="text-right">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <div class="grid md:grid-cols-2 gap-8">
              <!-- Informasi Surat -->
              <div class="space-y-6">
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-2">
                  Informasi Surat
                </h3>

                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L16 11.586V5a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h2.586l-1.293-1.293a1 1 0 111.414-1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L16 13.586H6V5z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Nomor Surat
                      </dt>
                      <dd class="text-lg font-semibold text-gray-900">
                        {{ suratData.no_surat }}
                      </dd>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Perihal
                      </dt>
                      <dd class="text-lg font-semibold text-gray-900">
                        {{ suratData.perihal }}
                      </dd>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Tanggal
                      </dt>
                      <dd class="text-lg font-semibold text-gray-900">
                        {{ formattedDate || suratData.tanggal }}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informasi Penandatangan -->
              <div class="space-y-6">
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-2">
                  Penandatangan
                </h3>

                <div class="bg-linear-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <div class="flex items-center gap-4 mb-4">
                    <div>
                      <h4 class="text-xl font-bold text-gray-900">
                        {{ suratData.penandatangan }}
                      </h4>
                      <p class="text-green-600 font-semibold">
                        {{ suratData.jabatan }}
                      </p>
                    </div>
                  </div>

                  <div class="bg-white/80 rounded-lg p-4 border border-green-200">
                    <p class="text-sm text-gray-600 mb-2">
                      Status Verifikasi:
                    </p>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span class="text-green-700 font-semibold">Tanda Tangan Terverifikasi</span>
                    </div>
                  </div>
                </div>

                <!-- QR Code -->
                <div class="text-center">
                  <p class="text-sm text-gray-600 mb-3">
                    QR Code Verifikasi:
                  </p>
                  <div class="inline-block p-4 bg-white rounded-xl shadow-md border">
                    <img
                      :src="suratData.qr_url"
                      :alt="`QR Code untuk surat ${suratData.no_surat}`"
                      class="w-32 h-32 mx-auto"
                      loading="lazy"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  @click="copyUrl"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Salin Link Verifikasi
                </button>

                <NuxtLink
                  to="/"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  Kembali ke Beranda
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Disclaimer -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p class="text-amber-800 text-sm">
            <strong>Catatan:</strong> Dokumen ini telah diverifikasi menggunakan sistem tanda tangan elektronik yang sah.
            Untuk pertanyaan lebih lanjut, silakan hubungi SDN Teja 2.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add any custom styles here */
</style>
