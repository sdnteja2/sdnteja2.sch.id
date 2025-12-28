<script lang="ts" setup>
import { Motion } from 'motion-v'

const props = defineProps({
  title: {
    type: String,
    default: 'Selamat Datang di SDN Teja II',
  },
  subtitle: {
    type: String,
    default: 'Sekolah Dasar Negeri Teja II',
  },
  description: {
    type: String,
    default:
      'SDN Teja II adalah institusi pendidikan dasar yang berkomitmen untuk memberikan layanan terbaik bagi perkembangan akademik dan karakter siswa kami.',
  },
  nss: {
    type: String,
    default: 'NSS: 101052403075',
  },
  npsn: {
    type: String,
    default: 'NPSN: 20307508',
  },
  image: {
    type: String,
    default: 'https://placehold.co/600x400',
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
          <UCard variant="soft" class=" flex justify-evenly    flex-col h-full bg-blue-500 dark:bg-blue-700 text-white  p-4 rounded-4xl  ">
            <div>
              <p class="pb-6 ">
                <slot name="subtitle" mdc-unwrap="p">
                  {{ subtitle }}
                </slot>
              </p>
            </div>
            <div>
              <h1 class="font-bold text-[32px] md:text-[40px]  ">
                <slot name="title" mdc-unwrap="p">
                  {{ title }}
                </slot>
              </h1>
            </div>
            <div class="flex notranslate flex-col mt-6 space-y-2">
              <div>
                <UBadge variant="soft" color="neutral">
                  <slot name="npsn" mdc-unwrap="p">
                    {{ npsn }}
                  </slot>
                </UBadge>
              </div>
              <div>
                <UBadge variant="soft" color="neutral">
                  <slot name="nss" mdc-unwrap="p">
                    {{ nss }}
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
          <UCard variant="soft" class=" bg-blue-50 shadow-teja dark:bg-blue-900 h-full text-night-900 dark:text-white flex items-center justify-center   rounded-4xl  ">
            <p class="py-6 text-balance">
              <slot name="description" mdc-unwrap="p">
                {{ description }}
              </slot>
            </p>
          </UCard>
        </Motion>
      </div>
    </div>
    <div class="flex-2">
      <!-- No Motion wrapper untuk LCP image - immediate render -->
      <div variant="soft" class="var rounded-4xl aspect-video">
        <slot name="image">
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
        </slot>
      </div>
    </div>
  </UContainer>
</template>
