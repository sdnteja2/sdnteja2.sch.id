<script lang="ts" setup>
defineProps<{
  src: string
  width?: string
  height?: string
}>()
</script>

<template>
  <div :style="{ width: width || '100%', height: height || '700px', margin: '0 auto' }">
    <iframe
      :src="`https://docs.google.com/gview?url=${encodeURIComponent(src)}&embedded=true`"
      :style="{ width: '100%', height: '100%', border: 'none' }"
      allowfullscreen
    />
  </div>
</template>
