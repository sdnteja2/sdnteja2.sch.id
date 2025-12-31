import { streamText, convertToModelMessages } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

export default defineLazyEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiKey = config.googleGenerativeAiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Google Generative AI API key is not configured.'
    })
  }

  const google = createGoogleGenerativeAI({
    apiKey
  })

  return defineEventHandler(async (event) => {
    // Read messages from request body as UIMessage[]
    const { messages } = await readBody(event)

    // Aggregate content data for context (RAG)
    const contentData = await aggregateContentData(event)

    // Define system prompt
    const systemPrompt = `KAMU ADALAH JADU AI (ASISTEN SDN TEJA 2).
WAJIB MENJAWAB HANYA BERDASARKAN DATA DI BAWAH INI:

<KONTEKS_DATA>
${contentData}
</KONTEKS_DATA>

---
ATURAN KERJA:
1. Jawab selalu dalam BAHASA INDONESIA yang ramah dan profesional.
2. Jika ditanya berita/artikel/kegiatan/guru, berikan informasi yang ada di dalam <KONTEKS_DATA> di atas.
3. JANGAN pernah berkata "Saya tidak punya akses informasi real-time" atau "sebagai AI saya tidak tahu". Gunakan saja data yang tersedia.
4. Jika data benar-benar tidak ada di konteks, katakan: "Maaf, informasi tersebut belum tersedia di website kami."
5. Gunakan format Markdown yang rapi (list/bold/headers).

IDENTITAS:
- Nama: JADU AI
- Sekolah: SDN Teja II, Rajagaluh, Majalengka.
- Website: https://sdnteja2.sch.id
---
Tugasmu dimulai sekarang. Bantu pengguna dengan data sekolah yang tersedia.`

    // Stream AI response using Gemini 1.5 Flash
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
    })

    // Returns a stream compatible with the Chat class and DefaultChatTransport
    return result.toUIMessageStreamResponse()
  })
  
})
