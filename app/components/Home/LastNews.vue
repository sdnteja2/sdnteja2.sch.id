<script setup lang="ts">
import { motion } from 'motion-v'

const { data: lastArtikel } = await useAsyncData('ArtikelTerkahir', () => {
  return queryCollection('artikel')
    .select('title', 'date', 'path', 'image')
    .order('date', 'DESC')
    .limit(3)
    .all()
})
const { data: lastBerita } = await useAsyncData('BeritaTerkahir', () => {
  return queryCollection('berita')
    .select('title', 'date', 'path')
    .order('date', 'DESC')
    .limit(3)
    .all()
})

const img = useImage()
</script>

<template>
  <div class="mt-12 w-full bg-sky-500 pb-28 pt-20 dark:bg-sky-900">
    <UContainer>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <div
          variant="soft"
          class="rounded-4xl md:top-22 bg-white p-6 py-8 md:sticky md:self-start dark:bg-sky-950"
        >
          <h2 class="mb-4 text-2xl font-bold md:text-3xl">
            Berita Terakhir
          </h2>
          <div v-for="(berita, index) in lastBerita" :key="berita.title">
            <motion.div
              :initial="{ opacity: 0, transform: 'translateY(10px)' }"
              :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
              :transition="{ delay: 0.1 * index }"
            >
              <NuxtLink :to="berita.path">
                <UCard class="mb-4 hover:ring-sky-500">
                  <p class="line-clamp-2">
                    {{ berita.title }}
                  </p>
                </UCard>
              </NuxtLink>
            </motion.div>
          </div>
        </div>
        <div variant="soft" class="py-8 md:py-0">
          <div class="flex flex-col space-y-4">
            <div v-for="(artikel, index) in lastArtikel" :key="artikel.title">
              <motion.div
                :initial="{ opacity: 0, transform: 'translateY(10px)' }"
                :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
                :transition="{ delay: 0.1 * index }"
              >
                <NuxtLink :to="artikel.path">
                  <UCard
                    variant="soft"
                    class="shadow-teja rounded-4xl h-full overflow-hidden bg-sky-50 transition-shadow duration-300 ease-in-out hover:shadow-none dark:bg-sky-950"
                  >
                    <div>
                      <NuxtImg
                        format="webp"
                        quality="70"
                        loading="lazy"
                        fetchpriority="low"
                        width="500"
                        height="300"
                        sizes="sm:100vw md:50vw lg:33vw"
                        densities="1x 2x"
                        :src="artikel.image.toString()"
                        :alt="artikel.title"
                        :placeholder="
                          img(`${artikel.image.toString()}`, { height: 10, format: 'webp', blur: 1, quality: 30 })
                        "
                        class="aspect-video h-75 w-full rounded-2xl bg-cover object-cover object-center"
                      />
                      <div class="mt-4">
                        <h2 class="line-clamp-2 text-xl font-bold">
                          {{ artikel?.title }}
                        </h2>

                        <div class="mt-4">
                          <UBadge>
                            {{
                              new Date(artikel.date).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            }}
                          </UBadge>
                        </div>
                      </div>
                    </div>
                  </UCard>
                </NuxtLink>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
