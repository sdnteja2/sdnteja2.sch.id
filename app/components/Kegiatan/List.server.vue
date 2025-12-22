// KegiatanPage.vue

<script setup lang="ts">
import { Motion } from 'motion-v'

const { data: kegiatanList } = await useAsyncData('kegiatanList', async () => {
  try {
    return await queryCollection('kegiatan')
      .order('date', 'DESC')
      .all()
  }
  catch (error) {
    console.error('Error fetching kegiatan data:', error)
    return []
  }
}, {
  default: () => [],
})

const img = useImage()
</script>

<template>
  <div class="py-20">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Motion
          v-for="(galeri, index) in kegiatanList"
          :key="galeri.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          class="transition-transform duration-200 ease-in-out transform hover:scale-98"
        >
          <NuxtLink :to="galeri.path" class="shadow-2xl rounded-3xl overflow-hidden">
            <NuxtImg
              format="webp"
              quality="75"
              :height="300"
              :width="500"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 450px"
              densities="1x 2x"
              :title="galeri.title"
              :alt="galeri.title"
              loading="lazy"
              fetchpriority="low"
              :src="galeri.cover"
              :placeholder="img(galeri.cover, { h: 15, w: 25, f: 'webp', blur: 5, q: 10 })"
              class="rounded-3xl mb-4 aspect-video object-cover object-center h-[250px] w-full transition-all duration-300 ease-in-out"
            />
            <h2 class="font-bold text-sm text-center">
              {{ galeri.title }}
            </h2>
          </NuxtLink>
        </Motion>
      </div>
    </UContainer>
  </div>
</template>
