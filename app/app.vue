<script setup lang="ts">
import { id } from '@nuxt/ui/locale'
</script>

<template>
  <NuxtLoadingIndicator color="var(--ui-primary)" />
  <NuxtRouteAnnouncer />
  <UApp :locale="id">
    <UMain>
      <UiNav />
      <div class="py-22  md:py-26">
        <NuxtPage />
      </div>
      <UiFooter />
    </UMain>
    <div class="utility">
      <ClientOnly>
        <LazyGoogleTranslate />
      </ClientOnly>
    </div>
  </UApp>
</template>
