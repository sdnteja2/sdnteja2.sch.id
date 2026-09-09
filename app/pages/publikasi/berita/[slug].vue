<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`berita-${route.path}`, () =>
  queryCollection('berita').path(route.path).first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Warta berita tidak ditemukan',
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`berita-surround-${route.path}`, () =>
  queryCollectionItemSurroundings('berita', route.path)
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
  title: `${page.value?.title} - Warta SD Negeri Teja II`,
  description: page.value?.description,
  ogTitle: `${page.value?.title} - SD Negeri Teja II`,
  ogDescription: page.value?.description
})

defineOgImage('OgImage', {
  page: 'Berita',
  title: page.value?.title,
  description: page.value?.description
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="max-w-4xl space-y-8">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-sm text-muted">
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
          to="/publikasi/berita"
          class="hover:text-highlighted transition-colors"
        >
          Berita
        </NuxtLink>
        <span>/</span>
        <span class="text-highlighted font-medium truncate max-w-[200px] sm:max-w-xs">
          {{ page?.title }}
        </span>
      </div>

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

          <span class="text-xs text-muted flex items-center gap-1.5">
            <UIcon
              name="i-lucide-user"
              class="size-3.5 text-muted"
            />
            {{ page?.author || 'Humas SDN Teja II' }}
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

      <USeparator />

      <!-- Markdown Content Renderer -->
      <article class="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed">
        <ContentRenderer
          v-if="page"
          :value="page"
        />
      </article>

      <USeparator />

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
            Warta Sebelumnya
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
            Warta Selanjutnya
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
          to="/publikasi/berita"
          label="Kembali ke Daftar Berita"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="subtle"
        />
      </div>
    </UContainer>
  </div>
</template>
