<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`artikel-${route.path}`, () =>
  queryCollection('artikel').path(route.path).first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Artikel tidak ditemukan',
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`artikel-surround-${route.path}`, () =>
  queryCollectionItemSurroundings('artikel', route.path)
)

const prevItem = computed(() => surround.value?.[0])
const nextItem = computed(() => surround.value?.[1])

const formatDate = (val: string | Date | undefined) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

useSeoMeta({
  title: `${page.value?.title} - Artikel SD Negeri Teja II`,
  description: page.value?.description,
  ogTitle: `${page.value?.title} - SD Negeri Teja II`,
  ogDescription: page.value?.description
})

defineOgImage('OgImage', {
  page: 'Artikel',
  title: page.value?.title,
  description: page.value?.description
})

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const tocLinks = computed<TocLink[]>(() => {
  const sanitize = (items: TocLink[]): TocLink[] => {
    return (items || [])
      .filter(item => Boolean(item && item.id && item.text?.trim()))
      .map(item => ({
        ...item,
        children: item.children ? sanitize(item.children) : undefined
      }))
  }
  return sanitize((page.value?.body?.toc?.links as TocLink[]) || [])
})

const isTocOpen = ref(false)

const nuxtApp = useNuxtApp()

const triggerScrollspy = () => {
  nextTick(() => {
    setTimeout(() => {
      nuxtApp.callHook('page:transition:finish')
      nuxtApp.callHook('page:loading:end')
    }, 200)
  })
}

onMounted(() => {
  triggerScrollspy()
})

watch(
  () => route.path,
  () => {
    triggerScrollspy()
  }
)
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer>
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-sm text-muted mb-6">
        <NuxtLink
          to="/"
          class="hover:text-highlighted transition-colors"
        >
          Home
        </NuxtLink>
        <span>/</span>
        <NuxtLink
          to="/publikasi"
          class="hover:text-highlighted transition-colors"
        >
          Publikasi
        </NuxtLink>
        <span>/</span>
        <NuxtLink
          to="/publikasi/artikel"
          class="hover:text-highlighted transition-colors"
        >
          Artikel
        </NuxtLink>
        <span>/</span>
        <span class="text-highlighted font-medium truncate max-w-[200px] sm:max-w-xs">
          {{ page?.title }}
        </span>
      </div>

      <UPage
        v-if="page"
        :ui="{
          root: 'flex flex-col lg:grid lg:grid-cols-12 lg:gap-8',
          center: 'lg:col-span-9',
          right: 'lg:col-span-3 order-first lg:order-last'
        }"
      >
        <UPageBody class="mt-0 pb-12 space-y-8 min-w-0">
          <!-- Header -->
          <header class="space-y-4">
            <div class="flex items-center gap-2 flex-wrap">
              <UBadge
                v-for="tag in (page?.tags || [])"
                :key="tag"
                color="primary"
                variant="subtle"
                size="sm"
              >
                {{ tag }}
              </UBadge>

              <span
                v-if="page?.date"
                class="text-xs text-muted flex items-center gap-1.5"
              >
                <UIcon
                  name="i-lucide-calendar"
                  class="size-3.5 text-muted"
                />
                {{ formatDate(page.date) }}
              </span>

              <span
                v-if="page?.author"
                class="text-xs text-muted flex items-center gap-1.5"
              >
                <UIcon
                  name="i-lucide-user"
                  class="size-3.5 text-muted"
                />
                {{ page.author }}
              </span>

              <span
                v-if="page?.readingTime"
                class="text-xs text-muted flex items-center gap-1.5"
              >
                <UIcon
                  name="i-lucide-clock"
                  class="size-3.5 text-muted"
                />
                {{ page.readingTime }} menit baca
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-highlighted leading-tight">
              {{ page?.title }}
            </h1>

            <p
              v-if="page?.description"
              class="text-base sm:text-lg text-muted leading-relaxed"
            >
              {{ page.description }}
            </p>
          </header>

          <!-- Featured Image -->
          <div
            v-if="page?.image"
            class="rounded-2xl overflow-hidden border border-default bg-muted max-h-[460px] shadow-sm"
          >
            <img
              :src="page.image"
              :alt="page.title"
              class="w-full h-full object-cover"
            >
          </div>

          <USeparator />

          <!-- Markdown Content Renderer -->
          <article class="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed">
            <ContentRenderer
              v-if="page"
              :value="page"
            />
          </article>

          <USeparator />

          <!-- Mobile Share Section -->
          <div class="lg:hidden p-4 rounded-xl border border-default bg-muted/20">
            <ArticleShare
              :title="page?.title"
              :description="page?.description"
            />
          </div>

          <USeparator class="lg:hidden" />

          <!-- Navigation Prev / Next -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <NuxtLink
              v-if="prevItem"
              :to="prevItem.path"
              class="group block p-4 rounded-xl border border-default hover:border-primary/50 transition-colors"
            >
              <div class="text-xs text-muted flex items-center gap-1 mb-1">
                <UIcon
                  name="i-lucide-arrow-left"
                  class="size-3.5 group-hover:-translate-x-1 transition-transform"
                />
                Artikel Sebelumnya
              </div>
              <div class="text-sm font-semibold text-highlighted group-hover:text-primary transition-colors line-clamp-2">
                {{ prevItem.title }}
              </div>
            </NuxtLink>
            <div
              v-else
              class="hidden sm:block"
            />

            <NuxtLink
              v-if="nextItem"
              :to="nextItem.path"
              class="group block p-4 rounded-xl border border-default hover:border-primary/50 transition-colors sm:text-right"
            >
              <div class="text-xs text-muted flex items-center justify-end gap-1 mb-1">
                Artikel Selanjutnya
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-3.5 group-hover:translate-x-1 transition-transform"
                />
              </div>
              <div class="text-sm font-semibold text-highlighted group-hover:text-primary transition-colors line-clamp-2">
                {{ nextItem.title }}
              </div>
            </NuxtLink>
          </div>

          <!-- Back to List Button -->
          <div class="text-center pt-4">
            <UButton
              to="/publikasi/artikel"
              label="Kembali ke Daftar Artikel"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="subtle"
            />
          </div>
        </UPageBody>

        <!-- Right Slot: ContentToc matching Nuxt UI documentation layout -->
        <template
          v-if="tocLinks.length"
          #right
        >
          <UContentToc
            v-model:open="isTocOpen"
            highlight
            highlight-color="primary"
            highlight-variant="circuit"
            title="Daftar Isi"
            :links="tocLinks"
            :ui="{
              content: 'max-h-60 sm:max-h-72 lg:max-h-[calc(100vh-14rem)] overflow-y-auto'
            }"
            @move="isTocOpen = false"
          >
            <template #bottom>
              <ArticleShare
                :title="page?.title"
                :description="page?.description"
                compact
              />
            </template>
          </UContentToc>
        </template>
      </UPage>
    </UContainer>
  </div>
</template>
