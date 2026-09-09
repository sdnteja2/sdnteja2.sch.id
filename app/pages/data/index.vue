<script setup lang="ts">
const defaultDataLinks = [
  {
    title: 'Data Sekolah',
    desc: 'Identitas kelembagaan, NPSN 20246347, akreditasi, sarana prasarana dan legalitas operasional sekolah.',
    icon: 'i-lucide-school',
    to: '/data/sekolah',
    badge: 'Profil & Fasilitas'
  },
  {
    title: 'Guru & Tenaga Kependidikan',
    desc: 'Daftar kepala sekolah, guru kelas, guru mata pelajaran, operator dan staf kependidikan SDN Teja II.',
    icon: 'i-lucide-users',
    to: '/data/guru',
    badge: '12 Pendidik & Staf'
  },
  {
    title: 'Data Siswa & Kesiswaan',
    desc: 'Rekapitulasi peserta didik per rombel, program pembiasaan karakter, dan ragam ekstrakurikuler.',
    icon: 'i-lucide-graduation-cap',
    to: '/data/siswa',
    badge: '6 Rombel'
  }
]

useSeoMeta({
  title: 'Pusat Data - SD Negeri Teja II',
  description:
    'Pusat informasi dan data resmi SD Negeri Teja II meliputi profil sekolah, direktori guru & tenaga kependidikan, serta statistik siswa.',
  ogTitle: 'Pusat Data - SD Negeri Teja II',
  ogDescription:
    'Pusat informasi dan data resmi SD Negeri Teja II meliputi profil sekolah, guru, dan siswa.'
})

defineOgImage('OgImage', {
  page: 'Data',
  title: 'Pusat Data Sekolah',
  description: 'Pusat informasi dan data resmi SD Negeri Teja II: profil sekolah, direktori GTK, dan statistik siswa.'
})
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
          <span class="text-highlighted font-medium">Data</span>
        </div>

        <div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            Pusat Data Sekolah
          </h1>
          <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
            Informasi keterbukaan data kelembagaan, profil pendidik, dan statistik kesiswaan SD Negeri Teja II.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="item in defaultDataLinks"
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
