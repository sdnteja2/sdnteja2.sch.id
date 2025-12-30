<script setup lang="ts">
interface FasilitasItem {
  title?: string
  image: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    fasilitas?: FasilitasItem[]
  }>(),
  {
    fasilitas: () => [
      {
        title: 'Fasilitas 1',
        image: 'https://picsum.photos/468/468?random=1',
      },
    ],
  },
)
</script>

<template>
  <UContainer class="py-20">
    <UCarousel
      v-slot="{ item }"
      arrows
      loop
      wheel-gestures
      dots
      :items="props.fasilitas"
      :ui="{
        item: 'basis-1/1 md:basis-1/2',
        controls: 'absolute -bottom-6 inset-x-15',
        dots: '-top-7',
      }"
    >
      <div class="relative">
        <NuxtImg
          :title="item.title"
          :alt="item.title"
          format="webp"
          quality="75"
          loading="lazy"
          fetchpriority="low"
          :src="item.image"
          height="500"
          width="auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          class="rounded-4xl aspect-video h-auto w-full object-cover object-center"
        />
        <p
          v-if="item.title"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-md bg-white/80 px-3 py-1 font-medium dark:bg-sky-800/80"
        >
          {{ item.title }}
        </p>
        <p
          v-if="item.description"
          class="absolute bottom-4 right-4 rounded-md bg-white/80 px-3 py-1 text-sm dark:bg-sky-800/80"
        >
          {{ item.description }}
        </p>
      </div>
    </UCarousel>
  </UContainer>
</template>
