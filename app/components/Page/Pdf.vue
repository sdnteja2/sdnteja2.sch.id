<script setup lang="ts">
defineProps<{
  src: string
  width?: string
  height?: string
}>()
</script>

<template>
  <div class="py-10">
    <PdfViewer :src="src" :width="width" :height="height" />
  </div>
</template>
