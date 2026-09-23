<script setup lang="ts">
const route = useRoute()
const guideKey = computed(() => String(route.params.guide || 'ipas'))

// Query all chapters belonging to this guide
const { data: chapters } = await useAsyncData(`panduan-chapters-${guideKey.value}`, async () => {
  const items = await queryCollection('panduan')
    .where('guide', '=', guideKey.value)
    .all()
  return items.sort((a, b) => (Number(a.chapter) || 0) - (Number(b.chapter) || 0))
})

const guideInfo = computed(() => {
  if (guideKey.value === 'ipas') {
    return {
      title: 'Panduan Mata Pelajaran IPAS',
      subtitle: 'Ilmu Pengetahuan Alam dan Sosial',
      fase: 'Fase B & C (Kelas 3 - 6 SD)',
      publisher: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP)',
      ministry: 'Kementerian Pendidikan Dasar dan Menengah RI',
      year: '2025',
      description:
        'Dokumen acuan resmi untuk membantu pendidik dalam menerjemahkan Capaian Pembelajaran IPAS ke dalam pembelajaran di kelas dengan pendekatan Pembelajaran Mendalam (Deep Learning). Panduan ini memuat rasional, pemetaan materi esensial, contoh alur tujuan pembelajaran, dan modul ajar terpadu.',
      icon: 'i-lucide-atom',
      team: [
        { role: 'Pengarah', name: 'Prof. Dr. Toni Toharudin, S.Si., M.Sc.' },
        { role: 'Penanggung Jawab', name: 'Dr. Laksmi Dewi, M.Pd.' },
        { role: 'Penyusun Utama', name: 'Dr. Cucun Sutinah, M.Pd., Rizal Listyo Mahardhika, S.Pd., Dwi Kartini, M.Pd.' }
      ]
    }
  }

  // Fallback
  const first = chapters.value?.[0]
  return {
    title: first?.guideTitle || 'Panduan Pembelajaran',
    subtitle: 'Panduan Kurikulum & Mata Pelajaran',
    fase: first?.fase || 'Sekolah Dasar',
    publisher: 'BSKAP Kemendikdasmen RI',
    ministry: 'Kementerian Pendidikan Dasar dan Menengah RI',
    year: '2025',
    description: first?.description || 'Panduan pembelajaran resmi bagi pendidik sekolah dasar.',
    icon: 'i-lucide-book-open',
    team: []
  }
})

useSeoMeta({
  title: guideInfo.value.title,
  description: guideInfo.value.description,
  ogTitle: `${guideInfo.value.title} | SDN Teja II`,
  ogDescription: guideInfo.value.description
})

defineOgImage('OgImage', {
  page: 'Panduan',
  title: guideInfo.value.title,
  description: guideInfo.value.description
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="space-y-10">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-muted">
        <NuxtLink
          to="/"
          class="hover:text-highlighted transition-colors"
        >Home</NuxtLink>
        <span>/</span>
        <NuxtLink
          to="/publikasi"
          class="hover:text-highlighted transition-colors"
        >Publikasi</NuxtLink>
        <span>/</span>
        <NuxtLink
          to="/publikasi/panduan"
          class="hover:text-highlighted transition-colors"
        >Panduan</NuxtLink>
        <span>/</span>
        <span class="text-highlighted font-medium">{{ guideInfo.title }}</span>
      </div>

      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="space-y-2 max-w-3xl">
          <div class="flex items-center gap-2">
            <UBadge
              color="primary"
              variant="subtle"
              size="sm"
            >
              {{ guideInfo.fase }}
            </UBadge>
            <UBadge
              color="neutral"
              variant="subtle"
              size="sm"
            >
              {{ guideInfo.year }}
            </UBadge>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
            {{ guideInfo.title }}
          </h1>
          <p class="text-muted text-base sm:text-lg leading-relaxed">
            {{ guideInfo.description }}
          </p>
        </div>

        <div class="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          <UButton
            v-if="chapters.length > 0"
            :to="chapters[0].path"
            label="Mulai Baca dari Bab 1"
            icon="i-lucide-play"
            color="primary"
            size="lg"
            class="justify-center"
          />
          <UButton
            to="/publikasi/panduan"
            label="Kembali ke Daftar Panduan"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="subtle"
            size="md"
            class="justify-center"
          />
        </div>
      </div>

      <!-- Quick Highlights -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UCard variant="subtle">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-list-ordered"
                class="size-5"
              />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-muted">
                Jumlah Bab Materi
              </p>
              <p class="text-lg font-bold text-highlighted truncate">
                {{ chapters.length }} Bab Tersedia
              </p>
            </div>
          </div>
        </UCard>

        <UCard variant="subtle">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-award"
                class="size-5"
              />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-muted">
                Penerbit Resmi
              </p>
              <p class="text-lg font-bold text-highlighted truncate">
                BSKAP Kemendikdasmen
              </p>
            </div>
          </div>
        </UCard>

        <UCard variant="subtle">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UIcon
                name="i-lucide-sparkles"
                class="size-5"
              />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-muted">
                Pendekatan Utama
              </p>
              <p class="text-lg font-bold text-highlighted truncate">
                Deep Learning
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Chapter List -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-highlighted flex items-center gap-2">
            <UIcon
              name="i-lucide-book-open"
              class="size-6 text-primary"
            />
            Daftar Tuntunan & Bab Pembelajaran
          </h2>
          <span class="text-xs text-muted hidden sm:inline">Klik bab untuk membaca</span>
        </div>

        <div class="space-y-3">
          <NuxtLink
            v-for="(chap, idx) in chapters"
            :key="chap.path"
            :to="chap.path"
            class="group block"
          >
            <UCard
              variant="subtle"
              class="hover:ring-primary/50 hover:shadow-sm transition-all"
            >
              <div class="flex items-center gap-4">
                <div class="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {{ idx + 1 }}
                </div>
                <div class="min-w-0 flex-1 space-y-1">
                  <h3 class="font-bold text-highlighted text-base group-hover:text-primary transition-colors">
                    {{ chap.title }}
                  </h3>
                  <p class="text-xs text-muted leading-relaxed line-clamp-2">
                    {{ chap.description }}
                  </p>
                </div>
                <div class="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    v-if="chap.readTime"
                    class="text-xs text-muted flex items-center gap-1"
                  >
                    <UIcon
                      name="i-lucide-clock"
                      class="size-3.5"
                    />
                    {{ chap.readTime }}
                  </span>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4 text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all"
                  />
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </div>

      <!-- Legal & Credit Info -->
      <UCard variant="subtle">
        <h3 class="text-sm font-bold text-highlighted uppercase tracking-wide mb-4">
          Informasi Penerbitan & Tim Pengembang
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pb-4 border-b border-default/60">
          <div>
            <p class="font-semibold text-highlighted mb-0.5">
              Penerbit
            </p>
            <p class="text-muted">
              {{ guideInfo.publisher }}
            </p>
          </div>
          <div>
            <p class="font-semibold text-highlighted mb-0.5">
              Kementerian
            </p>
            <p class="text-muted">
              {{ guideInfo.ministry }}
            </p>
          </div>
          <div>
            <p class="font-semibold text-highlighted mb-0.5">
              Tahun Terbit
            </p>
            <p class="text-muted">
              {{ guideInfo.year }} (Edisi Revisi)
            </p>
          </div>
        </div>

        <div
          v-if="guideInfo.team.length"
          class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-4"
        >
          <div
            v-for="member in guideInfo.team"
            :key="member.role"
          >
            <p class="font-semibold text-highlighted mb-0.5">
              {{ member.role }}
            </p>
            <p class="text-muted leading-relaxed">
              {{ member.name }}
            </p>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
