<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import { nextTick } from 'vue'
import { useClipboard } from '@vueuse/core'

const messages: UIMessage[] = []
const input = ref('')
const isOpen = ref(false)

const toast = useToast()
const { copy } = useClipboard()

const chat = new Chat({
  messages,
  transport: new DefaultChatTransport({
    api: '/api/chatGemini'
  })
})

function handleSubmit(e?: Event) {
  e?.preventDefault()
  if (input.value.trim()) {
    chat.sendMessage({ text: input.value })
    input.value = ''
  }
}

function copyMessage(message: UIMessage) {
  const text = getTextFromMessage(message)
  copy(text)
  toast.add({
    title: 'Tersalin!',
    description: 'Jawaban telah disalin ke clipboard',
    icon: 'i-heroicons-clipboard-document-check',
    color: 'success',
  })
}
</script>

<template>
  <UPopover
    v-model:open="isOpen"
    :content="{
      side: 'top',
      align: 'end',
      sideOffset: 12,
    }"
    :ui="{
      content: 'w-[400px] max-w-[calc(100vw-3rem)] p-0 overflow-hidden',
    }"
  >
    <!-- Floating Chat Button (Google Blue) -->
        <!-- class="fixed bottom-6 right-24 z-50 shadow-lg hover:scale-110 transition-transform bg-blue-600 hover:bg-blue-700 text-white" -->
    <UButton
      icon="i-heroicons-sparkles"
     class="fixed bottom-6 right-6 z-50 shadow-lg hover:scale-110 transition-transform"
      size="lg"
      aria-label="Buka chat dengan Gemini AI"
    />

    <!-- Chat Popup Content -->
    <template #content="{ close }">
      <div class="flex flex-col h-[600px] max-h-[80vh]">
        <!-- Header -->
        <div class="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/10">
          <div class="flex items-center gap-3">
            <div class="relative">
              <UAvatar
                icon="i-heroicons-sparkles"
                size="sm"
                class="bg-blue-600 text-white"
              />
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
            </div>
            <div>
              <h3 class="text-sm font-semibold">
                JADU Gemini
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Powered by Google Gemini
              </p>
            </div>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            size="xs"
            aria-label="Tutup chat"
            @click="close"
          />
        </div>

        <!-- Chat Messages Area -->
        <div class="flex-1 overflow-hidden">
          <div
            v-if="chat.messages.length > 0"
            class="h-full overflow-y-auto px-4 py-4"
          >
            <UChatMessages
              :messages="chat.messages"
              :status="chat.status"
              :should-scroll-to-bottom="true"
              :should-auto-scroll="true"
              :user="{
                avatar: { icon: 'i-heroicons-user', color: 'primary' },
                variant: 'soft',
                side: 'right',
              }"
              :assistant="{
                avatar: { icon: 'i-heroicons-sparkles' },
                variant: 'outline',
                side: 'left',
              }"
            >
              <template #content="{ message }">
                <MDC
                  :value="getTextFromMessage(message)"
                  :cache-key="message.id"
                  class="prose prose-sm prose-sky dark:prose-invert max-w-none prose-p:my-1 prose-p:leading-relaxed"
                />
              </template>

              <template #actions="{ message }">
                <UButton
                  v-if="message.role === 'assistant'"
                  icon="i-heroicons-clipboard-document"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="Salin jawaban"
                  @click="copyMessage(message)"
                />
              </template>
            </UChatMessages>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="h-full flex flex-col items-center justify-center py-8 text-center px-4"
          >
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 class="text-base font-semibold mb-1">
              Hai! Saya JADU Gemini 👋
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Powered by Google Gemini
            </p>
            <div class="space-y-2 text-xs w-full max-w-xs">
              <button
                class="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="async () => { 
                  input = 'Berita terbaru apa?'; 
                  await nextTick();
                  handleSubmit(); 
                }"
              >
                💡 "Berita terbaru apa?"
              </button>
              <button
                class="w-full text-left px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="async () => { 
                  input = 'Siapa guru kelas 5?'; 
                  await nextTick();
                  handleSubmit(); 
                }"
              >
                👨‍🏫 "Siapa guru kelas 5?"
              </button>
            </div>
          </div>
        </div>

        <!-- Input Footer -->
        <div class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <UChatPrompt
            v-model="input"
            :error="chat.error"
            variant="outline"
            placeholder="Ketik pesan Anda..."
            @submit="handleSubmit"
          >
            <UChatPromptSubmit
              :status="chat.status"
              color="primary"
              @stop="chat.stop()"
            />
          </UChatPrompt>
        </div>
      </div>
    </template>
  </UPopover>
</template>
