<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    compact?: boolean
  }>(),
  {
    title: '',
    description: '',
    compact: false
  }
)

const networks = [
  { network: 'whatsapp', name: 'WhatsApp' },
  { network: 'facebook', name: 'Facebook' },
  { network: 'x', name: 'X / Twitter' },
  { network: 'telegram', name: 'Telegram' },
  { network: 'linkedin', name: 'LinkedIn' }
] as const
</script>

<template>
  <div
    class="space-y-2.5"
    :class="{ 'pt-4 border-t border-dashed border-default': compact }"
  >
    <div class="flex items-center gap-1.5 text-xs font-semibold text-highlighted">
      <UIcon
        name="i-lucide-share-2"
        class="size-4 text-primary"
      />
      <span>Bagikan Artikel</span>
    </div>

    <div class="flex items-center gap-2 flex-wrap">
      <SocialShare
        v-for="item in networks"
        :key="item.network"
        :network="item.network"
        :title="props.title"
        :styled="true"
        :label="false"
        class="size-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
        :aria-label="`Bagikan ke ${item.name}`"
      />
    </div>
  </div>
</template>
