// server/api/chatGemini.ts - AI Chat with Google Gemini via Gemini CLI Provider
import { streamText } from 'ai'
import { createGeminiProvider } from 'ai-sdk-provider-gemini-cli'
import { aggregateContentData } from '../utils/content-aggregator'

export default defineEventHandler(async (event) => {
  try {
    const { messages } = await readBody(event)
    console.log('[ChatGemini API] Received messages:', messages.length)

    // Aggregate all content data from Nuxt Content
    const contentData = await aggregateContentData(event)

    // Create comprehensive system prompt with embedded data
    const systemPrompt = `Kamu adalah JADU AI, asisten virtual resmi SDN Teja 2.

Tugasmu adalah membantu siswa, orang tua, guru, dan pengunjung website mendapatkan informasi tentang SDN Teja 2.

# DATA WEBSITE SDN TEJA II

${contentData}

---

# INSTRUKSI PENTING

## Aturan Menjawab:
1. **HANYA gunakan data yang BENAR-BENAR ada di atas**
2. **JANGAN membuat nama, tanggal, atau informasi yang tidak ada**
3. Jika data tidak tersedia atau tidak jelas, katakan dengan jujur
4. Jawab dalam bahasa Indonesia yang ramah, informatif, dan profesional
5. Format jawaban dengan markdown yang rapi (headers, lists, bold, dll)

## Identitas:
- Nama: JADU AI (Gemini)
- Peran: Asisten Virtual SDN Teja II
- Lokasi Sekolah: Kecamatan Rajagaluh, Kabupaten Majalengka, Jawa Barat
- Website: https://sdnteja2.sch.id

## Cara Menjawab Pertanyaan:
- **Tentang Guru**: Cari di section "Data Guru SDN Teja II"
- **Tentang Berita**: Cari di section "Berita Terbaru"
- **Tentang Artikel**: Cari di section "Artikel Pendidikan"
- **Tentang Kegiatan**: Cari di section "Kegiatan Sekolah"
- **Tentang Informasi Sekolah**: Cari di section "Informasi SDN Teja II"
- **Tentang Media**: Cari di section "Media Pembelajaran"
- **Tentang Buku**: Cari di section "Buku Pembelajaran"

## Jika Pertanyaan Di Luar Data:
Jika pertanyaan tidak berkaitan dengan SDN Teja II atau data yang tersedia, jawab:
"Maaf, saya hanya dapat menjawab pertanyaan seputar SDN Teja II. Apakah ada yang bisa saya bantu tentang sekolah kami?"

Selamat membantu! 🎓`

    // Transform messages from frontend format to AI SDK format
    const transformedMessages = messages.map((msg: any) => {
      // Handle messages with 'parts' array (from @ai-sdk/vue Chat component)
      if (msg.parts && Array.isArray(msg.parts)) {
        const textContent = msg.parts
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('\n')

        return {
          role: msg.role,
          content: textContent,
        }
      }

      // Handle messages with 'content' already (standard format)
      if (msg.content) {
        return {
          role: msg.role,
          content: msg.content,
        }
      }

      // Fallback: return as-is
      return msg
    })

    console.log('[ChatGemini API] Transformed messages:', transformedMessages.length)

    // Prepare messages with system prompt
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...transformedMessages,
    ]

    // Create Gemini CLI provider instance with API key authentication
    const config = useRuntimeConfig(event)
    console.log('[ChatGemini API] Creating Gemini provider instance...')

    const gemini = createGeminiProvider({
      authType: 'api-key',
      apiKey: config.gemini.apiKey,
    })

    console.log('[ChatGemini API] Gemini provider instance created')

    // Stream AI response
    console.log('[ChatGemini API] Calling streamText...')
    const result = streamText({
      model: gemini('gemini-2.5-flash'),
      messages: fullMessages,
    })
    console.log('[ChatGemini API] streamText called successfully')

    console.log('[ChatGemini API] Returning UI Message Stream response...')

    // Use AI SDK's UI message stream response for @ai-sdk/vue Chat class compatibility
    return result.toUIMessageStreamResponse()
  }
  catch (error) {
    console.error('[ChatGemini API] Error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process Gemini chat request',
      data: error,
    })
  }
})
