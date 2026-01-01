<script lang="ts" setup>
const route = useRoute()
const slug = route.params.slug as string
const { getFromLocalStorage, saveToLocalStorage } = useBukuCache(slug)

// Query data buku berdasarkan path saat ini
const { data: bukuPage } = await useAsyncData(`buku-${route.path}`, async () => {
  // Coba ambil dari cache jika di client
  if (import.meta.client) {
    const cached = getFromLocalStorage()
    if (cached) return cached
  }

  // Jika tidak ada cache, query ke Nuxt Content
  const data = await queryCollection('buku').path(route.path).first()
  
  // Simpan ke cache jika data ditemukan
  if (data) {
    saveToLocalStorage(data as any)
  }
  
  return data
})

useHead({
  title: bukuPage.value?.title || 'Detail Buku',
})

// Iframe refresher logic
const iframeKey = ref(0)
const refreshIframe = () => {
    iframeKey.value++
}
</script>

<template>
  <div class="py-12">
    <UContainer>
      
        <!-- Debugging: Cek apakah data masuk -->
        <div v-if="!bukuPage" class="p-4 bg-red-100 text-red-700 rounded mb-4">
            Data Buku Tidak Ditemukan untuk path: {{ route.path }}
        </div>
        
      <div v-else>
          <!-- Header Informasi Buku -->
          <div class="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <UBadge color="primary" variant="soft">Kelas {{ bukuPage.kelas }}</UBadge>
                        <UBadge :color="bukuPage.tipe === 'Buku Guru' ? 'warning' : 'success'" variant="subtle">{{ bukuPage.tipe }}</UBadge>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ bukuPage.title }}</h1>
                    <p class="text-gray-500 font-medium flex items-center gap-2">
                        <UIcon name="i-ph-book-open-text-duotone" />
                        Mata Pelajaran: {{ bukuPage.pelajaran }}
                    </p>
                </div>
                
                <div class="flex gap-2">
                    <UButton :to="bukuPage.link" target="_blank" icon="i-ph-download-duotone" label="Download/Buka Asli" />
                </div>
            </div>
          </div>

          <!-- PDF Viewer -->
          <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 min-h-[600px]">
               <div class="bg-gray-200 dark:bg-gray-900 px-4 py-2 flex items-center justify-between text-sm text-gray-500">
                   <span>Membaca: {{ bukuPage.title }}</span>
                   <div class="flex gap-2">
                        <button @click="refreshIframe" class="hover:text-primary-500 flex items-center gap-1">
                            <UIcon name="i-ph-arrows-clockwise" /> Reload
                        </button>
                   </div>
               </div>
               <div class="w-full h-[800px] relative">
                 <NuxtPdfKit 
                 :src="bukuPage.link"
                 :title="bukuPage.title"
                 :keywords="bukuPage.pelajaran"
                  />
               </div>
               <!-- <div class="w-full h-[800px] relative">
                   <object
                        :key="iframeKey"
                        :data="bukuPage.link"
                        type="application/pdf"
                        class="w-full h-full"
                   >
                        <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                            <UIcon name="i-ph-file-pdf-duotone" class="w-16 h-16 text-gray-400" />
                            <p class="text-center px-4">
                                Browser Anda tidak mendukung preview PDF langsung atau file diblokir oleh server sumber.<br>
                                Silakan download untuk membaca.
                            </p>
                            <UButton :to="bukuPage.link" target="_blank" icon="i-ph-download-duotone" label="Download PDF" />
                        </div>
                   </object>
               </div> -->
          </div>
      </div>

    </UContainer>
  </div>
</template>
