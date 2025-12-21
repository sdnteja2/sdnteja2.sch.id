<script setup lang="ts">
import { Motion } from 'motion-v'

// Pagination state
const itemsPerPage = 8
const route = useRoute()
const router = useRouter()

const currentPage = ref(Number(route.query.page) || 1)
// Update query parameter saat `currentPage` berubah
watch(currentPage, (newPage) => {
  router.replace({
    query: {
      ...route.query,
      page: newPage.toString(),
    },
  })
})
const { data: artikelPage } = await useAsyncData('HalamanArtikel', () => {
  return queryCollection('artikel')
    .select('title', 'date', 'path', 'image', 'author')
    .order('date', 'DESC')
    .all()
})
const totalItems = computed(() => artikelPage.value?.length ?? 0)

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return artikelPage.value?.slice(start, end) ?? []
})

const img = useImage()
</script>

<template>
  <div class=" ">
    <UContainer>
      <div class="sticky top-22 z-50 ">
        <UiTags />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Motion
          v-for="(artikel, index) in paginatedBlogs"
          :key="artikel.title"
          v-memo="[artikel.title, artikel.image, artikel.date, currentPage]"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"

          :transition="{ delay: 0.1 * index }"
        >
          <NuxtLink :to="artikel.path">
            <UCard variant="soft" class="bg-night-50 hover:shadow-none hover:ring hover:ring-primary transition-shadow ease-in-out duration-300  shadow-teja dark:bg-night-900 h-full rounded-4xl overflow-hidden">
              <div>
                <NuxtImg
                  format="webp"
                  quality="75"
                  height="300"
                  width="450"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 450px"
                  densities="1x 2x"
                  :src="artikel.image.toString()"
                  :alt="artikel.title"
                  class="rounded-2xl object-cover object-center w-full h-[300px] bg-cover aspect-video"
                  :placeholder="img(artikel.image.toString(), { h: 15, w: 25, f: 'webp', blur: 5, q: 10 })"
                  loading="lazy"
                  fetchpriority="low"
                />
                <div class="mt-4   ">
                  <h2 class="text-xl font-bold line-clamp-2">
                    {{ artikel?.title }}
                  </h2>

                  <div class="mt-4   ">
                    <UBadge>{{ new Date(artikel.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</UBadge>
                  </div>
                  <div class="mt-4   ">
                    <UBadge variant="outline">
                      Oleh: {{ artikel?.author }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </Motion>
      </div>
      <div class="flex justify-center mt-8">
        <UPagination
          v-model:page="currentPage"
          show-edges
          :items-per-page="itemsPerPage"
          color="primary"
          :sibling-count="1"
          :total="totalItems"
          variant="soft"
        />
      </div>
    </UContainer>
  </div>
</template>
