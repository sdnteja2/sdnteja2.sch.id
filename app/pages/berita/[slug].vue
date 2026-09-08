<script setup lang="ts">
const route = useRoute()
await navigateTo(`/publikasi/berita/${route.params.slug}`, {
  redirectCode: 301
})
</script>

<template>
  <div />
</template>
