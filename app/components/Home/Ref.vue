<script lang="ts" setup>
import { Motion } from 'motion-v'

interface ReferensiItem {
  title: string
  link: string
}

const props = withDefaults(defineProps<{
  referensi?: ReferensiItem[]
}>(), {
  referensi: () => [
    {
      title: 'Alamat Web',
      link: '#',
    },
  ],
})
</script>

<template>
  <UContainer class="grid gap-4 mt-10  grid-cols-2 md:grid-cols-4  justify-center mx-auto">
    <Motion
      v-for="(item, index) in props.referensi"
      :key="index"
      :initial="{ y: 10, opacity: 0 }"
      :in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :transition="{ delay: 0.1 * index }"
    >
      <NuxtLink :to="`${item.link}?ref=SDNTEJA2`" target="_blank" class="group transition-colors ease-in-out duration-300   ">
        <UCard class="rounded-[40px]  h-full items-center justify-center flex bg-sky-50 shadow-teja group-hover:bg-sky-200 dark:group-hover:bg-sky-700 transition-colors ease-in-out duration-300    dark:bg-sky-900" variant="soft">
          <p class="text-center  font-bold">
            {{ item.title }}
          </p>
        </UCard>
      </NuxtLink>
    </Motion>
  </UContainer>
</template>
