<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { ref } from 'vue'

const { messages, input, handleSubmit, isLoading, stop, error, reload } = useChat()
const isOpen = ref(false)
</script>

<template>
  <UContainer>
    <UPopover v-model:open="isOpen">
      <UButton
        icon="i-heroicons-chat-bubble-left-right"
        color="neutral"
        variant="subtle"
        size="lg"
        class="fixed bottom-4 right-4 z-50"
        aria-label="Buka chat dengan JADU AI"
      />

      <template #content>
        <UCard class="w-96 h-[500px] flex flex-col shadow-xl overflow-y-scroll">
          <!-- Header -->
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UAvatar
                  icon="i-heroicons-cpu-chip"
                  size="sm"
                  color="primary"
                />
                <div>
                  <h3 class="font-semibold text-sm">
                    JADU AI
                  </h3>
                  <UBadge label="Online" size="xs" variant="outline" color="success" />
                </div>
              </div>
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="ghost"
                size="xs"
                aria-label="Tutup chat"
                @click="isOpen = false"
              />
            </div>
          </template>

          <!-- Messages Area -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
            <div v-if="messages.length === 0" class="text-center text-gray-500 text-sm py-8">
              Mulai percakapan dengan Jadu AI
            </div>

            <div v-for="m in messages" :key="m.id" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
              <div class="flex items-start gap-2 max-w-[80%]">
                <UAvatar
                  v-if="m.role === 'assistant'"
                  icon="i-heroicons-cpu-chip"
                  size="xs"
                  color="primary"
                />

                <div
                  class="px-3 py-2 rounded-lg text-sm"
                  :class="m.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-800 border rounded-bl-sm'"
                >
                  <div v-for="(part, idx) in m.parts" :key="idx">
                    <span v-if="part.type === 'text'">{{ part.text }}</span>
                  </div>
                </div>

                <UAvatar
                  v-if="m.role === 'user'"
                  icon="i-heroicons-user"
                  size="xs"
                  color="neutral"
                />
              </div>
            </div>

            <!-- Loading indicator -->
            <div v-if="isLoading" class="flex justify-start">
              <div class="flex items-center gap-2">
                <UAvatar icon="i-heroicons-cpu-chip" size="xs" color="primary" />
                <div class="bg-white dark:bg-gray-800 border rounded-lg px-3 py-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s" />
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="px-4 py-2 bg-sky-50 dark:bg-sky-900/20 border-t border-sky-200">
            <div class="flex items-center justify-between">
              <span class="text-sky-600 text-sm">{{ error.message || 'Terjadi error' }}</span>
              <UButton
                label="Coba Lagi"
                color="primary"
                variant="ghost"
                size="xs"
                aria-label="Coba kirim ulang pesan"
                @click="reload"
              />
            </div>
          </div>

          <!-- Input Area -->
          <template #footer>
            <form class="flex items-center gap-2" @submit="handleSubmit">
              <UInput
                v-model="input"
                placeholder="Ketik pesan Anda..."
                class="flex-1"
                :disabled="isLoading"
                size="sm"
                aria-label="Ketik pesan untuk JADU AI"
              />

              <UButton
                v-if="isLoading"
                icon="i-heroicons-stop"
                color="primary"
                variant="soft"
                size="sm"
                type="button"
                aria-label="Hentikan pemrosesan"
                @click="stop"
              />

              <UButton
                v-else
                icon="i-heroicons-paper-airplane"
                color="primary"
                variant="solid"
                size="sm"
                type="submit"
                :disabled="!input.trim()"
                aria-label="Kirim pesan"
              />
            </form>
          </template>
        </UCard>
      </template>
    </UPopover>
  </UContainer>
</template>

<style scoped>
.scrollable {
  scrollbar-width: thin;
  scrollbar-color: rgb(156 163 175) transparent;
}

.scrollable::-webkit-scrollbar {
  width: 4px;
}

.scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: rgb(156 163 175);
  border-radius: 2px;
}
</style>
