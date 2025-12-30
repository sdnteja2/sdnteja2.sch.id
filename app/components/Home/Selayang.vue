<script lang="ts" setup>
import { Motion } from 'motion-v'

defineProps({
  image: {
    type: String,
    default: '/user.png',
  },
})
</script>

<template>
  <div class="py-8">
    <UContainer>
      <div class="py-8">
        <h2 class="text-center text-5xl font-bold md:text-6xl">
          Selayang Pandang
        </h2>
      </div>
      <!-- Testimonials -->
      <Motion
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 }"
      >
        <UCard variant="soft" class="rounded-4xl bg-sky-200 py-8 dark:bg-sky-900">
          <!-- Grid -->
          <div class="md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-16">
            <div class="mb-24 hidden sm:px-6 md:mb-0 md:block">
              <div class="relative flex items-center justify-center">
                <NuxtImg
                  class="h-96 rounded-[40px]"
                  :src="image"
                  alt="Kepala Sekolah"
                  format="webp"
                  quality="80"
                  loading="lazy"
                  fetchpriority="low"
                  width="384"
                  height="384"
                />
              </div>
            </div>
            <!-- End Col -->

            <div>
              <!-- Blockquote -->
              <blockquote class="relative">
                <div class="relative z-10">
                  <p
                    class="text-balance text-xl font-medium italic md:text-2xl md:leading-normal xl:leading-normal"
                  >
                    <slot name="quote">
                      Kehadiran website sekolah ini merupakan salah satu upaya kita untuk
                      meningkatkan layanan informasi dan komunikasi sekolah kepada seluruh
                      stakeholders, termasuk siswa, guru, karyawan, orang tua siswa, alumni, dan
                      masyarakat umum.
                    </slot>
                  </p>
                </div>

                <footer class="mt-6">
                  <div class="flex items-center">
                    <div class="shrink-0 md:hidden">
                      <NuxtImg
                        format="webp"
                        quality="70"
                        loading="lazy"
                        fetchpriority="low"
                        title="Kepala Sekolah"
                        :src="image"
                        alt="Kepala Sekolah"
                        class="size-12 rounded-full object-cover"
                      />
                    </div>
                    <div class="ms-4 md:ms-0">
                      <div class="text-base font-semibold text-sky-500">
                        <slot name="nama">
                          Nama Kepala Sekolah
                        </slot>
                      </div>
                      <div class="text-xs">
                        <slot name="jabatan">
                          Kepala Sekolah
                        </slot>
                      </div>
                    </div>
                  </div>
                </footer>
              </blockquote>
              <!-- End Blockquote -->
            </div>
            <!-- End Col -->
          </div>
          <!-- End Grid -->
        </UCard>
      </Motion>
      <!-- End Testimonials -->
    </UContainer>
  </div>
</template>
