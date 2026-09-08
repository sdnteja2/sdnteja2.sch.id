<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`kegiatan-${route.path}`, () =>
  queryCollection('kegiatan').path(route.path).first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Kegiatan tidak ditemukan',
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`kegiatan-surround-${route.path}`, () =>
  queryCollectionItemSurroundings('kegiatan', route.path)
)

const prevItem = computed(() => surround.value?.[0])
const nextItem = computed(() => surround.value?.[1])

// Mengambil gambar dari server /api/get-images menggunakan composable
const {
  data: serverImages,
  pending: imagesLoading,
  error: imagesError
} = useKegiatanImages(computed(() => page.value?.tag))

const galleryImages = computed(() => {
  if (serverImages.value && serverImages.value.length > 0) {
    return serverImages.value
  }
  if (page.value?.cover) {
    return [{ src: page.value.cover, alt: page.value.title }]
  }
  return []
})

// State untuk Fullscreen Modal Gallery
const showFullscreen = ref(false)
const selectedImage = ref('')
const currentImageIndex = ref(0)
const fullscreenImageLoading = ref(false)

function openFullscreen(imageSrc: string) {
  selectedImage.value = imageSrc
  currentImageIndex.value = Math.max(
    0,
    galleryImages.value.findIndex(img => img.src === imageSrc)
  )
  fullscreenImageLoading.value = true
  showFullscreen.value = true
}

function closeFullscreen() {
  showFullscreen.value = false
}

function navigatePrev() {
  if (currentImageIndex.value > 0) {
    fullscreenImageLoading.value = true
    currentImageIndex.value--
    selectedImage.value = galleryImages.value[currentImageIndex.value]?.src || ''
  }
}

function navigateNext() {
  if (currentImageIndex.value < galleryImages.value.length - 1) {
    fullscreenImageLoading.value = true
    currentImageIndex.value++
    selectedImage.value = galleryImages.value[currentImageIndex.value]?.src || ''
  }
}

function onFullscreenImageLoad() {
  fullscreenImageLoading.value = false
}

const isPrevDisabled = computed(() => currentImageIndex.value <= 0)
const isNextDisabled = computed(
  () => currentImageIndex.value >= galleryImages.value.length - 1
)

defineShortcuts({
  arrowleft: () => showFullscreen.value && navigatePrev(),
  arrowright: () => showFullscreen.value && navigateNext(),
  escape: () => showFullscreen.value && closeFullscreen()
})

const formatDate = (val: string | Date | undefined) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

useSeoMeta({
  title: `${page.value?.title} - Kegiatan SD Negeri Teja II`,
  description: page.value?.description,
  ogTitle: `${page.value?.title} - SD Negeri Teja II`,
  ogDescription: page.value?.description,
  ogImage: page.value?.cover || '/cover/tugas.png'
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="max-w-5xl space-y-8">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-sm text-muted">
        <NuxtLink
          to="/"
          class="hover:text-highlighted transition-colors"
        >
          Home
        </NuxtLink>
        <span>/</span>
        <NuxtLink
          to="/publikasi"
          class="hover:text-highlighted transition-colors"
        >
          Publikasi
        </NuxtLink>
        <span>/</span>
        <NuxtLink
          to="/publikasi/kegiatan"
          class="hover:text-highlighted transition-colors"
        >
          Kegiatan
        </NuxtLink>
        <span>/</span>
        <span class="text-highlighted font-medium truncate max-w-[200px] sm:max-w-xs">
          {{ page?.title }}
        </span>
      </div>

      <!-- Header -->
      <header class="space-y-4">
        <div class="flex items-center gap-2 flex-wrap">
          <UBadge
            v-if="page?.tag"
            color="primary"
            variant="solid"
            size="sm"
            class="capitalize"
          >
            {{ page.tag }}
          </UBadge>

          <span
            v-if="page?.date"
            class="text-xs text-muted flex items-center gap-1.5"
          >
            <UIcon
              name="i-lucide-calendar"
              class="size-3.5 text-muted"
            />
            {{ formatDate(page.date) }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-highlighted leading-tight">
          {{ page?.title }}
        </h1>

        <p
          v-if="page?.description"
          class="text-base sm:text-lg text-muted leading-relaxed"
        >
          {{ page.description }}
        </p>
      </header>

      <!-- Featured / Cover Image Section -->
      <div
        v-if="page?.cover"
        class="group relative rounded-2xl overflow-hidden border border-default bg-muted shadow-sm cursor-zoom-in"
        @click="openFullscreen(page.cover)"
      >
        <img
          :src="page.cover"
          :alt="page.title"
          class="w-full h-auto max-h-[460px] object-cover group-hover:scale-102 transition-transform duration-300"
        >
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
          <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
            <UIcon
              name="i-lucide-maximize-2"
              class="size-4"
            />
            Perbesar Foto Sampul
          </div>
        </div>
      </div>

      <!-- Gallery Section -->
      <div class="space-y-4 pt-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-images"
              class="size-5 text-primary"
            />
            <h2 class="text-xl font-bold text-highlighted">
              Galeri Dokumentasi
            </h2>
          </div>

          <span
            v-if="galleryImages.length > 0"
            class="text-xs text-muted"
          >
            {{ galleryImages.length }} foto tersedia
          </span>
        </div>

        <!-- Loading state -->
        <div
          v-if="imagesLoading"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <USkeleton
            v-for="n in 3"
            :key="n"
            class="h-48 w-full rounded-2xl"
          />
        </div>

        <!-- Error state -->
        <div v-else-if="imagesError && galleryImages.length === 0">
          <UAlert
            icon="i-lucide-alert-circle"
            color="warning"
            variant="soft"
            title="Tidak dapat memuat galeri tambahan."
            description="Dokumentasi foto tambahan belum dapat ditampilkan saat ini."
          />
        </div>

        <!-- Photo Grid -->
        <div
          v-else-if="galleryImages.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div
            v-for="(img, idx) in galleryImages"
            :key="img.src + idx"
            class="group relative h-48 rounded-2xl overflow-hidden border border-default bg-muted cursor-zoom-in shadow-xs"
            @click="openFullscreen(img.src)"
          >
            <img
              :src="img.src"
              :alt="img.alt || page?.title"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <UIcon
                name="i-lucide-maximize"
                class="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
              />
            </div>
          </div>
        </div>

        <div
          v-else
          class="p-6 text-center text-sm text-muted rounded-2xl border border-dashed border-default"
        >
          Belum ada foto dokumentasi tambahan untuk kegiatan ini.
        </div>
      </div>

      <!-- Fullscreen Modal View -->
      <UModal
        v-model:open="showFullscreen"
        fullscreen
      >
        <template #content>
          <div
            class="relative flex h-full w-full flex-col items-center justify-center bg-black/95 p-4"
            @click="closeFullscreen"
          >
            <!-- Close Button -->
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="xl"
              class="absolute right-6 top-6 z-50 text-white hover:bg-white/10"
              @click.stop="closeFullscreen"
            />

            <!-- Navigation Controls (Left) -->
            <UButton
              v-if="!isPrevDisabled"
              icon="i-lucide-chevron-left"
              size="xl"
              color="neutral"
              variant="ghost"
              class="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
              @click.stop="navigatePrev"
            />

            <!-- Navigation Controls (Right) -->
            <UButton
              v-if="!isNextDisabled"
              icon="i-lucide-chevron-right"
              size="xl"
              color="neutral"
              variant="ghost"
              class="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
              @click.stop="navigateNext"
            />

            <!-- Main Image Container -->
            <div
              class="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-10"
              @click.stop=""
            >
              <img
                v-if="selectedImage"
                :src="selectedImage"
                :alt="page?.title"
                class="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
                @load="onFullscreenImageLoad"
              >
            </div>

            <!-- Counter and Title -->
            <div class="absolute bottom-6 z-50 flex flex-col items-center gap-1.5 text-center">
              <UBadge
                color="neutral"
                variant="subtle"
                size="md"
                class="bg-white/10 text-white border-none"
              >
                {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
              </UBadge>
              <p class="text-xs sm:text-sm text-white/70 max-w-md truncate">
                {{ page?.title }}
              </p>
            </div>
          </div>
        </template>
      </UModal>

      <USeparator />

      <!-- Navigation Prev / Next Surround -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <NuxtLink
          v-if="prevItem"
          :to="prevItem.path"
          class="group block p-4 rounded-xl border border-default hover:border-primary/50 transition-colors"
        >
          <div class="text-xs text-muted flex items-center gap-1 mb-1">
            <UIcon
              name="i-lucide-arrow-left"
              class="size-3.5 group-hover:-translate-x-1 transition-transform"
            />
            Kegiatan Sebelumnya
          </div>
          <div class="text-sm font-semibold text-highlighted group-hover:text-primary transition-colors line-clamp-2">
            {{ prevItem.title }}
          </div>
        </NuxtLink>
        <div
          v-else
          class="hidden sm:block"
        />

        <NuxtLink
          v-if="nextItem"
          :to="nextItem.path"
          class="group block p-4 rounded-xl border border-default hover:border-primary/50 transition-colors sm:text-right"
        >
          <div class="text-xs text-muted flex items-center justify-end gap-1 mb-1">
            Kegiatan Selanjutnya
            <UIcon
              name="i-lucide-arrow-right"
              class="size-3.5 group-hover:translate-x-1 transition-transform"
            />
          </div>
          <div class="text-sm font-semibold text-highlighted group-hover:text-primary transition-colors line-clamp-2">
            {{ nextItem.title }}
          </div>
        </NuxtLink>
      </div>

      <!-- Back to List Button -->
      <div class="text-center pt-4">
        <UButton
          to="/publikasi/kegiatan"
          label="Kembali ke Daftar Kegiatan"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="subtle"
        />
      </div>
    </UContainer>
  </div>
</template>
