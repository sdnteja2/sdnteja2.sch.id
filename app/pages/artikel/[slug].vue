// app/pages/artikel/[slug].vue
<script lang="ts" setup>
const route = useRoute()

const { data: artikelPage } = await useAsyncData(`artikel-${route.path}`, () => {
  return queryCollection('artikel').path(route.path).first()
})
const { data: surroundArtikel } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('artikel', route.path, {
    fields: ['description'],
  })
})
useHead({
  title: artikelPage?.value?.title,
  titleTemplate: '%s %separator %siteName',
  templateParams: {
    separator: '|',
    siteName: 'SDN TEJA II',
  },
})
useSeoMeta({
  title: artikelPage?.value?.title,
  description: artikelPage?.value?.description,
  twitterTitle: artikelPage?.value?.title,
  twitterDescription: artikelPage?.value?.description,
})

defineOgImageComponent('OgImage', {
  page: 'Artikel',
  title: artikelPage?.value?.title,
  description: artikelPage?.value?.description,
})

useSchemaOrg([
  defineArticle({
    headline: artikelPage?.value?.title,
    description: artikelPage?.value?.description,
    // attaching an author when the identity is an organization
    author: {
      name: artikelPage?.value?.author,
    },
  }),
])
const tocOpen = ref(false) // atau true jika default terbuka

function handleMove() {
  if (window.innerWidth < 1024) {
    // asumsikan mobile < 1024px
    tocOpen.value = false
  }
}
</script>

<template>
  <UContainer>
    <UPage>
      <div class="mx-auto max-w-4xl">
        <div class="mb-4">
          <UiBreadcrumb />
        </div>

        <div class="space-y-6 py-8">
          <h1 class="text-3xl font-bold md:text-4xl">
            {{ artikelPage?.title }}
          </h1>
          <p>
            {{ artikelPage?.description }}
          </p>
          <div class="flex flex-wrap gap-2">
            <UBadge>
              {{
                artikelPage?.date
                  ? new Date(artikelPage.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  : ''
              }}
            </UBadge>
            <UBadge variant="outline">
              Baca: {{ artikelPage?.readingTime }} menit
            </UBadge>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="(tag, n) in artikelPage?.tags"
            :key="n"
            size="xs"
            color="neutral"
            rel="noopener"
            :to="`/tags/${tag}`"
          >
            {{ tag }}
          </UButton>
        </div>
        <USeparator class="py-6" />
        <article
          class="prose-img:w-full prose prose-night dark:prose-invert mx-auto max-w-4xl text-justify"
        >
          <UPageBody>
            <ContentRenderer class="prose-p:my-3 prose-p:leading-7 prose-p:text-pretty" v-if="artikelPage" :value="artikelPage" />
            <USeparator v-if="surroundArtikel?.filter(Boolean).length" />
            <div class="[&_a]:no-underline">
              <UContentSurround :surround="surroundArtikel as any" />
            </div>
          </UPageBody>
        </article>
      </div>
      <template v-if="artikelPage?.body?.toc?.links?.length" #right>
        <UContentToc
          v-model:open="tocOpen"
          :ui="{
            root: '!max-w-full !mx-0 !mb-2 !px-0 sm:!px-2 !top-18 !rounded-xl',
            container:
              '!pt-2 !pb-0 !px-2 sm:!pt-2 sm:!pb-2 lg:!py-8 !border-b !border-dashed !border-default lg:!border-0 !flex !flex-col',
          }"
          :links="artikelPage.body.toc.links.map((link) => ({ ...link, children: [] }))"
          title="Daftar Isi"
          @move="handleMove"
        />
      </template>
    </UPage>
  </UContainer>
</template>
