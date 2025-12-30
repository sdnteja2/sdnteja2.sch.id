<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'

const route = useRoute()

// Normalisasi path untuk menghindari masalah trailing slash
const normalizedPath = computed(() => withoutTrailingSlash(route.path))

// Gunakan properti watch agar data di-fetch ulang saat path berubah
const { data: page } = await useAsyncData(
  `content-${normalizedPath.value}`,
  () => queryCollection('content').path(normalizedPath.value).first(),
  { watch: [normalizedPath] },
)

// Penanganan jika halaman tidak ditemukan
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Halaman tidak ditemukan',
    fatal: true,
  })
}

// Meta SEO yang reaktif menggunakan data dari Content
useSeoMeta({
  title: () => page.value?.seo?.title || page.value?.title,
  ogTitle: () => page.value?.seo?.title || page.value?.title,
  description: () => page.value?.seo?.description || page.value?.description,
  ogDescription: () => page.value?.seo?.description || page.value?.description,
})
defineOgImageComponent('OgImage', {
  title: page.value.title,
  description: page.value.description,
})
</script>

<template>
  <main>
    <ContentRenderer v-if="page" :value="page" />
  </main>
</template>
