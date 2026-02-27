// KegiatanPage.vue

<script setup lang="ts">
import { motion } from 'motion-v'

const { data: kegiatanList } = await useAsyncData(
  'kegiatanList',
  async () => {
    try {
      return await queryCollection('kegiatan').order('date', 'DESC').all()
    }
    catch (error) {
      console.error('Error fetching kegiatan data:', error)
      return []
    }
  },
  {
    default: () => [],
  },
)

const img = useImage()
</script>

<template>
  <div class="py-20">
    <UContainer>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <motion.div
          v-for="(galeri, index) in kegiatanList"
          :key="galeri.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          class="hover:scale-98 transform transition-transform duration-200 ease-in-out"
        >
          <NuxtLink :to="galeri.path" class="overflow-hidden rounded-3xl shadow-2xl">
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
              class="mb-4 aspect-video h-[250px] w-full rounded-3xl object-cover object-center transition-all duration-300 ease-in-out"
            />
            <h2 class="text-center text-sm font-bold">
              {{ galeri.title }}
            </h2>
          </NuxtLink>
        </motion.div>
      </div>
    </UContainer>
  </div>
</template>
