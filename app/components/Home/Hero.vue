<script lang="ts" setup>
import { Motion } from 'motion-v'

const props = defineProps({
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dyy24w5kl/image/upload/f_auto,q_auto,w_1200,h_675,c_fill,ar_16:9/v1741192676/teja2_pasukan_s6jtrc.jpg',
  },
})

// Preload hero image untuk meningkatkan LCP
const heroImageUrl = computed(() => {
  // Jika local image, gunakan IPX path yang sama dengan NuxtImg
  if (props.image.startsWith('/')) {
    return `/_ipx/f_webp&q_85&w_1200&h_675/${props.image}`
  }
  return props.image
})

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: heroImageUrl.value,
      type: 'image/webp',
      fetchpriority: 'high',
      imagesrcset: `${heroImageUrl.value} 1200w`,
      imagesizes: '(max-width: 768px) 100vw, 50vw',
    },
  ],
})
</script>

<template>
  <UContainer class="flex flex-col lg:flex-row gap-4">
    <div class="flex-1 flex flex-col gap-4">
      <div class="flex-1">
        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 0 }"
        >
          <UCard variant="soft" class=" flex justify-evenly    flex-col h-full bg-red-500 dark:bg-night-700 text-white  p-4 rounded-4xl  ">
            <div>
              <p class="pb-6 ">
                <slot name="subtitle">
                  Selamat Datang di Website Kami
                </slot>
              </p>
            </div>
            <div>
              <h1 class="font-bold text-[32px] md:text-[40px]  ">
                <slot name="title">
                  SDN Teja II
                </slot>
              </h1>
            </div>
            <div class="flex notranslate flex-col mt-6 space-y-2">
              <div>
                <UBadge variant="soft" color="neutral">
                  <slot name="npsn">
                    NPSN: 20246133
                  </slot>
                </UBadge>
              </div>
              <div>
                <UBadge variant="soft" color="neutral">
                  <slot name="nss">
                    NSS: 20246133
                  </slot>
                </UBadge>
              </div>
            </div>
          </UCard>
        </Motion>
      </div>
      <div class="flex-1">
        <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 1 }"
        >
          <UCard variant="soft" class=" bg-night-50 shadow-teja dark:bg-night-900 h-full text-night-900 dark:text-white flex items-center justify-center   rounded-4xl  ">
            <p class="py-6 text-balance">
              <slot name="description">
                Wujudkan Impian Pendidikan Berkualitas untuk Semua, Lingkungan Belajar yang Nyaman, Kreatif, dan Menyenangkan
              </slot>
            </p>
          </UCard>
        </Motion>
      </div>
    </div>
    <div class="flex-2">
      <!-- No Motion wrapper untuk LCP image - immediate render -->
      <div variant="soft" class="var rounded-4xl aspect-video">
        <NuxtImg
          format="webp"
          quality="85"
          loading="eager"
          priority
          fetchpriority="high"
          title="SDN Teja II - Sekolah Dasar Negeri"
          :src="image"
          alt="SDN Teja II - Sekolah Dasar Negeri Teja II, Rajagaluh, Majalengka"
          class="w-full h-full object-cover aspect-video rounded-4xl"
          width="1200"
          height="675"
        />
      </div>
    </div>
  </UContainer>
</template>
