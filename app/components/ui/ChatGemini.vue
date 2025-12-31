<script setup lang="ts">
import { nextTick } from 'vue'
import { useClipboard } from '@vueuse/core'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  parts?: { type: string; text: string }[]
}

const messages = ref<ChatMessage[]>([])
const input = ref('')
const isOpen = ref(false)
const status = ref<'ready' | 'streaming' | 'error'>('ready')
const error = ref<Error | null>(null)

const toast = useToast()
const { copy } = useClipboard()

// Get text from message
function getTextFromMessage(message: ChatMessage): string {
  if (message.parts && message.parts.length > 0) {
    return message.parts
      .filter(p => p.type === 'text')
      .map(p => p.text)
      .join('\n')
  }
  return message.content || ''
}

// Send message and stream response
async function sendMessage(text: string) {
  if (!text.trim()) return

  // Add user message
  const userMessage: ChatMessage = {
    id: `user-${Date.now()}`,
    role: 'user',
    content: text,
    parts: [{ type: 'text', text }]
  }
  messages.value.push(userMessage)

  // Create assistant message placeholder
  const assistantMessage: ChatMessage = {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: '',
    parts: [{ type: 'text', text: '' }]
  }
  messages.value.push(assistantMessage)

  status.value = 'streaming'
  error.value = null

  try {
    // Format messages for API
    const apiMessages = messages.value.slice(0, -1).map(m => ({
      role: m.role,
      parts: m.parts || [{ type: 'text', text: m.content }]
    }))

    const response = await fetch('/api/chatGemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (!line.trim()) continue

        // Parse stream format: prefix:json
        if (line.startsWith('a:')) {
          // Text chunk
          try {
            const data = JSON.parse(line.slice(2))
            if (data.text) {
              fullText += data.text
              // Update message content
              const lastMsg = messages.value[messages.value.length - 1]
              if (lastMsg && lastMsg.role === 'assistant') {
                lastMsg.content = fullText
                lastMsg.parts = [{ type: 'text', text: fullText }]
              }
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    status.value = 'ready'
  } catch (err) {
    console.error('[ChatGemini] Error:', err)
    error.value = err as Error
    status.value = 'error'
    // Remove empty assistant message on error
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'assistant' && !messages.value[messages.value.length - 1].content) {
      messages.value.pop()
    }
  }
}

function handleSubmit(e?: Event) {
  e?.preventDefault()
  if (input.value.trim() && status.value !== 'streaming') {
    const text = input.value
    input.value = ''
    sendMessage(text)
  }
}

function stopGeneration() {
  // For now, just set status to ready
  status.value = 'ready'
}

function copyMessage(message: ChatMessage) {
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
    <!-- Floating Chat Button -->
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
            v-if="messages.length > 0"
            class="h-full overflow-y-auto px-4 py-4 space-y-4"
          >
            <div
              v-for="message in messages"
              :key="message.id"
              :class="[
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              ]"
            >
              <!-- Avatar -->
              <UAvatar
                :icon="message.role === 'user' ? 'i-heroicons-user' : 'i-heroicons-sparkles'"
                :color="message.role === 'user' ? 'primary' : 'neutral'"
                size="sm"
              />
              
              <!-- Message Content -->
              <div
                :class="[
                  'max-w-[80%] rounded-lg px-3 py-2',
                  message.role === 'user' 
                    ? 'bg-primary-100 dark:bg-primary-900/30' 
                    : 'bg-gray-100 dark:bg-gray-800'
                ]"
              >
                <MDC
                  :value="getTextFromMessage(message)"
                  :cache-key="message.id"
                  class="prose prose-sm prose-sky dark:prose-invert max-w-none prose-p:my-1 prose-p:leading-relaxed"
                />
                
                <!-- Copy Button for Assistant -->
                <div v-if="message.role === 'assistant' && message.content" class="mt-2 flex justify-end">
                  <UButton
                    icon="i-heroicons-clipboard-document"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    aria-label="Salin jawaban"
                    @click="copyMessage(message)"
                  />
                </div>
              </div>
            </div>
            
            <!-- Streaming indicator -->
            <div v-if="status === 'streaming'" class="flex gap-3">
              <UAvatar icon="i-heroicons-sparkles" color="neutral" size="sm" />
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
              </div>
            </div>
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
          <form class="flex gap-2" @submit.prevent="handleSubmit">
            <UInput
              v-model="input"
              class="flex-1"
              variant="outline"
              placeholder="Ketik pesan Anda..."
              :disabled="status === 'streaming'"
            />
            <UButton
              v-if="status === 'streaming'"
              icon="i-heroicons-stop"
              color="neutral"
              variant="soft"
              type="button"
              aria-label="Hentikan"
              @click="stopGeneration"
            />
            <UButton
              v-else
              icon="i-heroicons-paper-airplane"
              color="primary"
              type="submit"
              :disabled="!input.trim()"
              aria-label="Kirim"
            />
          </form>
          <p v-if="error" class="text-xs text-red-500 mt-2">
            {{ error.message }}
          </p>
        </div>
      </div>
    </template>
  </UPopover>
</template>
