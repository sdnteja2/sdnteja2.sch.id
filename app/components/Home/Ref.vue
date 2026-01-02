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
  <UContainer class="mx-auto my-10 grid grid-cols-2 justify-center gap-4 md:grid-cols-4">
    <Motion
      v-for="(item, index) in props.referensi"
      :key="index"
      :initial="{ y: 10, opacity: 0 }"
      :in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :transition="{ delay: 0.1 * index }"
    >
      <UButton
        :to="`${item.link}?ref=SDNTEJA2`"
        target="_blank"
        color="neutral"
        variant="soft"
        size="lg"
        block
        class="shadow-teja h-full rounded-[40px] py-6 font-bold transition-colors duration-300 ease-in-out hover:bg-sky-200 dark:hover:bg-sky-700"
      >
        {{ item.title }}
      </UButton>
    </Motion>
  </UContainer>
</template>
