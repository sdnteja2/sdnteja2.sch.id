<script setup lang="ts">
useSeoMeta({
  title: 'Pusat Media & Sumber Belajar - SD Negeri Teja II',
  description:
    'Pusat sumber belajar digital SD Negeri Teja II, menyajikan katalog perpustakaan buku digital dan video edukatif.',
  ogTitle: 'Pusat Media & Sumber Belajar - SD Negeri Teja II',
  ogDescription:
    'Pusat sumber belajar digital SD Negeri Teja II, menyajikan katalog perpustakaan buku digital dan video edukatif.'
})

const mediaLinks = [
  {
    title: 'Pojok Baca & Buku Digital',
    desc: 'Buku pelajaran Kurikulum Merdeka, cerita dongeng fabel nusantara, ensiklopedia cilik, dan bacaan pengayaan karakter.',
    icon: 'i-lucide-book-open',
    to: '/media/buku',
    badge: 'Perpustakaan'
  },
  {
    title: 'Galeri Video Pembelajaran',
    desc: 'Video profil resmi SDN Teja II, dokumentasi pentas seni dan gelar karya P5, atraksi pramuka, serta senam sehat bersama.',
    icon: 'i-lucide-video',
    to: '/media/video',
    badge: 'Video Kreatif'
  }
]
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="space-y-10">
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-sm text-muted">
          <NuxtLink
            to="/"
            class="hover:text-highlighted transition-colors"
          >
            Home
          </NuxtLink>
          <span>/</span>
          <span class="text-highlighted font-medium">Media</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Pusat Media & Sumber Belajar
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Akses materi bacaan digital ramah anak serta arsip tayangan video edukasi dan dokumentasi SDN Teja II.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <NuxtLink
          v-for="item in mediaLinks"
          :key="item.to"
          :to="item.to"
          class="group block"
        >
          <UCard class="h-full group-hover:border-primary/60 transition-all hover:shadow-md">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="p-3.5 rounded-xl bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
                  <UIcon
                    :name="item.icon"
                    class="size-7 text-primary group-hover:text-white transition-colors"
                  />
                </div>
                <UBadge
                  color="neutral"
                  variant="subtle"
                  size="sm"
                >
                  {{ item.badge }}
                </UBadge>
              </div>

              <div class="space-y-2">
                <h2 class="text-xl font-bold text-highlighted group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {{ item.title }}
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </h2>
                <p class="text-sm text-muted leading-relaxed">
                  {{ item.desc }}
                </p>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UContainer>
  </div>
</template>
