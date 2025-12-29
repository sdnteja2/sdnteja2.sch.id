<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'id',
  },
})

useSeoMeta({
  title: 'Halaman tidak ditemukan',
  description: 'Maaf, halaman ini tidak dapat ditemukan.',
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('content'), {
  server: false,
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <UiHeader />

    <UError :error="error" />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
