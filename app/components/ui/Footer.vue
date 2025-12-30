<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const appConfig = useAppConfig()

const { activeLanguage, setLanguage, supportedLanguages, isLoaded } = useGoogleTranslate()

const availableLocales = computed(() => {
  return Object.values(locales).filter(l => supportedLanguages.value?.includes(l.code))
})

// Update language programmatically
function changeLanguage(lang: string) {
  setLanguage(lang)
}
</script>

<template>
  <UContainer>
    <!-- ========== FOOTER ========== -->
    <footer class="mx-auto mt-auto w-full max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8">
      <!-- footer core -->
      <USeparator size="lg">
        <NuxtLink class="" to="/" aria-label="Beranda SDN Teja II">
          <UiLogo />
        </NuxtLink>
      </USeparator>
      <div class="pb-8 pt-3">
        <div class="flex items-center justify-between gap-3">
          <!-- Language Dropdown -->
          <ClientOnly>
            <div class="flex flex-wrap items-center gap-3">
              <ULocaleSelect
                :model-value="activeLanguage"
                :locales="availableLocales"
                :loading="!isLoaded"
                size="sm"
                variant="subtle"
                color="neutral"
                highlight
                class="w-15 md:w-32"
                aria-label="Pilih bahasa"
                @update:model-value="changeLanguage"
              />
            </div>
          </ClientOnly>
          <!-- Social Brands -->
          <div class="flex flex-wrap items-center justify-end gap-3">
            <div class="space-x-4">
              <!-- Email -->
              <NuxtLink
                :to="appConfig.site.socialMedia.email.url"
                :aria-label="appConfig.site.socialMedia.email.title"
              >
                <UTooltip :text="appConfig.site.socialMedia.email.title" :delay-duration="0">
                  <UIcon
                    class="size-6 hover:text-sky-500"
                    :aria-label="appConfig.site.socialMedia.email.title"
                    :name="appConfig.site.socialMedia.email.icon"
                  />
                </UTooltip>
              </NuxtLink>
              <!-- Instagram -->
              <NuxtLink
                :to="appConfig.site.socialMedia.instagram.url"
                :aria-label="appConfig.site.socialMedia.instagram.title"
              >
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
      <div class="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-4">
        <div class="col-span-full hidden lg:col-span-1 lg:block">
          <p class="mt-3 text-xs text-gray-600 sm:text-sm">
            {{ appConfig.site.copyright }}
          </p>
          <div>
            <NuxtLink
              class="focus:outline-hidden inline-flex gap-x-2 text-gray-600 hover:text-gray-800 hover:underline focus:text-gray-800 dark:text-white dark:hover:text-gray-400"
              to="https://nuxt.com/"
              target="_blank"
            >
              Nuxt JS
            </NuxtLink>
          </div>
        </div>
        <!-- End Col 0 -->

        <!-- Link pemerintah - DISDIK MAJALENGKA -->
        <div>
          <h2 class="text-xs font-semibold uppercase text-gray-900 dark:text-sky-500">
            {{ appConfig.site.government.disdikMajalengka.title }}
          </h2>
          <div class="mt-3 grid space-y-3 text-sm">
            <div v-for="(link, key) in appConfig.site.government.disdikMajalengka.links" :key="key">
              <NuxtLink
                class="focus:outline-hidden inline-flex gap-x-2 text-gray-600 hover:text-gray-800 hover:underline focus:text-gray-800 dark:text-white dark:hover:text-gray-400"
                :to="link.url"
                target="_blank"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <!-- End Col 1 -->

        <!-- Link pemerintah - DISDIK JABAR -->
        <div>
          <h2 class="text-xs font-semibold uppercase text-gray-900 dark:text-sky-500">
            {{ appConfig.site.government.disdikJabar.title }}
          </h2>
          <div class="mt-3 grid space-y-3 text-sm">
            <div v-for="(link, key) in appConfig.site.government.disdikJabar.links" :key="key">
              <NuxtLink
                class="focus:outline-hidden inline-flex gap-x-2 text-gray-600 hover:text-gray-800 hover:underline focus:text-gray-800 dark:text-white dark:hover:text-gray-400"
                :to="link.url"
                target="_blank"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <!-- End Col 2 -->

        <!-- Link pemerintah - KEMDIKDASMEN -->
        <div>
          <h2 class="text-xs font-semibold uppercase text-gray-900 dark:text-sky-500">
            {{ appConfig.site.government.kemdikdasmen.title }}
          </h2>
          <div class="mt-3 grid space-y-3 text-sm">
            <div v-for="(link, key) in appConfig.site.government.kemdikdasmen.links" :key="key">
              <NuxtLink
                class="focus:outline-hidden inline-flex gap-x-2 text-gray-600 hover:text-gray-800 hover:underline focus:text-gray-800 dark:text-white dark:hover:text-gray-400"
                :to="link.url"
                target="_blank"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
        <!-- End Col 3 -->
      </div>
      <!-- End Grid -->
    </footer>
    <!-- ========== END FOOTER ========== -->
  </UContainer>
</template>
