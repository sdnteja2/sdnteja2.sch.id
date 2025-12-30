// app/pages/kegiatan/[slug].vue
<script lang="ts" setup>
const route = useRoute()
const img = useImage()

// 1. Ambil data halaman (SSR Friendly)
const { data: kegiatanPage } = await useAsyncData(`Kegiatan-${route.path}`, () => {
  return queryCollection('kegiatan').path(route.path).first()
})

// 2. Gunakan composable (Hapus useLazyFetch manual di bawahnya)
// Composable ini sudah menangani status, data, dan error
const {
  data: images,
  // eslint-disable-next-line unused-imports/no-unused-vars
  pending: imagesLoading,
  error: imagesError,
} = useKegiatanImages(computed(() => kegiatanPage.value?.tag))

// Menangani kasus ketika tag tidak ada (Opsional, karena sudah dihandle di composable)
watch(() => kegiatanPage.value, (newValue) => {
  if (newValue && !newValue.tag) {
    imagesError.value = new Error('Tag tidak ditemukan pada halaman ini.')
  }
}, { immediate: true })

// State untuk UI (Fullscreen)
const showFullscreen = ref(false)
const selectedImage = ref('')
const currentImageIndex = ref(0)
const fullscreenImageLoading = ref(true)

function openFullscreen(image: string) {
  selectedImage.value = image
  showFullscreen.value = true
  fullscreenImageLoading.value = true
  document.body.style.overflow = 'hidden'
  currentImageIndex.value = images.value?.findIndex(img => img.src === image) || 0
}

function closeFullscreen() {
  showFullscreen.value = false
  document.body.style.overflow = 'auto'
}

function navigatePrev() {
  if (currentImageIndex.value > 0) {
    fullscreenImageLoading.value = true
    currentImageIndex.value--
    selectedImage.value = images.value?.[currentImageIndex.value]?.src || ''
  }
}

function navigateNext() {
  if (images.value && currentImageIndex.value < images.value.length - 1) {
    fullscreenImageLoading.value = true
    currentImageIndex.value++
    selectedImage.value = images.value?.[currentImageIndex.value]?.src || ''
  }
}

function onFullscreenImageLoad() {
  fullscreenImageLoading.value = false
}

const isPrevDisabled = computed(() => currentImageIndex.value <= 0)
const isNextDisabled = computed(() => !images.value || currentImageIndex.value >= images.value.length - 1)

// SEO & Meta
useHead({
  title: kegiatanPage?.value?.title,
  titleTemplate: '%s | SDN TEJA II',
})

useSeoMeta({
  title: kegiatanPage?.value?.title,
  description: kegiatanPage?.value?.description,
})
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-4">
      <UiBreadcrumb />
    </div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold">
        {{ kegiatanPage?.title }}
      </h1>

      <p> {{ kegiatanPage?.description }}</p>
    </div>

    <div v-if="status === 'pending'">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <USkeleton
          v-for="n in 3" :key="n"
          class="w-full h-20 md:h-50 rounded-lg bg-sky-500/50 dark:bg-sky-700/50"
        />
      </div>
      <div class="animate-pulse text-2xl py-16 text-center">
        Loading ...
      </div>
    </div>
    <div v-else-if="error">
      {{ error.message || 'Terjadi kesalahan saat memuat gambar.' }}
    </div>
    <div v-else>
      <div class="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        <div v-for="image in images" :key="image.src" class="relative">
          <NuxtImg
            v-if="image"
            format="webp"
            :src="image.src"
            height="auto"
            width="100%"
            quality="75"
            loading="lazy"
            fetchpriority="low"
            :alt="kegiatanPage?.title"
            class="rounded-lg w-full h-auto cursor-zoom-in"
            :placeholder="img(`${image.src}`, { h: 10, f: 'webp', blur: 1, q: 50 })"
            @click="openFullscreen(image.src)"
          />
        </div>
      </div>
    </div>

    <!-- Overlay untuk menampilkan gambar fullscreen dengan transisi -->
    <Transition>
      <div
        v-if="showFullscreen"
        class="fixed inset-0 bg-sky-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        @click="closeFullscreen"
      >
        <UButton
          class="absolute top-4 right-4 z-50 focus:outline-none"
          size="lg"
          icon="solar:close-square-linear"
          @click.stop="closeFullscreen"
        />
        <UButton
          class="absolute left-4 z-50 bottom-10 focus:outline-none"
          :disabled="isPrevDisabled"
          size="lg"
          icon="solar:arrow-left-linear"
          @click.stop="navigatePrev"
        />
        <UButton
          class="absolute right-4 z-50 bottom-10 focus:outline-none"
          :disabled="isNextDisabled"
          size="lg"
          icon="solar:arrow-right-linear"
          @click.stop="navigateNext"
        />
        <div class="relative max-h-screen cursor-zoom-out max-w-full w-full h-full" @click.stop="closeFullscreen">
          <!-- Skeleton loader while image is loading -->
          <USkeleton
            v-if="fullscreenImageLoading"
            class="absolute inset-0 w-full h-[50%] top-1/2 -translate-y-1/2 rounded-lg bg-sky-500/50 dark:bg-sky-700/50"
          />
          <!-- Image hanya muncul saat sudah selesai loading -->
          <NuxtImg
            v-if="selectedImage && !fullscreenImageLoading"
            format="webp"
            :src="selectedImage"
            quality="90"
            class="w-full h-full object-contain"
            loading="eager"
            fetchpriority="high"
          />
          <!-- Hidden image untuk trigger loading -->
          <NuxtImg
            v-if="selectedImage && fullscreenImageLoading"
            format="webp"
            :src="selectedImage"
            quality="90"
            class="opacity-0 absolute"
            loading="eager"
            fetchpriority="high"
            @load="onFullscreenImageLoad"
          />
        </div>
      </div>
    </Transition>
  </UContainer>
</template>
