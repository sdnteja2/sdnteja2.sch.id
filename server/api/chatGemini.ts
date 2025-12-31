// // server/api/chatGemini.ts - AI Chat with Google Gemini via @google/genai
// import { GoogleGenAI } from '@google/genai'
// import { aggregateContentData } from '../utils/content-aggregator'

// export default defineEventHandler(async (event) => {
//   try {
//     const { messages } = await readBody(event)
//     console.log('[ChatGemini API] Received messages:', messages.length)

//     // Aggregate all content data from Nuxt Content
//     const contentData = await aggregateContentData(event)

//     // Create comprehensive system prompt with embedded data
//     const systemPrompt = `Kamu adalah JADU AI, asisten virtual resmi SDN Teja 2.

// Tugasmu adalah membantu siswa, orang tua, guru, dan pengunjung website mendapatkan informasi tentang SDN Teja 2.

// # DATA WEBSITE SDN TEJA II

// ${contentData}

// ---

// # INSTRUKSI PENTING

// ## Aturan Menjawab:
// 1. **HANYA gunakan data yang BENAR-BENAR ada di atas**
// 2. **JANGAN membuat nama, tanggal, atau informasi yang tidak ada**
// 3. Jika data tidak tersedia atau tidak jelas, katakan dengan jujur
// 4. Jawab dalam bahasa Indonesia yang ramah, informatif, dan profesional
// 5. Format jawaban dengan markdown yang rapi (headers, lists, bold, dll)

// ## Identitas:
// - Nama: JADU AI (Gemini)
// - Peran: Asisten Virtual SDN Teja II
// - Lokasi Sekolah: Kecamatan Rajagaluh, Kabupaten Majalengka, Jawa Barat
// - Website: https://sdnteja2.sch.id

// ## Cara Menjawab Pertanyaan:
// - **Tentang Guru**: Cari di section "Data Guru SDN Teja II"
// - **Tentang Berita**: Cari di section "Berita Terbaru"
// - **Tentang Artikel**: Cari di section "Artikel Pendidikan"
// - **Tentang Kegiatan**: Cari di section "Kegiatan Sekolah"
// - **Tentang Informasi Sekolah**: Cari di section "Informasi SDN Teja II"
// - **Tentang Media**: Cari di section "Media Pembelajaran"
// - **Tentang Buku**: Cari di section "Buku Pembelajaran"

// ## Jika Pertanyaan Di Luar Data:
// Jika pertanyaan tidak berkaitan dengan SDN Teja II atau data yang tersedia, jawab:
// "Maaf, saya hanya dapat menjawab pertanyaan seputar SDN Teja II. Apakah ada yang bisa saya bantu tentang sekolah kami?"

// Selamat membantu! 🎓`

//     // Transform messages to Gemini format
//     const history = messages.slice(0, -1).map((msg: any) => {
//       const textContent = msg.parts
//         ? msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n')
//         : msg.content || ''

//       return {
//         role: msg.role === 'assistant' ? 'model' : 'user',
//         parts: [{ text: textContent }],
//       }
//     })

//     const lastMessage = messages[messages.length - 1]
//     const lastMessageText = lastMessage.parts
//       ? lastMessage.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n')
//       : lastMessage.content || ''

//     console.log('[ChatGemini API] History length:', history.length)
//     console.log('[ChatGemini API] Last message:', lastMessageText.substring(0, 50))

//     // Create Gemini client
//     const config = useRuntimeConfig(event)
//     const ai = new GoogleGenAI({
//       apiKey: config.gemini.apiKey,
//     })

//     // Create chat session
//     const chat = ai.chats.create({
//       model: 'gemini-2.0-flash',
//       history,
//       config: {
//         systemInstruction: systemPrompt,
//       },
//     })

//     // Stream response
//     const streamResult = await chat.sendMessageStream({
//       message: lastMessageText,
//     })

//     // Generate unique message ID
//     const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

//     // Create UI Message Stream compatible with @ai-sdk/vue
//     const encoder = new TextEncoder()
//     const stream = new ReadableStream({
//       async start(controller) {
//         try {
//           // Send message start
//           controller.enqueue(encoder.encode(`g:${JSON.stringify({ messageId })}\n`))

//           for await (const chunk of streamResult) {
//             const text = chunk.text
//             if (text) {
//               // Send text delta in UI message stream format
//               controller.enqueue(encoder.encode(`a:${JSON.stringify({ text })}\n`))
//             }
//           }

//           // Send finish
//           controller.enqueue(encoder.encode(`e:${JSON.stringify({ finishReason: 'stop' })}\n`))
//           controller.close()
//         }
//         catch (error) {
//           console.error('[ChatGemini Stream] Error:', error)
//           controller.error(error)
//         }
//       },
//     })

//     return new Response(stream, {
//       headers: {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive',
//       },
//     })
//   }
//   catch (error) {
//     console.error('[ChatGemini API] Error:', error)
//     throw createError({
//       statusCode: 500,
//       message: 'Failed to process Gemini chat request',
//       data: error,
//     })
//   }
// })

