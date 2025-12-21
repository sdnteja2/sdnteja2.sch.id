<script lang="ts" setup>
// Ambil data berdasarkan slug dari route
const route = useRoute()
const { data: kegiatanPage } = await useAsyncData(`Kegiatan-${route.path}`, async () => {
  return await queryCollection('kegiatan').path(route.path).first()
})

// State untuk gambar
interface Image {
  src: string
  alt?: string
}

// Menggunakan useLazyFetch untuk mengambil gambar sesuai dokumentasi
const { status, data: images, error } = await useLazyFetch('/api/get-images', {
  params: {
    tag: computed(() => kegiatanPage.value?.tag),
  },
  default: () => [],
  transform: (response) => {
    if (!Array.isArray(response)) {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error('Respons API tidak valid.')
    }
    return response as Image[]
  },
  watch: [computed(() => kegiatanPage.value?.tag)],
})

// Menangani kasus ketika tag tidak ada
watch(() => kegiatanPage.value, (newValue) => {
  if (newValue && !newValue.tag) {
    error.value = new Error('Tag tidak ditemukan pada halaman ini.')
  }
}, { immediate: true })

const img = useImage()

// State untuk menampilkan gambar dalam mode fullscreen
const showFullscreen = ref(false)
const selectedImage = ref('')
const currentImageIndex = ref(0)
const fullscreenImageLoading = ref(true) // Track loading state for fullscreen image

// Fungsi untuk menampilkan gambar dalam mode fullscreen
function openFullscreen(image: string) {
  selectedImage.value = image
  showFullscreen.value = true
  fullscreenImageLoading.value = true // Reset loading state
  document.body.style.overflow = 'hidden' // Mencegah scroll pada body

  // Dapatkan indeks gambar yang sedang ditampilkan
  currentImageIndex.value = images.value?.findIndex(img => img.src === image) || 0
}

// Fungsi untuk menutup gambar fullscreen
function closeFullscreen() {
  showFullscreen.value = false
  document.body.style.overflow = 'auto' // Mengembalikan scroll pada body
}

// Fungsi untuk navigasi ke gambar sebelumnya
function navigatePrev() {
  if (currentImageIndex.value > 0) {
    fullscreenImageLoading.value = true // Set loading saat navigasi
    currentImageIndex.value--
    selectedImage.value = images.value?.[currentImageIndex.value]?.src || ''
  }
}

// Fungsi untuk navigasi ke gambar berikutnya
function navigateNext() {
  if (images.value && currentImageIndex.value < images.value.length - 1) {
    fullscreenImageLoading.value = true // Set loading saat navigasi
    currentImageIndex.value++
    selectedImage.value = images.value?.[currentImageIndex.value]?.src || ''
  }
}

// Handler untuk ketika gambar fullscreen selesai dimuat
function onFullscreenImageLoad() {
  fullscreenImageLoading.value = false
}

// Computed properties untuk memeriksa apakah tombol navigasi harus dinonaktifkan
const isPrevDisabled = computed(() => currentImageIndex.value <= 0)
const isNextDisabled = computed(() => {
  if (!images.value)
    return true
  return currentImageIndex.value >= images.value.length - 1
})

useHead({
  title: kegiatanPage?.value?.title,
  titleTemplate: '%s %separator %siteName',
  templateParams: {
    separator: '|',
    siteName: 'SDN TEJA II',
  },
})
useSeoMeta({
  title: kegiatanPage?.value?.title,
  description: kegiatanPage?.value?.description,
  twitterTitle: kegiatanPage?.value?.title,
  twitterDescription: kegiatanPage?.value?.description,
})

defineOgImageComponent('OgImage', {
  page: 'Kegiatan',
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
          class="w-full h-20 md:h-[200px] rounded-lg bg-red-500/50 dark:bg-red-700/50"
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
        class="fixed inset-0 bg-night-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
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
            class="absolute inset-0 w-full h-[50%] top-1/2 -translate-y-1/2 rounded-lg bg-red-500/50 dark:bg-red-700/50"
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
