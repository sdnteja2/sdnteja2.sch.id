<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('buku').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Buku tidak ditemukan' })
}
</script>

<template>
  <div v-if="page" class="py-20">
    <UContainer>
      <div class="mb-6">
        <UButton to="/buku" variant="ghost" icon="i-heroicons-arrow-left-20-solid">
          Kembali ke Perpustakaan
        </UButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Info Panel -->
        <div class="lg:col-span-1">
          <div class="ring rounded-lg p-6 dark:bg-sky-900 ring-night-200 dark:ring-night-800 sticky top-20 space-y-4">
            <!-- Book Icon -->
            <div class="aspect-video bg-linear-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
              <svg class="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4.75C2 3.784 2.784 3 3.75 3h12.5c.966 0 1.75.784 1.75 1.75v12.5A1.75 1.75 0 0116.25 19H3.75A1.75 1.75 0 012 17.25V4.75zM3.5 4.75v12.5c0 .138.112.25.25.25H6v-13H3.75c-.138 0-.25.112-.25.25zm7 0v13h5.75c.138 0 .25-.112.25-.25V4.75c0-.138-.112-.25-.25-.25H10.5z" />
              </svg>
            </div>

            <!-- Book Details -->
            <div>
              <h1 class="text-xl font-bold mb-4">
                {{ page.title }}
              </h1>
            </div>

            <div class="space-y-3 text-sm">
              <div class="border-t border-night-200 dark:border-night-700 pt-3">
                <p class="text-gray-600 dark:text-gray-400 mb-1">
                  Kelas
                </p>
                <p class="font-semibold">
                  {{ page.kelas }}
                </p>
              </div>

              <div class="border-t border-night-200 dark:border-night-700 pt-3">
                <p class="text-gray-600 dark:text-gray-400 mb-1">
                  Pelajaran
                </p>
                <p class="font-semibold">
                  {{ page.pelajaran }}
                </p>
              </div>

              <div class="border-t border-night-200 dark:border-night-700 pt-3">
                <p class="text-gray-600 dark:text-gray-400 mb-1">
                  Tipe Buku
                </p>
                <p class="font-semibold">
                  {{ page.tipe }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- PDF Viewer -->
        <div class="lg:col-span-3">
          <div class="ring rounded-lg p-4 dark:bg-sky-900 ring-night-200 dark:ring-night-800 overflow-hidden">
            <ClientOnly>
              <PdfViewer
                :src="page.link"
                width="100%"
                height="700px"
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
