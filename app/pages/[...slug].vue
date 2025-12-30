<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

const route = useRoute()

// Menggunakan ufo untuk menghapus trailing slash secara aman
const normalizedPath = computed(() => withoutTrailingSlash(route.path))

// Gunakan normalizedPath.value untuk key dan query
const { data: page } = await useAsyncData(normalizedPath.value, () =>
  queryCollection('content').path(normalizedPath.value).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
