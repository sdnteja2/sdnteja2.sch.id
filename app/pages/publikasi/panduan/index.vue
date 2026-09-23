<script setup lang="ts">
useSeoMeta({
  title: 'Panduan Pembelajaran & Kurikulum',
  description:
    'Pusat referensi dan panduan mata pelajaran, pembelajaran mendalam, serta panduan kurikulum resmi bagi pendidik SD Negeri Teja II.',
  ogTitle: 'Panduan Pembelajaran & Kurikulum | SDN Teja II',
  ogDescription:
    'Pusat referensi dan panduan mata pelajaran, pembelajaran mendalam, serta panduan kurikulum resmi bagi pendidik SD Negeri Teja II.'
})

defineOgImage('OgImage', {
  page: 'Panduan',
  title: 'Panduan Pembelajaran',
  description: 'Pusat panduan kurikulum dan pembelajaran mendalam SD Negeri Teja II Rajagaluh.'
})

interface GuideItem {
  id: string
  title: string
  subtitle: string
  description: string
  fase: string
  chaptersCount: number
  totalReadTime: string
  publisher: string
  year: string
  icon: string
  to: string
  badgeColor?: 'primary' | 'secondary' | 'success' | 'info' | 'warning'
}

const guidesList: GuideItem[] = [
  {
    id: 'ipas',
    title: 'Panduan Mata Pelajaran IPAS',
    subtitle: 'Ilmu Pengetahuan Alam dan Sosial',
    description:
      'Pedoman resmi implementasi pembelajaran mendalam (mindful, meaningful, joyful), pemetaan materi esensial, alur tujuan pembelajaran, dan asesmen autentik Fase B dan C.',
    fase: 'Fase B & C (Kelas 3 - 6 SD)',
    chaptersCount: 5,
    totalReadTime: '43 Menit',
    publisher: 'BSKAP Kemendikdasmen RI',
    year: '2025',
    icon: 'i-lucide-atom',
    to: '/publikasi/panduan/ipas',
    badgeColor: 'primary'
  }
]
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="space-y-10">
      <!-- Breadcrumb & Header -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-sm text-muted">
          <NuxtLink
            to="/"
            class="hover:text-highlighted transition-colors"
          >
            Home
          </NuxtLink>
          <span>/</span>
          <NuxtLink
            to="/publikasi"
            class="hover:text-highlighted transition-colors"
          >
            Publikasi
          </NuxtLink>
          <span>/</span>
          <span class="text-highlighted font-medium">Panduan</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              Panduan Pembelajaran & Kurikulum
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              Koleksi panduan instruksional resmi, terjemahan Capaian Pembelajaran, dan perangkat ajar berbasis pembelajaran mendalam bagi guru sekolah dasar.
            </p>
          </div>

          <UBadge
            variant="subtle"
            color="neutral"
            size="md"
            class="self-start md:self-auto"
          >
            Total: {{ guidesList.length }} Panduan Resmi
          </UBadge>
        </div>
      </div>

      <!-- Guide Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UCard
          v-for="guide in guidesList"
          :key="guide.id"
          variant="subtle"
          class="hover:ring-primary/50 hover:shadow-md transition-all"
          :ui="{ body: 'divide-y divide-default/60' }"
        >
          <div class="pb-4 space-y-4">
            <div class="flex items-center gap-3">
              <div class="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <UIcon
                  :name="guide.icon"
                  class="size-6"
                />
              </div>
              <div class="min-w-0">
                <span class="text-xs font-semibold text-primary uppercase tracking-wide block truncate">
                  {{ guide.subtitle }}
                </span>
                <NuxtLink
                  :to="guide.to"
                  class="block text-lg font-bold text-highlighted hover:text-primary transition-colors leading-snug"
                >
                  {{ guide.title }}
                </NuxtLink>
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5">
              <UBadge
                variant="subtle"
                color="primary"
                size="xs"
                icon="i-lucide-layers"
              >
                {{ guide.fase }}
              </UBadge>
              <UBadge
                variant="subtle"
                color="neutral"
                size="xs"
                icon="i-lucide-book-copy"
              >
                {{ guide.chaptersCount }} Bab Materi
              </UBadge>
            </div>

            <p class="text-sm text-muted leading-relaxed">
              {{ guide.description }}
            </p>
          </div>

          <div class="py-3 flex items-center justify-between text-xs text-muted">
            <span class="flex items-center gap-1.5">
              <UIcon
                name="i-lucide-landmark"
                class="size-3.5"
              />
              {{ guide.publisher }} · {{ guide.year }}
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon
                name="i-lucide-clock"
                class="size-3.5"
              />
              {{ guide.totalReadTime }}
            </span>
          </div>

          <div class="pt-4">
            <UButton
              :to="guide.to"
              label="Pelajari Panduan & Buka Bab"
              icon="i-lucide-book-open"
              trailing-icon="i-lucide-arrow-right"
              color="primary"
              variant="solid"
              size="sm"
              block
            />
          </div>
        </UCard>
      </div>

      <!-- Info Box Notice -->
      <UCard class="border-dashed border-default bg-elevated/30 p-5 rounded-2xl">
        <div class="flex items-start gap-3.5">
          <div class="size-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <UIcon
              name="i-lucide-sparkles"
              class="size-4"
            />
          </div>
          <div class="space-y-1">
            <h2 class="text-sm font-bold text-highlighted">
              Pemanfaatan Panduan di Satuan Pendidikan
            </h2>
            <p class="text-xs text-muted leading-relaxed">
              Panduan pembelajaran ini disusun untuk mendampingi pendidik SDN Teja II dalam merancang kegiatan belajar yang berpusat pada murid, mengembangkan modul ajar terpadu, dan mengintegrasikan 3 isu prioritas: perubahan iklim, literasi finansial, dan kesehatan fisik-mental.
            </p>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
