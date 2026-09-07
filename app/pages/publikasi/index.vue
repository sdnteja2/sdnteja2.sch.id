<script setup lang="ts">
useSeoMeta({
  title: 'Pusat Publikasi - SD Negeri Teja II',
  description:
    'Portal warta sekolah, artikel edukasi guru, dan dokumentasi ragam kegiatan pembelajaran SD Negeri Teja II Rajagaluh.',
  ogTitle: 'Pusat Publikasi - SD Negeri Teja II',
  ogDescription:
    'Portal warta sekolah, artikel edukasi guru, dan dokumentasi ragam kegiatan pembelajaran SD Negeri Teja II.'
})

const publicationLinks = [
  {
    title: 'Warta & Berita',
    desc: 'Pengumuman resmi kedinasan, agenda sekolah, kabar prestasi, dan warta terbaru di SDN Teja II.',
    icon: 'i-lucide-megaphone',
    to: '/publikasi/berita',
    badge: 'Kabar Terkini'
  },
  {
    title: 'Artikel & Opini',
    desc: 'Tulisan reflektif para pendidik, praktik baik pembelajaran, literasi anak, dan parenting pendidikan.',
    icon: 'i-lucide-file-text',
    to: '/publikasi/artikel',
    badge: 'Karya Pendidik'
  },
  {
    title: 'Dokumentasi Kegiatan',
    desc: 'Rangkuman agenda ekstrakurikuler, pembiasaan religius, pentas seni P5, dan upacara peringatan hari besar.',
    icon: 'i-lucide-calendar',
    to: '/publikasi/kegiatan',
    badge: 'Galeri Aktivitas'
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
          <span class="text-highlighted font-medium">Publikasi</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Pusat Publikasi & Informasi
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Kumpulan warta sekolah, karya tulis edukatif, serta rangkuman dokumentasi kegiatan siswa SD Negeri Teja II.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="item in publicationLinks"
          :key="item.to"
          :to="item.to"
          class="group block"
        >
          <UCard class="h-full group-hover:border-primary/60 transition-all hover:shadow-md">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="p-3 rounded-xl bg-muted group-hover:bg-primary group-hover:text-white transition-colors">
                  <UIcon
                    :name="item.icon"
                    class="size-6 text-primary group-hover:text-white transition-colors"
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

              <div class="space-y-1.5">
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
