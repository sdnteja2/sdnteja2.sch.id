<script setup lang="ts">
import { Motion } from 'motion-v'

const route = useRoute()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10 // Ubah sesuai kebutuhan

// Mengubah slug menjadi array jika itu adalah string yang dipisahkan koma
const filter = computed(() => {
  const slug = route.params.slug
  return Array.isArray(slug) ? slug : slug?.split(',')
})

// Reaktif untuk posts dan total posts
const allPosts = ref<PageTag[]>([]) // Semua data dari artikel dan berita
interface PageTag {
  path: string
  title: string
  description: string
  tags: string[]
  type: string
}

// Tipe data asli dari koleksi artikel dan berita
interface ArtikelCollectionItem {
  path: string
  title: string
  description: string
  tags: string[]
}

interface BeritaCollectionItem {
  path: string
  title: string
  description: string
  tags: string[]
}

const paginatedPosts = ref<PageTag[]>([]) // Data yang ditampilkan berdasarkan pagination
const totalPosts = ref(0) // Total jumlah item

// Fungsi untuk mengambil data dari kedua koleksi
async function fetchPosts() {
  // Tentukan tipe eksplisit untuk hasil Promise.all()
  const { data: postsData } = await useAsyncData(`posts-${route.path}`, () => {
    return Promise.all<ArtikelCollectionItem[] | BeritaCollectionItem[]>([
      queryCollection('artikel')
        .where('tags', 'LIKE', `%${filter.value?.join('%')}%`)
        .order('date', 'DESC')
        .all(),
      queryCollection('berita')
        .where('tags', 'LIKE', `%${filter.value?.join('%')}%`)
        .order('date', 'DESC')
        .all(),
    ])
  })

  // Gabungkan hasil dari artikel dan berita, lalu mapping ke tipe PageTag
  allPosts.value = [
    ...(postsData.value?.[0]?.map((item: ArtikelCollectionItem) => ({
      path: item.path,
      title: item.title,
      description: item.description,
      tags: item.tags,
      type: 'Artikel',
    })) || []),
    ...(postsData.value?.[1]?.map((item: BeritaCollectionItem) => ({
      path: item.path,
      title: item.title,
      description: item.description,
      tags: item.tags,
      type: 'Berita',
    })) || []),
  ]

  // Hitung total posts
  totalPosts.value = allPosts.value.length

  // Terapkan pagination
  applyPagination()
}

// Fungsi untuk menerapkan pagination
function applyPagination() {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  paginatedPosts.value = allPosts.value.slice(start, end)
}

// Load data saat halaman dimuat atau pagination berubah
watch(
  [currentPage, filter],
  async () => {
    if (allPosts.value.length === 0) {
      await fetchPosts()
    }
    applyPagination()
  },
  { immediate: true },
)

// SEO Meta
useSeoMeta({
  title: `Tag: ${filter.value?.join(', ')}`,
  description: 'Ini Halaman Tag',
})
</script>

<template>
  <UContainer class="py-8">
    <header class="page-heading">
      <div class="wrapper">
        <h1 class="text-3xl font-extrabold">
          Konten dengan Tag: {{ filter?.join(', ') }}
        </h1>
      </div>
    </header>

    <section class="page-section">
      <div class="top-22 sticky z-50">
        <UiTags />
      </div>

      <div class="mt-6">
        <div v-if="!paginatedPosts.length">
          <p class="text-center text-lg">
            Tidak ada artikel yang ditemukan.
          </p>
        </div>

        <div class="mb-4 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Motion
            v-for="pageTag in paginatedPosts"
            :key="pageTag.path"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.1 }"
          >
            <NuxtLink :to="`${pageTag.path}`">
              <UCard
                variant="soft"
                class="shadow-teja rounded-4xl h-full overflow-hidden bg-sky-50 transition-shadow duration-300 ease-in-out hover:shadow-none dark:bg-sky-900"
              >
                <UBadge class="mb-2">
                  {{ pageTag.type }}
                </UBadge>
                <header>
                  <h1 class="text-2xl font-semibold">
                    {{ pageTag.title }}
                  </h1>
                  <p class="line-clamp-2">
                    {{ pageTag.description }}
                  </p>

                  <ul class="mt-4 flex flex-wrap">
                    <li v-for="(tag, n) in pageTag.tags" :key="n" class="mb-2 mr-2">
                      <UButton size="xs" color="neutral" rel="noopener" :to="`/tags/${tag}`">
                        {{ tag }}
                      </UButton>
                    </li>
                  </ul>
                </header>
              </UCard>
            </NuxtLink>
          </Motion>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <UPagination
          v-model:page="currentPage"
          active-color="neutral"
          :total="totalPosts"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
        />
      </div>
    </section>
  </UContainer>
</template>
