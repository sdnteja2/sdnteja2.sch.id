<script setup lang="ts">
import type { FooterColumn, NavigationMenuItem } from '@nuxt/ui'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'id'
  }
})

const title = 'SD Negeri Teja II - Berkarakter, Cerdas & Berakhlak Mulia'
const description = 'Website resmi SD Negeri Teja II, Kecamatan Rajagaluh, Kabupaten Majalengka. Sekolah ramah anak yang menumbuhkan karakter, literasi, dan potensi siswa.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

defineOgImage('OgImage')

const footerColumns: FooterColumn[] = [
  {
    label: 'DISDIK MAJALENGKA',
    children: [
      {
        label: 'Website Disdik Majalengka',
        to: 'https://disdik.majalengkakab.go.id/',
        target: '_blank'
      },
      {
        label: 'Aplikasi Dapodik',
        to: 'https://dapo.kemdikbud.go.id/',
        target: '_blank'
      },
      {
        label: 'PPDB Online',
        to: 'https://ppdb.majalengkakab.go.id/',
        target: '_blank'
      },
      {
        label: 'E-Learning',
        to: 'https://elearning.majalengkakab.go.id/',
        target: '_blank'
      }
    ]
  },
  {
    label: 'DISDIK JABAR',
    children: [
      {
        label: 'Website Disdik Jabar',
        to: 'https://disdik.jabarprov.go.id/',
        target: '_blank'
      },
      {
        label: 'Jabar Digital Service',
        to: 'https://digitalservice.jabarprov.go.id/',
        target: '_blank'
      },
      {
        label: 'SIAP Online',
        to: 'https://siap-online.com/',
        target: '_blank'
      },
      {
        label: 'Portal Data Jabar',
        to: 'https://opendata.jabarprov.go.id/',
        target: '_blank'
      }
    ]
  },
  {
    label: 'KEMDIKDASMEN',
    children: [
      {
        label: 'Website Kemdikdasmen',
        to: 'https://ditpsd.kemdikbud.go.id/',
        target: '_blank'
      },
      {
        label: 'Merdeka Belajar',
        to: 'https://merdekabelajar.kemdikbud.go.id/',
        target: '_blank'
      },
      {
        label: 'Platform Merdeka Mengajar',
        to: 'https://guru.kemdikbud.go.id/',
        target: '_blank'
      },
      {
        label: 'ANBK',
        to: 'https://anbk.kemdikbud.go.id/',
        target: '_blank'
      }
    ]
  }
]

const route = useRoute()

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Data',
    icon: 'i-lucide-database',
    active: route.path.startsWith('/data'),
    children: [
      {
        label: 'Data Sekolah',
        description: 'Profil, legalitas, akreditasi, dan sarana prasarana',
        icon: 'i-lucide-school',
        to: '/data/sekolah'
      },
      {
        label: 'Guru & Tenaga Kependidikan',
        description: 'Daftar dewan guru dan tenaga kependidikan',
        icon: 'i-lucide-users',
        to: '/data/guru'
      },
      {
        label: 'Data Siswa',
        description: 'Statistik rombel, pembiasaan, dan kegiatan kesiswaan',
        icon: 'i-lucide-graduation-cap',
        to: '/data/siswa'
      }
    ]
  },
  {
    label: 'Publikasi',
    icon: 'i-lucide-newspaper',
    active: route.path.startsWith('/publikasi'),
    children: [
      {
        label: 'Berita',
        description: 'Warta terkini dan pengumuman resmi sekolah',
        icon: 'i-lucide-megaphone',
        to: '/publikasi/berita'
      },
      {
        label: 'Artikel',
        description: 'Karya tulis edukatif dan inspirasi pembelajaran',
        icon: 'i-lucide-file-text',
        to: '/publikasi/artikel'
      },
      {
        label: 'Kegiatan',
        description: 'Dokumentasi agenda dan ekstrakurikuler siswa',
        icon: 'i-lucide-calendar',
        to: '/publikasi/kegiatan'
      }
    ]
  },
  {
    label: 'Media',
    icon: 'i-lucide-film',
    active: route.path.startsWith('/media'),
    children: [
      {
        label: 'Buku',
        description: 'Katalog pojok baca dan buku literasi digital',
        icon: 'i-lucide-book-open',
        to: '/media/buku'
      },
      {
        label: 'Video',
        description: 'Video pembelajaran interaktif siswa',
        icon: 'i-lucide-video',
        to: '/media/video'
      }
    ]
  }
])
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1 flex items-center"
        >
          <AppLogo class="w-auto h-8 shrink-0" />
        </NuxtLink>
      </template>

      <!-- Center navigation menu -->
      <UNavigationMenu
        :items="navItems"
        :ui="{ list: 'flex items-center gap-1', item: 'shrink-0' }"
        variant="link"
        class="hidden md:flex"
      />

      <template #right>
        <UColorModeButton />

        <UButton
          to="/data/sekolah"
          label="Profil Sekolah"
          color="neutral"
          variant="subtle"
          size="sm"
          class="hidden sm:inline-flex"
        />
      </template>

      <template #body>
        <UNavigationMenu
          :items="navItems"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #top>
        <UContainer class="w-full">
          <UFooterColumns :columns="footerColumns">
            <template #left>
              <div class="space-y-3 max-w-sm">
                <NuxtLink
                  to="/"
                  class="flex items-center"
                >
                  <AppLogo class="w-auto h-9 shrink-0" />
                </NuxtLink>
                <p class="text-xs sm:text-sm text-muted leading-relaxed">
                  Sekolah ramah anak yang menumbuhkan karakter, literasi, dan potensi peserta didik berlandaskan iman dan takwa.
                </p>
                <div class="pt-1 text-xs text-muted space-y-1">
                  <p>Jl. Desa Teja, Kec. Rajagaluh, Kab. Majalengka 45472</p>
                  <p>NPSN: 20246347 • Akreditasi B</p>
                </div>
              </div>
            </template>
          </UFooterColumns>
        </UContainer>
      </template>

      <template #left>
        <div class="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted">
          <span>© 2025 narr07. All rights reserved.</span>
          <span class="hidden sm:inline">•</span>
          <span>
            Didukung oleh
            <NuxtLink
              to="https://nuxt.com/"
              target="_blank"
              class="font-medium text-highlighted hover:text-primary transition-colors underline underline-offset-2"
            >
              Nuxt JS
            </NuxtLink>
          </span>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <UBadge
            color="neutral"
            variant="subtle"
            size="xs"
            class="text-[11px]"
          >
            Bahasa Indonesia
          </UBadge>
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
