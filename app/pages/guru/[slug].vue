<script lang="ts" setup>
const route = useRoute()

const { data: guruPage } = await useAsyncData(`guru-${route.path}`, () => {
  return queryCollection('guru').path(route.path).first()
})

useHead({
  title: guruPage?.value?.lengkap,
  titleTemplate: '%s %separator %siteName',
  templateParams: {
    separator: '|',
    siteName: 'SDN TEJA II',
  },
})
useSeoMeta({
  title: guruPage?.value?.lengkap,
  description: guruPage?.value?.catatan,
  twitterTitle: guruPage?.value?.lengkap,
  twitterDescription: guruPage?.value?.catatan,
})

defineOgImageComponent('User', {
  page: 'Guru',
  title: guruPage?.value?.lengkap,
  description: guruPage?.value?.catatan,
  image: guruPage?.value?.foto,
  kelas: guruPage?.value?.kelas,
  pembina: guruPage?.value?.jabatan,
})
const img = useImage()

useSchemaOrg([
  defineArticle({
    name: guruPage?.value?.lengkap,
    image: guruPage?.value?.foto,
    jobTitle: guruPage?.value?.jabatan,
    worksFor: guruPage?.value?.kelas,
    description: guruPage?.value?.catatan,
  }),
])
</script>

<template>
  <div>
    <UContainer>
      <div class="mb-4">
        <UiBreadcrumb />
      </div>
      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <!-- Main Profile Card -->
        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 0 }"
          class="md:col-span-1 md:row-span-2"
        >
          <UCard
            variant="soft"
            class="rounded-3xl bg-sky-50 shadow-teja dark:bg-sky-900"
          >
            <div class="flex flex-col items-center justify-center p-4">
              <NuxtImg
                :src="guruPage?.foto"
                :alt="guruPage?.lengkap"
                :title="guruPage?.lengkap"
                format="webp"
                quality="80"
                loading="eager"
                fetchpriority="high"
                :height="400"
                :width="300"
                :placeholder="img(`${guruPage?.foto}`, { h: 10, w: 5, f: 'webp', blur: 2, q: 50 })"
                class="rounded-lg mb-4 h-full w-auto shadow-md bg-cover bg-center object-cover "
              />
              <h1 class="text-lg md:text-xl font-bold mt-2">
                {{ guruPage?.lengkap }}
              </h1>
              <UBadge color="primary" variant="solid" class="mt-1">
                {{ guruPage?.kelas }}
              </UBadge>
              <div v-if="guruPage?.sosial && guruPage.sosial.length" class="flex space-x-2 mt-4">
                <UButton
                  v-for="(social, index) in guruPage.sosial"
                  :key="index"
                  :to="social.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="social.alt"
                  :icon="social.icon"
                />
              </div>
            </div>
          </UCard>
        </Motion>

        <!-- Bio Card -->
        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 1 }"
          class="md:col-span-2"
        >
          <UCard
            variant="soft"
            class="rounded-3xl bg-sky-50 shadow-teja dark:bg-sky-900"
          >
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2 flex items-center">
                <UIcon name="solar:notebook-linear" class="mr-2" />
                Quote
              </h3>
              <p class="italic text-lg">
                {{ guruPage?.catatan ? `"${guruPage.catatan}"` : 'Tidak ada catatan' }}
              </p>
            </div>
          </UCard>
        </Motion>

        <!-- Details Card -->
        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 2 }"
          class="md:col-span-2"
        >
          <UCard
            variant="soft"
            class="rounded-3xl bg-sky-50 shadow-teja dark:bg-sky-900"
          >
            <div class="p-4">
              <h3 class="text-xl font-bold mb-3 flex items-center">
                <UIcon name="solar:user-id-linear" class="mr-2" />
                Informasi Guru
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="bg-white dark:bg-sky-800 rounded-xl p-3 shadow-sm">
                  <p class="font-semibold text-sm text-gray-500 dark:text-gray-400">
                    Jabatan
                  </p>
                  <p class="font-bold">
                    {{ guruPage?.jabatan || '-' }}
                  </p>
                </div>

                <div class="bg-white dark:bg-sky-800 rounded-xl p-3 shadow-sm">
                  <p class="font-semibold text-sm text-gray-500 dark:text-gray-400">
                    Pendidikan
                  </p>
                  <p class="font-bold">
                    {{ guruPage?.pendidikan || '-' }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </Motion>

        <!-- Achievement Card -->
        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 3 }"
          class="md:col-span-3"
        >
          <UCard
            data-aos="fade-up" data-aos-delay="300"
            variant="soft"
            class="rounded-3xl bg-sky-50 shadow-teja dark:bg-sky-900"
          >
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2 flex items-center">
                <UIcon name="solar:stars-minimalistic-linear" class="mr-2" />
                Pelatihan
              </h3>
              <div class="bg-white dark:bg-sky-800 rounded-xl p-4 shadow-sm">
                <ol v-if="guruPage?.pelatihan && guruPage.pelatihan.length" class="list-decimal list-inside">
                  <li v-for="(item, index) in guruPage.pelatihan" :key="index">
                    <span class="font-bold">
                      {{ item.title }}
                    </span>- {{ item.tahun }}
                  </li>
                </ol>
                <p v-else class="italic">
                  -
                </p>
              </div>
            </div>
          </UCard>
        </Motion>
      </div>

      <!-- Back Button -->
      <div class="flex justify-center mb-8">
        <UButton
          to="/guru"
          icon="solar:arrow-left-linear"
          label="Kembali ke Daftar Guru"
          class="px-4 py-2"
        />
      </div>
    </UContainer>
  </div>
</template>
