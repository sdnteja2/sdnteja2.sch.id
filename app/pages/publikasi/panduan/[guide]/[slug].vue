<script setup lang="ts">
const route = useRoute()
const guideParam = computed(() => String(route.params.guide || ''))

const { data: page } = await useAsyncData(`panduan-${route.path}`, () =>
  queryCollection('panduan').path(route.path).first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Bab panduan tidak ditemukan',
    fatal: true
  })
}

const { data: surround } = await useAsyncData(`panduan-surround-${route.path}`, () =>
  queryCollectionItemSurroundings('panduan', route.path)
)

const { data: rawChapters } = await useAsyncData(`panduan-toc-${guideParam.value}`, () =>
  queryCollection('panduan').where('guide', '=', guideParam.value).all()
)

const allChapters = computed(() => {
  return [...(rawChapters.value || [])].sort((a, b) => {
    const chapA = a.chapter ?? Number(a.stem?.match(/(?:^|\/)(\d+)\./)?.[1] ?? 999)
    const chapB = b.chapter ?? Number(b.stem?.match(/(?:^|\/)(\d+)\./)?.[1] ?? 999)
    return chapA - chapB
  })
})

useSeoMeta({
  title: `${page.value?.title} - ${page.value?.guideTitle || 'Panduan'}`,
  description: page.value?.description,
  ogTitle: `${page.value?.title} - ${page.value?.guideTitle || 'Panduan'} | SDN Teja II`,
  ogDescription: page.value?.description
})

defineOgImage('OgImage', {
  page: 'Panduan',
  title: page.value?.title,
  description: page.value?.description
})
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <div class="flex items-center flex-wrap gap-2 text-sm text-muted mb-8">
      <NuxtLink
        to="/"
        class="hover:text-highlighted transition-colors"
      >Home</NuxtLink>
      <span>/</span>
      <NuxtLink
        to="/publikasi"
        class="hover:text-highlighted transition-colors"
      >Publikasi</NuxtLink>
      <span>/</span>
      <NuxtLink
        to="/publikasi/panduan"
        class="hover:text-highlighted transition-colors"
      >Panduan</NuxtLink>
      <span>/</span>
      <NuxtLink
        :to="`/publikasi/panduan/${guideParam}`"
        class="hover:text-highlighted transition-colors truncate max-w-[200px]"
      >
        {{ page?.guideTitle || "Panduan" }}
      </NuxtLink>
      <span>/</span>
      <span class="text-highlighted font-medium truncate max-w-[240px]">{{ page?.title }}</span>
    </div>

    <UPage>
      <template #left>
        <UPageAside>
          <div class="mb-3">
            <p class="text-[11px] font-semibold text-primary uppercase tracking-wide">
              Daftar Bab Panduan
            </p>
            <h3 class="text-sm font-bold text-highlighted mt-0.5">
              {{ page?.guideTitle }}
            </h3>
          </div>

          <nav class="space-y-0.5">
            <NuxtLink
              v-for="(chap, idx) in allChapters"
              :key="chap.path"
              :to="chap.path"
              :class="[
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors',
                route.path === chap.path
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted hover:text-highlighted hover:bg-elevated'
              ]"
            >
              <span
                :class="[
                  'text-xs font-mono w-5 shrink-0 text-center',
                  route.path === chap.path ? 'text-primary' : 'text-dimmed'
                ]"
              >
                {{ idx + 1 }}
              </span>
              <span class="truncate leading-snug">{{ chap.title }}</span>
            </NuxtLink>
          </nav>

          <USeparator class="my-3" />

          <UButton
            :to="`/publikasi/panduan/${guideParam}`"
            label="Ikhtisar Panduan"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            size="xs"
            block
          />
        </UPageAside>
      </template>

      <div class="space-y-3 pb-6 border-b border-default mb-8">
        <div class="flex items-center gap-2">
          <UBadge
            v-if="page?.fase"
            color="primary"
            variant="subtle"
            size="sm"
          >
            {{ page.fase }}
          </UBadge>
          <UBadge
            v-if="page?.readTime"
            color="neutral"
            variant="subtle"
            size="sm"
            icon="i-lucide-clock"
          >
            {{ page.readTime }}
          </UBadge>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-highlighted">
          {{ page?.title }}
        </h1>

        <p class="text-muted text-base sm:text-lg leading-relaxed">
          {{ page?.description }}
        </p>
      </div>

      <article class="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-highlighted prose-a:text-primary hover:prose-a:underline prose-table:text-sm">
        <ContentRenderer
          v-if="page"
          :value="page"
        />
      </article>

      <UContentSurround
        :surround="surround"
        class="mt-10"
      />
    </UPage>
  </UContainer>
</template>
