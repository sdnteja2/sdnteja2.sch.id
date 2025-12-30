<script lang="ts" setup>
import { Motion } from 'motion-v'

interface ReferensiItem {
  title: string
  link: string
}

const props = withDefaults(
  defineProps<{
    referensi?: ReferensiItem[]
  }>(),
  {
    referensi: () => [
      {
        title: 'Alamat Web',
        link: '#',
      },
    ],
  },
)
</script>

<template>
  <UContainer class="mx-auto mt-10 grid grid-cols-2 justify-center gap-4 md:grid-cols-4">
    <Motion
      v-for="(item, index) in props.referensi"
      :key="index"
      :initial="{ y: 10, opacity: 0 }"
      :in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :transition="{ delay: 0.1 * index }"
    >
      <NuxtLink
        :to="`${item.link}?ref=SDNTEJA2`"
        target="_blank"
        class="group transition-colors duration-300 ease-in-out"
      >
        <UCard
          class="shadow-teja flex h-full items-center justify-center rounded-[40px] bg-sky-50 transition-colors duration-300 ease-in-out group-hover:bg-sky-200 dark:bg-sky-900 dark:group-hover:bg-sky-700"
          variant="soft"
        >
          <p class="text-center font-bold">
            {{ item.title }}
          </p>
        </UCard>
      </NuxtLink>
    </Motion>
  </UContainer>
</template>
