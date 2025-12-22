<script setup lang="ts">
import { Motion } from 'motion-v'

const { data: guruTeja } = await useAsyncData('gurus', async () => {
  try {
    return await queryCollection('guru').all()
  }
  catch (error) {
    console.error('Error fetching guru data:', error)
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
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Motion
          v-for="(guru, index) in guruTeja"
          :key="guru.nama"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          class="transition-transform duration-200 ease-in-out transform hover:scale-98"
        >
          <NuxtLink :to="guru.path" class="group">
            <UCard variant="soft" class="bg-sky-50 shadow-teja dark:bg-sky-900 h-full rounded-4xl">
              <div class="w-full aspect-square rounded-3xl overflow-hidden mb-4 bg-top bg-gray-100">
                <NuxtImg
                  :src="guru.foto"
                  :alt="`Foto ${guru.nama} - Guru SDN Teja 2`"
                  format="webp"
                  quality="80"
                  :width="300"
                  :height="300"
                  sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 225px"
                  :placeholder="img(guru.foto, { h: 10, f: 'webp', blur: 2, q: 30 })"
                  loading="lazy"
                  fetchpriority="low"
                  densities="1x 2x"
                  class="w-full h-full object-cover object-center transition-all duration-300 ease-in-out"
                />
              </div>
              <h2 class=" font-bold text-sm text-center">
                {{ guru.nama }}
              </h2>
            </UCard>
          </NuxtLink>
        </Motion>
      </div>
    </UContainer>
  </div>
</template>
