<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h2)))
</script>

<template>
  <h2 :id="props.id">
    <NuxtLink
      v-if="props.id && generate"
      class="dark:text-sky-500 border-b border-dotted  no-underline font-bold text-night-700 text-2xl"
      :to="`#${props.id}`"
    >
      <slot />
    </NuxtLink>
    <slot v-else />
  </h2>
</template>
