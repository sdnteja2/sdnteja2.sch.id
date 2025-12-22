<script setup lang="ts">
import { id } from '@nuxt/ui/locale'

useHead({
  meta: [
    { name: 'theme-color', content: '#208bee', media: '(prefers-color-scheme: dark)' },
    { name: 'theme-color', content: '#208bee', media: '(prefers-color-scheme: light)' },
    { name: 'msapplication-TileColor', content: '#208bee' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ],
})

const { visitors } = useVisitors()
</script>

<template>
  <div>
    <UApp :locale="id">
      <NuxtLoadingIndicator color="var(--ui-primary)" />
      <NuxtRouteAnnouncer />
      <UiNav />

      <ClientOnly>
        <LazyUiChat />
      </ClientOnly>

      <div class="py-22  md:py-26">
        <NuxtPage />
      </div>
      <UiFooter />
    </UApp>
    <div class="fixed bottom-4 left-4">
      <UChip :text=" visitors " size="3xl">
        <UButton icon="i-lucide-user" color="neutral" variant="subtle" />
      </UChip>
    </div>
    <div class="utility">
      <ClientOnly>
        <LazyGoogleTranslate />
      </ClientOnly>
    </div>
  </div>
</template>

<!-- <style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style> -->
