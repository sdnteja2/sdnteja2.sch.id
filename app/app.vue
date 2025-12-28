<script setup lang="ts">
import { id } from '@nuxt/ui/locale'
</script>

<template>
  <NuxtRouteAnnouncer />
  <UApp :locale="id">
    <UMain>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>
  </UApp>
</template>
