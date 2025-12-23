<script setup lang="ts">
import { id } from '@nuxt/ui/locale'
</script>

<template>
  <NuxtRouteAnnouncer />
  <UApp :locale="id">
    <ClientOnly>
      <LazyUiVisitors />
    </ClientOnly>
    <UiHeader />
    <UMain class="py-22  md:py-26">
      <div>
        <NuxtPage />
      </div>
    </UMain>
  </UApp>
</template>
