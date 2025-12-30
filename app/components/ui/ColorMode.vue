<script setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <ColorScheme placeholder="">
    <UButton
      v-if="!colorMode?.forced"
      :icon="isDark ? 'solar:moon-sleep-linear' : 'solar:sun-2-linear'"
      :aria-label="isDark ? 'Ubah ke mode terang' : 'Ubah ke mode gelap'"
      @click="isDark = !isDark"
    />

    <template #placeholder>
      <div class="size-8" />
    </template>
  </ColorScheme>
</template>
