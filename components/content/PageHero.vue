<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Selamat datang di website SDN TEJA II',
  },
  description: {
    type: String,
    default: 'Wujudkan Impian Pendidikan Berkualitas untuk Semua, Lingkungan Belajar yang Nyaman, Kreatif, dan Menyenangkan',
  },
  image: {
    type: String,
    default: 'https://dummyimage.com/400x400',
  },
  cta: {
    type: String,
    default: 'Tentang Kami',
  },
  url: {
    type: String,
    default: '/',
  },
})

const images = [
  'https://picsum.photos/1920/1080?random=1',
  'https://picsum.photos/1920/1080?random=2',
  'https://picsum.photos/1920/1080?random=3',
  'https://picsum.photos/1920/1080?random=4',
  'https://picsum.photos/1920/1080?random=5',
  'https://picsum.photos/1920/1080?random=6',
]

const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value)
      return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 1500)
})
</script>

<template>
  <UContainer class="pt-20 md:pt-40">
    <div class=" ">
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 class="text-center md:text-left text-3xl font-bold sm:text-4xl lg:text-6xl lg:leading-tight  ">
            {{ title }}
          </h1>
          <p class="text-center md:text-left mt-3 text-lg text-gray-800 dark:text-neutral-400">
            {{ description }}
          </p>
        </div>
        <div class=" ">
          <UCarousel ref="carouselRef" v-slot="{ item }" indicators :items="images" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden" arrows>
            <NuxtImg :src="item" preset="wide" class="w-full h-60 md:h-96 object-cover object-center rounded-md" draggable="false" />
          </UCarousel>
          <!-- <NuxtImg preset="wide" class="w-full h-60 md:h-96 object-cover object-center rounded-md" :src="image" alt="Hero Image" /> -->
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style scoped></style>
