<script lang="ts" setup>
const route = useRoute()

const { data: beritaPage } = await useAsyncData(`berita-${route.path}`, () => {
  return queryCollection('berita').path(route.path).first()
})

useHead({
  title: beritaPage?.value?.title,
  titleTemplate: '%s %separator %siteName',
  templateParams: {
    separator: '|',
    siteName: 'SDN TEJA II',
  },
})
useSeoMeta({
  title: beritaPage?.value?.title,
  description: beritaPage?.value?.description,
  twitterTitle: beritaPage?.value?.title,
  twitterDescription: beritaPage?.value?.description,
})

defineOgImageComponent('OgImage', {
  page: 'Berita',
  title: beritaPage?.value?.title,
  description: beritaPage?.value?.description,
})
</script>

<template>
  <div>
    <UContainer>
      <div class="mx-auto max-w-4xl">
        <div class="mb-4">
          <UiBreadcrumb />
        </div>
        <div class="space-y-6 py-8">
          <h1 class="text-3xl font-bold md:text-4xl">
            {{ beritaPage?.title }}
          </h1>
          <p>
            {{ beritaPage?.description }}
          </p>
          <UBadge>
            {{
              beritaPage?.date
                ? new Date(beritaPage.date).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                : ''
            }}
          </UBadge>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="(tag, n) in beritaPage?.tags"
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
          <ContentRenderer v-if="beritaPage" :value="beritaPage" />
        </article>
      </div>
    </UContainer>
  </div>
</template>
