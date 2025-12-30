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
  currentImageIndex.value = images.value?.findIndex(img => img.src === image) || 0
}

function closeFullscreen() {
  showFullscreen.value = false
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

// Track loaded state for gallery images
const loadedImages = ref(new Set<string>())
function onImageLoad(src: string) {
  loadedImages.value.add(src)
}

// Shortcuts
defineShortcuts({
  arrowleft: () => showFullscreen.value && navigatePrev(),
  arrowright: () => showFullscreen.value && navigateNext(),
  escape: () => showFullscreen.value && closeFullscreen(),
})

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

    <div v-if="imagesLoading">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <USkeleton
          v-for="n in 6" :key="n"
          class="w-full h-48 rounded-2xl bg-sky-100 dark:bg-sky-800"
        />
      </div>
    </div>

    <div v-else-if="imagesError">
      <UAlert
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :title="imagesError.message || 'Terjadi kesalahan saat memuat gambar.'"
      />
    </div>

    <div v-else>
      <div class="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        <div v-for="image in images" :key="image.src" class="relative group overflow-hidden rounded-2xl min-h-[200px] bg-sky-50 dark:bg-sky-900/20">
          <!-- Skeleton for individual image loading -->
          <USkeleton
            v-if="!loadedImages.has(image.src)"
            class="absolute inset-0 w-full h-full rounded-2xl bg-sky-100 dark:bg-sky-800 animate-pulse"
          />

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
            class="rounded-2xl w-full h-auto cursor-zoom-in transition-all duration-500 group-hover:scale-105"
            :class="loadedImages.has(image.src) ? 'opacity-100' : 'opacity-0'"
            :placeholder="img(`${image.src}`, { height: 10, width: 10, format: 'webp', blur: 1, quality: 50 })"
            @click="openFullscreen(image.src)"
            @load="onImageLoad(image.src)"
          />

          <div v-if="loadedImages.has(image.src)" class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none flex items-center justify-center">
            <UIcon name="i-lucide-maximize" class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 size-8 scale-75 group-hover:scale-100 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <UModal
      v-model:open="showFullscreen"
      fullscreen
      :ui="{
        content: 'bg-black/95 backdrop-blur-xl border-none shadow-none overflow-hidden',
      }"
    >
      <template #content>
        <div class="h-full w-full flex flex-col items-center justify-center p-4 relative bg-transparent" @click="closeFullscreen">
          <!-- Close Button -->
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xl"
            class="absolute top-6 right-6 z-50 text-white hover:bg-white/10 rounded-full cursor-pointer"
            @click.stop="closeFullscreen"
          />

          <!-- Navigation Controls (Left) -->
          <UButton
            v-if="!isPrevDisabled"
            icon="i-lucide-chevron-left"
            size="xl"
            color="neutral"
            variant="ghost"
            class="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 rounded-full h-16 w-16 cursor-pointer"
            @click.stop="navigatePrev"
          />

          <!-- Navigation Controls (Right) -->
          <UButton
            v-if="!isNextDisabled"
            icon="i-lucide-chevron-right"
            size="xl"
            color="neutral"
            variant="ghost"
            class="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 rounded-full h-16 w-16 cursor-pointer"
            @click.stop="navigateNext"
          />

          <!-- Main Image Container -->
          <div class="relative w-full h-full flex items-center justify-center p-4 md:p-12 z-10" @click.stop="">
            <USkeleton
              v-if="fullscreenImageLoading"
              class="absolute max-w-5xl w-full aspect-video rounded-3xl bg-white/10"
            />

            <transition name="fade" mode="out-in">
              <NuxtImg
                v-if="selectedImage"
                :key="selectedImage"
                format="webp"
                :src="selectedImage"
                quality="90"
                class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 pointer-events-auto"
                :class="{ 'opacity-0': fullscreenImageLoading }"
                loading="eager"
                fetchpriority="high"
                @load="onFullscreenImageLoad"
              />
            </transition>
          </div>

          <!-- Counter and Caption -->
          <div class="absolute bottom-8 flex flex-col items-center gap-2 z-50">
            <UBadge color="neutral" variant="soft" size="lg" class="px-4 py-1 tracking-wider bg-white/10 text-white border-none">
              {{ currentImageIndex + 1 }} / {{ images?.length || 0 }}
            </UBadge>
            <p v-if="kegiatanPage?.title" class="text-white/60 text-sm font-medium">
              {{ kegiatanPage.title }}
            </p>
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
