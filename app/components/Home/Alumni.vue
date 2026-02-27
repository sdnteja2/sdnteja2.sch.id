<script setup lang="ts">
import { motion } from 'motion-v'

interface AlumniItem {
  foto: string
  nama?: string
  job?: string
}

const props = withDefaults(
  defineProps<{
    alumni?: AlumniItem[]
  }>(),
  {
    alumni: () => [
      {
        foto: 'https://picsum.photos/468/468?random=1',
        nama: 'John Doe',
        job: 'Software Engineer',
      },
    ],
  },
)
</script>

<template>
  <div class="py-8">
    <UContainer>
      <div class="py-8">
        <h2 class="text-center text-5xl font-bold md:text-6xl">
          Alumni
        </h2>
      </div>
      <motion.div
        :initial="{ y: 10, opacity: 0 }"
        :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 }"
      >
        <UCard variant="soft" class="rounded-4xl shadow-teja bg-sky-50 md:py-8 dark:bg-sky-900">
          <UCarousel
            v-slot="{ item }"
            arrows
            :ui="{
              controls: 'absolute bottom-1/2 inset-x-10',
              item: 'md:basis-1/3',
            }"
            loop
            wheel-gestures
            :items="props.alumni"
            class="p-4"
          >
            <div class="flex flex-col items-center justify-center p-8">
              <NuxtImg
                format="webp"
                quality="70"
                loading="lazy"
                fetchpriority="low"
                :alt="item.nama"
                :title="item.nama"
                :src="item.foto"
                width="234"
                height="234"
                class="rounded-4xl mb-4 shadow-lg"
              />
              <h3 class="text-lg font-bold">
                {{ item.nama }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ item.job }}
              </p>
            </div>
          </UCarousel>
        </UCard>
      </motion.div>
    </UContainer>
  </div>
</template>
