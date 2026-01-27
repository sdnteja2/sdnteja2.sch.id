// app/components/Artikel/List.server.vue
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
const { data: artikelPage } = await useAsyncData(
  'HalamanArtikel',
  async () => {
    try {
      return await queryCollection('artikel')
        .select('title', 'date', 'path', 'image', 'author', 'readingTime')
        .order('date', 'DESC')
        .all()
    }
    catch (error) {
      console.error('Error fetching artikel data:', error)
      return []
    }
  },
  {
    default: () => [],
  },
)
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
      <div class="top-22 sticky z-50">
        <UiTags />
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Motion
          v-for="(artikel, index) in paginatedBlogs"
          :key="artikel.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
        >
          <NuxtLink :to="artikel.path">
            <UCard
              variant="soft"
              class="hover:ring-primary shadow-teja rounded-4xl h-full overflow-hidden bg-sky-50 transition-shadow duration-300 ease-in-out hover:shadow-none hover:ring dark:bg-sky-900"
            >
              <div>
                <NuxtImg
                  format="webp"
                  quality="75"
                  :height="300"
                  :width="450"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 450px"
                  densities="1x 2x"
                  :src="artikel.image.toString()"
                  :alt="artikel.title"
                  class="aspect-video h-75 w-full rounded-2xl bg-cover object-cover object-center"
                  :placeholder="
                    img(artikel.image.toString(), {
                      height: 15,
                      width: 25,
                      format: 'webp',
                      blur: 5,
                      quality: 10,
                    })
                  "
                  loading="lazy"
                  fetchpriority="low"
                />
                <div class="mt-4">
                  <h2 class="line-clamp-2 text-xl font-bold">
                    {{ artikel?.title }}
                  </h2>

                  <div class="mt-4 flex items-center space-x-2">
                    <UBadge>
                      {{
                        new Date(artikel.date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      }}
                    </UBadge>
                    <UBadge variant="outline">
                      Baca: {{ artikel?.readingTime }} menit
                    </UBadge>
                  </div>
                  <div class="mt-4">
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
      <div class="mt-8 flex justify-center">
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
