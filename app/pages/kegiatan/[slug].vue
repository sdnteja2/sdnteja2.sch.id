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
watch(
  () => kegiatanPage.value,
  (newValue) => {
    if (newValue && !newValue.tag) {
      imagesError.value = new Error('Tag tidak ditemukan pada halaman ini.')
    }
  },
  { immediate: true },
)

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
const isNextDisabled = computed(
  () => !images.value || currentImageIndex.value >= images.value.length - 1,
)

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

      <p>{{ kegiatanPage?.description }}</p>
    </div>

    <div v-if="imagesLoading">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <USkeleton
          v-for="n in 6"
          :key="n"
          class="h-48 w-full rounded-2xl bg-sky-100 dark:bg-sky-800"
        />
      </div>
    </div>

    <div v-else-if="imagesError">
      <UAlert
        icon="i-ph-warning-duotone"
        color="error"
        variant="soft"
        :title="imagesError.message || 'Terjadi kesalahan saat memuat gambar.'"
      />
    </div>

    <div v-else>
      <div class="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3">
        <div
          v-for="image in images"
          :key="image.src"
          class="group relative min-h-[200px] overflow-hidden rounded-2xl bg-sky-50 dark:bg-sky-900/20"
        >
          <!-- Skeleton for individual image loading -->
          <USkeleton
            v-if="!loadedImages.has(image.src)"
            class="absolute inset-0 h-full w-full animate-pulse rounded-2xl bg-sky-100 dark:bg-sky-800"
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
            class="h-auto w-full cursor-zoom-in rounded-2xl transition-all duration-500 group-hover:scale-105"
            :class="loadedImages.has(image.src) ? 'opacity-100' : 'opacity-0'"
            :placeholder="
              img(`${image.src}`, { height: 10, width: 10, format: 'webp', blur: 1, quality: 50 })
            "
            @click="openFullscreen(image.src)"
            @load="onImageLoad(image.src)"
          />

          <div
            v-if="loadedImages.has(image.src)"
            class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20"
          >
            <UIcon
              name="i-lucide-maximize"
              class="size-8 scale-75 text-white opacity-0 transition-opacity transition-transform duration-300 group-hover:scale-100 group-hover:opacity-100"
            />
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
        <div
          class="relative flex h-full w-full flex-col items-center justify-center bg-transparent p-4"
          @click="closeFullscreen"
        >
          <!-- Close Button -->
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xl"
            class="absolute right-6 top-6 z-50 cursor-pointer rounded-full text-white hover:bg-white/10"
            @click.stop="closeFullscreen"
          />

          <!-- Navigation Controls (Left) -->
          <UButton
            v-if="!isPrevDisabled"
            icon="i-ph-arrow-fat-left-duotone"
            size="xl"
            color="neutral"
            variant="ghost"
            class="absolute left-4 top-1/2 z-50 h-16 w-16 -translate-y-1/2 cursor-pointer rounded-full text-white hover:bg-white/10 md:left-10"
            @click.stop="navigatePrev"
          />

          <!-- Navigation Controls (Right) -->
          <UButton
            v-if="!isNextDisabled"
            icon="i-ph-arrow-fat-right-duotone"
            size="xl"
            color="neutral"
            variant="ghost"
            class="absolute right-4 top-1/2 z-50 h-16 w-16 -translate-y-1/2 cursor-pointer rounded-full text-white hover:bg-white/10 md:right-10"
            @click.stop="navigateNext"
          />

          <!-- Main Image Container -->
          <div
            class="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-12"
            @click.stop=""
          >
            <USkeleton
              v-if="fullscreenImageLoading"
              class="absolute aspect-video w-full max-w-5xl rounded-3xl bg-white/10"
            />

            <transition name="fade" mode="out-in">
              <NuxtImg
                v-if="selectedImage"
                :key="selectedImage"
                format="webp"
                :src="selectedImage"
                quality="90"
                class="pointer-events-auto max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300"
                :class="{ 'opacity-0': fullscreenImageLoading }"
                loading="eager"
                fetchpriority="high"
                @load="onFullscreenImageLoad"
              />
            </transition>
          </div>

          <!-- Counter and Caption -->
          <div class="absolute bottom-8 z-50 flex flex-col items-center gap-2">
            <UBadge
              color="neutral"
              variant="soft"
              size="lg"
              class="border-none bg-white/10 px-4 py-1 tracking-wider text-white"
            >
              {{ currentImageIndex + 1 }} / {{ images?.length || 0 }}
            </UBadge>
            <p v-if="kegiatanPage?.title" class="text-sm font-medium text-white/60">
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
