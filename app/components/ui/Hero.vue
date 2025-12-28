<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Ultimate Vue UI library',
  },
  description: {
    type: String,
    default:
      'A Nuxt/Vue-integrated UI library providing a rich set of fully-styled, accessible and highly customizable components for building modern web applications.',
  },
  headline: {
    type: String,
    default: 'New release',
  },
  orientation: {
    type: String as () => 'horizontal' | 'vertical',
    default: 'horizontal',
  },
  img: {
    type: String,
    default: '/blocks/image4.png',
  },
})
const links = ref([
  {
    label: 'Get started',
    to: '/docs/getting-started',
    icon: 'i-lucide-square-play',
  },
  {
    label: 'Learn more',
    to: '/docs/getting-started/theme/design-system',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right',
  },
])
</script>

<template>
  <UPageHero
    :title="title"
    :description="description"
    :headline="headline"
    :orientation="orientation"
    :links="links"
  >
    <img
      :src="img"
      alt="App screenshot"
      class="rounded-lg shadow-2xl ring ring-default"
    >
  </UPageHero>
</template>
