<script setup lang="ts">
const route = useRoute()

interface BukuItem {
  title: string
  path: string
  kelas: string
  pelajaran: string
  link?: string
  tipe?: string
  image?: string
  driveId?: string
}

const { data: buku } = await useAsyncData(
  `buku-${route.path}`,
  async () => {
    return (await queryCollection('buku').path(route.path).first()) as BukuItem | null
  },
  {
    getCachedData(key, nuxtApp) {
      if (nuxtApp.payload.data[key] || nuxtApp.static.data[key]) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      }
      if (import.meta.client) {
        try {
          const item = localStorage.getItem(`sdnteja2-cache-${key}`)
          if (item) {
            return JSON.parse(item)
          }
        } catch {
          // Ignore storage error
        }
      }
    }
  }
)

watch(
  buku,
  (val) => {
    if (import.meta.client && val) {
      try {
        localStorage.setItem(`sdnteja2-cache-buku-${route.path}`, JSON.stringify(val))
      } catch {
        // Ignore storage error
      }
    }
  },
  { immediate: true }
)

if (!buku.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Buku tidak ditemukan',
    fatal: true
  })
}

function extractDriveId(url: string | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) return trimmed
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

const pdfProvider = computed<'gdrive' | 'url'>(() => {
  if (buku.value?.driveId) return 'gdrive'
  if (buku.value?.link && extractDriveId(buku.value.link)) return 'gdrive'
  return 'url'
})

const pdfSrc = computed(() => {
  if (buku.value?.driveId) return buku.value.driveId
  if (buku.value?.link) {
    const dId = extractDriveId(buku.value.link)
    if (dId) return dId
    return buku.value.link
  }
  return ''
})

const externalSourceUrl = computed(() => {
  if (buku.value?.link) return buku.value.link
  if (buku.value?.driveId) return `https://drive.google.com/file/d/${buku.value.driveId}/view`
  return ''
})

useSeoMeta({
  title: `${buku.value?.title || 'Baca Buku'} - SD Negeri Teja II`,
  description: `Baca online ${buku.value?.title} (${buku.value?.tipe || 'Buku Teks'}) untuk Kelas ${buku.value?.kelas} di SD Negeri Teja II.`,
  ogTitle: `${buku.value?.title} - SD Negeri Teja II`,
  ogDescription: `Baca online ${buku.value?.title} Kelas ${buku.value?.kelas} di SD Negeri Teja II.`,
  ogImage: buku.value?.image || '/cover/buku.png'
})

defineOgImage('OgImage', {
  page: 'Buku',
  title: buku.value?.title,
  description: `Buku Kurikulum Merdeka Kelas ${buku.value?.kelas} - ${buku.value?.pelajaran}`
})
</script>

<template>
  <div class="py-6 sm:py-10">
    <UContainer class="space-y-6">
      <!-- Breadcrumbs & Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-2">
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
            <NuxtLink
              to="/media/buku"
              class="hover:text-highlighted transition-colors"
            >
              Buku
            </NuxtLink>
            <span>/</span>
            <span class="text-highlighted font-medium truncate max-w-[220px] sm:max-w-md">
              {{ buku?.title }}
            </span>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <UBadge
              color="primary"
              variant="solid"
              size="sm"
              class="font-semibold"
            >
              Kelas {{ buku?.kelas }}
            </UBadge>
            <UBadge
              v-if="buku?.tipe"
              :color="buku?.tipe === 'Buku Guru' ? 'warning' : 'neutral'"
              variant="subtle"
              size="sm"
            >
              {{ buku?.tipe }}
            </UBadge>
            <UBadge
              color="neutral"
              variant="subtle"
              size="sm"
            >
              {{ buku?.pelajaran }}
            </UBadge>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <UButton
            to="/media/buku"
            label="Katalog Buku"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="subtle"
            size="sm"
          />
          <UButton
            v-if="externalSourceUrl"
            :to="externalSourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            label="Buka Sumber"
            icon="i-lucide-external-link"
            trailing
            color="primary"
            variant="subtle"
            size="sm"
          />
        </div>
      </div>

      <!-- Book Title Header -->
      <div class="p-4 sm:p-5 rounded-2xl border border-default bg-elevated/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-highlighted">
            {{ buku?.title }}
          </h1>
          <p class="text-xs sm:text-sm text-muted">
            Mata Pelajaran: {{ buku?.pelajaran }} • Kurikulum Merdeka SD Negeri Teja II
          </p>
        </div>
      </div>

      <!-- Nuxt PDF Kit Viewer -->
      <div class="relative w-full h-[78vh] sm:h-[84vh] rounded-2xl overflow-hidden border border-default bg-muted shadow-sm">
        <ClientOnly>
          <NuxtPdfKit
            v-if="pdfSrc"
            :src="pdfSrc"
            :provider="pdfProvider"
            theme="light"
            :responsive="true"
            initial-view-mode="single"
            initial-scroll-mode="vertical"
            class="h-full w-full"
            :toolbar="{
              sidebar: true,
              pageNavigation: true,
              zoom: true,
              search: true,
              rotate: true,
              print: true,
              download: true,
              fullscreen: true,
              themeToggle: true
            }"
          />
          <div
            v-else
            class="h-full flex flex-col items-center justify-center p-8 text-center space-y-3"
          >
            <UIcon
              name="i-lucide-file-warning"
              class="size-12 text-warning mx-auto"
            />
            <p class="text-highlighted font-semibold text-lg">
              Berkas PDF Tidak Tersedia
            </p>
            <p class="text-muted text-sm max-w-sm mx-auto">
              Tautan unduh atau pratinjau untuk dokumen ini belum terhubung.
            </p>
            <UButton
              to="/media/buku"
              label="Kembali ke Katalog Buku"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="subtle"
              size="sm"
            />
          </div>

          <template #fallback>
            <div class="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <UIcon
                name="i-lucide-loader"
                class="size-10 text-primary animate-spin mx-auto"
              />
              <p class="text-highlighted font-medium text-base">
                Memuat Penampil Buku PDF...
              </p>
              <p class="text-muted text-xs">
                Menyiapkan halaman dan dokumen PDF.
              </p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </UContainer>
  </div>
</template>
