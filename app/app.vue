<script setup lang="ts">
import { id } from '@nuxt/ui/locale'
</script>

<template>
  <NuxtRouteAnnouncer />
  <UApp :locale="id">
    <UMain>
      <UiHeader />
      <UContainer class="my-24">
        <NuxtPage />
      </UContainer>
    </UMain>
  </UApp>
</template>
