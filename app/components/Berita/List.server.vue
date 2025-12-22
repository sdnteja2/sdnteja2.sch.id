<script setup lang="ts">
import { Motion } from 'motion-v'

const { data: beritaPage } = await useAsyncData('HalamanBerita', () => {
  return queryCollection('berita')
    .select('title', 'date', 'path')
    .order('date', 'DESC')
    .all()
})

const beritaTerkait = [
  {
    url: 'https://www.dikdasmen.go.id/pencarian/berita',
    title: 'Kemdikbud',
    icon: 'https://res.cloudinary.com/dyy24w5kl/image/upload/v1730119603/logo/tutwuri_fdqfmn.png',
  },
  {
    url: 'https://disdik.jabarprov.go.id/informasi/berita',
    title: 'Disdik Jabar',
    icon: 'https://res.cloudinary.com/dyy24w5kl/image/upload/v1730119602/logo/logo-disdik-jabar_wqzwwa.png',
  },
  {
    url: 'https://disdik.majalengkakab.go.id/artikel/semua',
    title: 'Disdik Majalengka',
    icon: 'https://res.cloudinary.com/dyy24w5kl/image/upload/v1730119602/logo/logo-disdik-mjl_qjnalj.png',
  },

]
</script>

<template>
  <div class=" ">
    <UContainer>
      <div class="max-w-4xl  mx-auto ">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 items-center my-6 gap-4">
          <Motion
            v-for="(berita, index) in beritaTerkait"
            v-once
            :key="berita.title"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.1 * index }"
          >
            <UButton

              size="xl"
              class="w-full rounded-4xl bg-sky-800 dark:bg-sky-500 px-8 md:py-4"
              :to="`${berita.url}?ref=SDNTEJAII`"
              target="_blank"
            >
              <div class="flex flex-col w-full   space-y-2">
                <div class="flex w-full flex-row justify-between  ">
                  <div>
                    {{ berita.title }}
                  </div>
                  <div>
                    <UIcon name="i-lucide-arrow-right" />
                  </div>
                </div>
              </div>
            </UButton>
          </Motion>
        </div>
      </div>
      <div class="sticky top-22 z-50 ">
        <UiTags />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Motion
          v-for="(berita, index) in beritaPage"
          :key="berita.title"
          v-memo="[berita.title, berita.date, berita.path]"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
        >
          <NuxtLink :to="berita.path">
            <UCard variant="soft" class="bg-sky-50 shadow-teja hover:shadow-none hover:ring hover:ring-primary transition-shadow ease-in-out duration-300  dark:bg-sky-900 h-full rounded-4xl p-2 overflow-hidden">
              <h2 class="text-lg font-bold">
                {{ berita?.title }}
              </h2>

              <div class="mt-4   ">
                <UBadge>{{ new Date(berita.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</UBadge>
              </div>
            </UCard>
          </NuxtLink>
        </Motion>
      </div>
    </UContainer>
  </div>
</template>
