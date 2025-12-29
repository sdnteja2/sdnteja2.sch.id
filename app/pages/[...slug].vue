<script setup lang="ts">
const route = useRoute()

// Normalisasi path: hapus trailing slash jika ada, kecuali untuk root '/'
// Ini mencegah error mismatch antara '/siswa/' dan '/siswa'
const normalizedPath = computed(() => {
  return route.path !== '/' && route.path.endsWith('/')
    ? route.path.slice(0, -1)
    : route.path
})

// Gunakan normalizedPath.value untuk key useAsyncData dan query
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
