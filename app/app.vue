<script setup lang="ts">
import { id } from '@nuxt/ui/locale'
</script>

<template>
  <NuxtRouteAnnouncer />
  <UApp :locale="id">
    <div>
      <UButton
        icon="i-teja-teja2"
        size="md"
        color="primary"
        variant="solid"
      >
        Button
      </UButton>
    </div>
    <UMain>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>
  </UApp>
</template>
