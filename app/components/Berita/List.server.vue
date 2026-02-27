<script setup lang="ts">
import { motion } from 'motion-v'

const { data: beritaPage } = await useAsyncData(
  'HalamanBerita',
  async () => {
    try {
      return await queryCollection('berita')
        .select('title', 'date', 'path')
        .order('date', 'DESC')
        .all()
    }
    catch (error) {
      console.error('Error fetching berita data:', error)
      return []
    }
  },
  {
    default: () => [],
  },
)

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
      <div class="mx-auto max-w-4xl">
        <div class="my-6 grid items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            v-for="(berita, index) in beritaTerkait"
            v-once
            :key="berita.title"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.1 * index }"
          >
            <UButton
              size="xl"
              class="rounded-4xl w-full bg-sky-800 px-8 md:py-4 dark:bg-sky-500"
              :to="`${berita.url}?ref=SDNTEJAII`"
              target="_blank"
            >
              <div class="flex w-full flex-col space-y-2">
                <div class="flex w-full flex-row justify-between">
                  <div>
                    {{ berita.title }}
                  </div>
                  <div>
                    <UIcon name="i-lucide-arrow-right" />
                  </div>
                </div>
              </div>
            </UButton>
          </motion.div>
        </div>
      </div>
      <div class="top-22 sticky z-50">
        <UiTags />
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div
          v-for="(berita, index) in beritaPage"
          :key="berita.title"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
        >
          <NuxtLink :to="berita.path">
            <UCard
              variant="soft"
              class="shadow-teja hover:ring-primary rounded-4xl h-full overflow-hidden bg-sky-50 p-2 transition-shadow duration-300 ease-in-out hover:shadow-none hover:ring dark:bg-sky-900"
            >
              <h2 class="text-lg font-bold">
                {{ berita?.title }}
              </h2>

              <div class="mt-4">
                <UBadge>
                  {{
                    new Date(berita.date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  }}
                </UBadge>
              </div>
            </UCard>
          </NuxtLink>
        </motion.div>
      </div>
    </UContainer>
  </div>
</template>
