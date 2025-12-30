<script setup>
import { useGoogleTranslate } from '#imports'

const appConfig = useAppConfig()

const { activeLanguage, setLanguage, supportedLanguages, isLoaded } = useGoogleTranslate()

// Language options without icons
const languageOptions = computed(() => [
  {
    label: 'ID',
    value: 'id',
  },
  {
    label: 'EN',
    value: 'en',
  },
  {
    label: 'ES',
    value: 'es',
  },
  {
    label: 'RU',
    value: 'ru',
  },
].filter(lang => supportedLanguages.value?.includes(lang.value)))

// Update language programmatically
function changeLanguage(lang) {
  setLanguage(lang)
}
</script>

<template>
  <UContainer>
    <!-- ========== FOOTER ========== -->
    <footer class="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <!-- footer core -->
      <USeparator size="lg">
        <NuxtLink class="" to="/" aria-label="Beranda SDN Teja II">
          <UiLogo />
        </NuxtLink>
      </USeparator>
      <div class="pt-3 pb-8">
        <div class="flex  justify-between  items-center gap-3">
          <!-- Language Dropdown -->
          <ClientOnly>
            <div class="flex flex-wrap items-center gap-3">
              <USelect
                :model-value="activeLanguage"
                :items="languageOptions"
                :loading="!isLoaded"
                value-key="value"
                size="sm"
                variant="subtle"
                color="neutral"
                highlight
                arrow
                class="w-15"
                aria-label="Pilih bahasa"
                @update:model-value="changeLanguage"
              />
            </div>
          </ClientOnly>
          <!-- Social Brands -->
          <div class="flex flex-wrap items-center gap-3 justify-end">
            <div class="space-x-4">
              <!-- Email -->
              <NuxtLink :to="appConfig.site.socialMedia.email.url" :aria-label="appConfig.site.socialMedia.email.title">
                <UTooltip :text="appConfig.site.socialMedia.email.title" :delay-duration="0">
                  <UIcon
                    class="size-6 hover:text-sky-500"
                    :aria-label="appConfig.site.socialMedia.email.title"
                    :name="appConfig.site.socialMedia.email.icon"
                  />
                </UTooltip>
              </NuxtLink>
              <!-- Instagram -->
              <NuxtLink :to="appConfig.site.socialMedia.instagram.url" :aria-label="appConfig.site.socialMedia.instagram.title">
                <UTooltip :text="appConfig.site.socialMedia.instagram.title" :delay-duration="0">
                  <UIcon
                    class="size-6 hover:text-sky-500"
                    :aria-label="appConfig.site.socialMedia.instagram.title"
                    :name="appConfig.site.socialMedia.instagram.icon"
                  />
                </UTooltip>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <!-- Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-10">
        <div class="col-span-full hidden lg:col-span-1 lg:block">
          <p class="mt-3 text-xs sm:text-sm text-gray-600">
            {{ appConfig.site.copyright }}
          </p>
          <div>
            <NuxtLink
              class="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-400 hover:underline focus:outline-hidden focus:text-gray-800"
              to="https://nuxt.com/" target="_blank"
            >
              Nuxt JS
            </NuxtLink>
          </div>
        </div> <!-- End Col 0 -->

        <!-- Link pemerintah - DISDIK MAJALENGKA -->
        <div>
          <h2 class="text-xs font-semibold text-gray-900 dark:text-sky-500 uppercase">
            {{ appConfig.site.government.disdikMajalengka.title }}
          </h2>
          <div class="mt-3 grid space-y-3 text-sm">
            <div v-for="(link, key) in appConfig.site.government.disdikMajalengka.links" :key="key">
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-400 hover:underline focus:outline-hidden focus:text-gray-800"
                :to="link.url" target="_blank"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </div>
        </div> <!-- End Col 1 -->

        <!-- Link pemerintah - DISDIK JABAR -->
        <div>
          <h2 class="text-xs font-semibold text-gray-900 dark:text-sky-500 uppercase">
            {{ appConfig.site.government.disdikJabar.title }}
          </h2>
          <div class="mt-3 grid space-y-3 text-sm">
            <div v-for="(link, key) in appConfig.site.government.disdikJabar.links" :key="key">
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-400 hover:underline focus:outline-hidden focus:text-gray-800"
                :to="link.url" target="_blank"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </div>
        </div> <!-- End Col 2 -->

        <!-- Link pemerintah - KEMDIKDASMEN -->
        <div>
          <h2 class="text-xs font-semibold text-gray-900 dark:text-sky-500 uppercase">
            {{ appConfig.site.government.kemdikdasmen.title }}
          </h2>
          <div class="mt-3 grid space-y-3 text-sm">
            <div v-for="(link, key) in appConfig.site.government.kemdikdasmen.links" :key="key">
              <NuxtLink
                class="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-400 hover:underline focus:outline-hidden focus:text-gray-800"
                :to="link.url" target="_blank"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </div>
        </div> <!-- End Col 3 -->
      </div> <!-- End Grid -->
    </footer> <!-- ========== END FOOTER ========== -->
  </UContainer>
</template>
