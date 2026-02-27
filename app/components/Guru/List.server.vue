<script setup lang="ts">
import { motion } from 'motion-v'

const { data: guruTeja } = await useAsyncData(
  'gurus',
  async () => {
    try {
      return await queryCollection('guru').all()
    }
    catch (error) {
      console.error('Error fetching guru data:', error)
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
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <motion.div
          v-for="(guru, index) in guruTeja"
          :key="guru.nama"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          class="hover:scale-98 transform transition-transform duration-200 ease-in-out"
        >
          <NuxtLink :to="guru.path" class="group">
            <UCard variant="soft" class="shadow-teja rounded-4xl h-full bg-sky-50 dark:bg-sky-900">
              <div class="mb-4 aspect-square w-full overflow-hidden rounded-3xl bg-gray-100 bg-top">
                <NuxtImg
                  :src="guru.foto"
                  :alt="`Foto ${guru.nama} - Guru SDN Teja 2`"
                  format="webp"
                  quality="80"
                  :width="300"
                  :height="300"
                  sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 225px"
                  :placeholder="img(guru.foto, { height: 10, format: 'webp', blur: 2, quality: 30 })"
                  loading="lazy"
                  fetchpriority="low"
                  densities="1x 2x"
                  class="h-full w-full object-cover object-center transition-all duration-300 ease-in-out"
                />
              </div>
              <h2 class="text-center text-sm font-bold">
                {{ guru.nama }}
              </h2>
            </UCard>
          </NuxtLink>
        </motion.div>
      </div>
    </UContainer>
  </div>
</template>
