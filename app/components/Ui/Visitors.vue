<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const visitors = ref(0)

// Only run on mounted (client-side only)
const { open } = useWebSocket('/ws/visitors', {
  immediate: false,
  autoReconnect: true,
  async onMessage(_ws: WebSocket, event: MessageEvent) {
    // Parse the JSON response
    const data = JSON.parse(typeof event.data === 'string' ? event.data : await event.data.text())
    visitors.value = data.count || 0
  },
})

// We open the connection when the component is mounted
onMounted(() => {
  open()
})
</script>

<template>
  <div class="fixed bottom-4 left-4 z-50 flex items-center gap-2">
    <UTooltip text="Pengunjung Online">
      <UChip :text="visitors" size="3xl">
        <UButton icon="hugeicons:user-status" color="neutral" variant="subtle" />
      </UChip>
    </UTooltip>
  </div>
</template>
