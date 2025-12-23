<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

// Query navigation otomatis dari content
const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('content')
})

// Transform navigation menjadi format NavigationMenuItem
const items = computed<NavigationMenuItem[]>(() => {
  if (!navigation.value) return []
  
  return navigation.value.map(item => ({
    label: item.title || 'Untitled',
    to: item.path
  }))
})
</script>

<template>
  <UHeader>
    <template #title>
      Teja II
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>

