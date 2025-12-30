<script lang="ts" setup>
import { Motion } from 'motion-v'

defineProps({
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dyy24w5kl/image/upload/v1752355168/guru/1susisquare_xvwg5o.jpg',
  },
  nama: {
    type: String,
    default: 'Nama',
  },
  jabatan: {
    type: String,
    default: 'Kepala Sekolah',
  },
  quote: {
    type: String,
    default: 'Kehadiran website sekolah ini merupakan salah satu upaya kita untuk meningkatkan layanan informasi dan komunikasi sekolah kepada seluruh stakeholders, termasuk siswa, guru, karyawan, orang tua siswa, alumni, dan masyarakat umum.',
  },
})
</script>

<template>
  <div class="bg-sky-500 dark:bg-sky-900 pt-20 pb-28 mt-12 min-h-[600px]">
    <UContainer class="min-h-[500px]">
      <div>
        <div class="md:grid md:grid-cols-2 md:gap-10 lg:gap-16 md:items-center">
          <div class="md:sticky mb-10 md:top-22 md:self-start">
            <!-- Blockquote -->
            <Motion
              :initial="{ y: 10, opacity: 0 }"
              :in-view="{ opacity: 1, transform: 'translateY(0)' }"
              :transition="{ delay: 0.1 }"
            >
              <UCard variant="soft" class="justify-evenly    flex-col h-full bg-sky-50 text-night-700  dark:bg-sky-950 dark:text-white   rounded-4xl  ">
                <blockquote class="relative">
                  <div class="relative z-10">
                    <p class="text-xl font-medium italic text-balance  md:text-2xl md:leading-normal   xl:leading-normal  ">
                      <slot name="quote" />
                    </p>
                  </div>

                  <footer class="mt-6">
                    <div class="flex items-center">
                      <div class=" shrink-0">
                        <NuxtImg
                          format="webp"
                          quality="70"
                          loading="eager"
                          fetchpriority="high"
                          width="48"
                          height="48"
                          title="Kepala Sekolah"
                          class="size-12 rounded-full object-cover"
                          :src="image"
                          alt="Kepala Sekolah"
                        />
                      </div>
                      <div class="ms-4 pl-2 md:ms-0">
                        <div class="text-base font-semibold ">
                          <slot name="nama" />
                        </div>
                        <div class="text-xs ">
                          <slot name="jabatan" />
                        </div>
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </UCard>
            </Motion>
            <!-- End Blockquote -->
          </div>
          <div class=" flex flex-col space-y-4">
            <div class="py-8">
              <h2 v-once class="text-5xl text-center md:text-6xl text-white font-extrabold ">
                Visi, Misi, dan Tujuan
              </h2>
            </div>
            <Motion
              :initial="{ y: 10, opacity: 0 }"
              :in-view="{ opacity: 1, transform: 'translateY(0)' }"
              :transition="{ delay: 0.1 }"
            >
              <UCard variant="soft" class="justify-evenly    flex-col h-full bg-sky-50 text-night-700  dark:bg-sky-950 dark:text-white   rounded-4xl  ">
                <div v-once>
                  <h2 class="text-5xl md:text-6xl pb-4 font-bold">
                    Visi
                  </h2>
                </div>
                <div v-once>
                  <p class="  ">
                    Terwujudnya pribadi yang beriman dan bertakwa kepada Tuhan Tang Maha Esa, berilmu, berkarakter, terampil, kreatif dan berprestasi
                  </p>
                </div>
              </UCard>
            </Motion>
            <Motion
              :initial="{ y: 10, opacity: 0 }"
              :in-view="{ opacity: 1, transform: 'translateY(0)' }"
              :transition="{ delay: 0.1 }"
            >
              <UCard variant="soft" class="justify-evenly    flex-col h-full bg-sky-50 text-night-700  dark:bg-sky-950 dark:text-white   rounded-4xl  ">
                <div v-once>
                  <h2 class="text-5xl md:text-6xl pb-4 font-bold ">
                    Misi
                  </h2>
                </div>
                <div v-once>
                  <ol class="pb-6 list-decimal ml-6">
                    <li>Menciptakan lingkungan sekolah yang bernuansa agamis, bersih dan sehat</li>
                    <li>Meningkatkan kegiatan ibadah melalui kegiatan kultum dan Shalat berjamaah</li>
                    <li>Mengoptimalkan guru profesional dan berdedikasi tinggi sehingga peserta didik mempunyai kompetensi yang baik dan berkarakter</li>
                    <li>Menyelenggarakan pendidikan, pelatihan dan pembinaan berdasarkan bakat, minat dan kreativitas peserta didik melalui ekstrakurikuler</li>
                    <li>Meningkatkan prestasi peserta didik dengan mengoptimalkan proses pembelajaran yang efektif dan efisien</li>
                  </ol>
                </div>
              </UCard>
            </Motion>
            <Motion
              :initial="{ y: 10, opacity: 0 }"
              :in-view="{ opacity: 1, transform: 'translateY(0)' }"
              :transition="{ delay: 0.1 }"
            >
              <UCard variant="soft" class="justify-evenly    flex-col h-full bg-sky-50 text-night-700  dark:bg-sky-950 dark:text-white   rounded-4xl  ">
                <div v-once>
                  <h2 class="text-5xl md:text-6xl pb-4 font-bold ">
                    Tujuan
                  </h2>
                </div>
                <div v-once>
                  <ol class="pb-6 list-decimal ml-6">
                    <li>Terciptanya lingkungan yang agamis, bersih dan sehat</li>
                    <li>Meningkatnya ketakwaan peserta didik terhadap Tuhan Yang Maha Esa</li>
                    <li>Berkembangnya profesionalisme tenaga pendidik</li>
                    <li>Terbentuknya pribadi peserta didik yang cerdas, terampil, kreatif, aktif dan berkarakter</li>
                    <li>Meningkatnya jumlah peserta didik yang melanjutkan pendidikan ke jenjang yang lebih tinggi</li>
                  </ol>
                </div>
              </UCard>
            </Motion>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
