<script lang="ts" setup>
import { motion } from 'motion-v'

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
  <UContainer class="flex flex-col gap-4 lg:flex-row">
    <div class="flex flex-1 flex-col gap-4">
      <div class="flex-1">
        <motion.div
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 0 }"
        >
          <UCard
            variant="soft"
            class="rounded-4xl flex h-full flex-col justify-evenly bg-blue-500 p-4 text-white dark:bg-blue-700"
          >
            <div>
              <p class="pb-6">
                <slot name="subtitle" mdc-unwrap="p">
                  {{ subtitle }}
                </slot>
              </p>
            </div>
            <div>
              <h1 class="text-[32px] font-bold md:text-[40px]">
                <slot name="title" mdc-unwrap="p">
                  {{ title }}
                </slot>
              </h1>
            </div>
            <div class="notranslate mt-6 flex flex-col space-y-2">
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
        </motion.div>
      </div>
      <div class="flex-1">
        <motion.div
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :whileInView="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * 1 }"
        >
          <UCard
            variant="soft"
            class="shadow-teja text-night-900 rounded-4xl flex h-full items-center justify-center bg-blue-50 dark:bg-blue-900 dark:text-white"
          >
            <p class="text-balance py-6">
              <slot name="description" mdc-unwrap="p">
                {{ description }}
              </slot>
            </p>
          </UCard>
        </motion.div>
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
            class="rounded-4xl aspect-video h-full w-full object-fill"
            width="1200"
            height="675"
          />
        </slot>
      </div>
    </div>
  </UContainer>
</template>
