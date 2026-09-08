<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

interface HighlightItem {
  icon: string
  title: string
  description: string
}

interface MascotData {
  src: string
  alt?: string
  title?: string
  description?: string
}

interface HeroData {
  headline?: string
  title?: string
  title_highlight?: string
  description?: string
  links?: ButtonProps[]
  highlights?: HighlightItem[]
  image?: {
    src: string
    alt?: string
  }
  mascot?: MascotData
}

const props = defineProps<{
  data?: HeroData
}>()

const defaultLinks: ButtonProps[] = [
  {
    label: 'Informasi Pendaftaran',
    to: '#kontak',
    icon: 'i-lucide-user-plus',
    size: 'lg',
    color: 'primary'
  },
  {
    label: 'Jelajahi Profil',
    to: '#profil',
    icon: 'i-lucide-school',
    size: 'lg',
    color: 'neutral',
    variant: 'subtle'
  }
]

const defaultHighlights: HighlightItem[] = [
  {
    icon: 'i-lucide-badge-check',
    title: 'NPSN Resmi: 20246347',
    description: 'Kemendikbudristek RI'
  },
  {
    icon: 'i-lucide-book-open',
    title: 'Kurikulum Merdeka',
    description: 'Pendidikan Karakter & Literasi'
  },
  {
    icon: 'i-lucide-heart-handshake',
    title: 'Sekolah Ramah Anak',
    description: 'Lingkungan Inklusif & Nyaman'
  },
  {
    icon: 'i-lucide-map-pin',
    title: 'Rajagaluh, Majalengka',
    description: 'Jl. Desa Teja, Jawa Barat'
  }
]
</script>

<template>
  <div class="relative">
    <UPageHero
      orientation="horizontal"
      :links="props.data?.links?.length ? props.data.links : defaultLinks"
      :ui="{
        container: '!pt-3 !pb-8 sm:!pt-6 sm:!pb-12 lg:!pt-8 lg:!pb-14 gap-8 lg:gap-12 items-center',
        title: 'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-highlighted leading-tight',
        description: 'text-base sm:text-lg text-muted mt-4 leading-relaxed',
        links: 'mt-6 flex flex-wrap gap-4'
      }"
    >
      <!-- Headline: Identitas Resmi Sekolah -->
      <template #headline>
        <div class="inline-flex items-center gap-2 rounded-full border border-default/70 bg-muted/40 px-3.5 py-1 text-xs font-semibold text-highlighted mb-3">
          <span class="inline-block size-2 rounded-full bg-primary" />
          <span>{{ props.data?.headline || 'Portal Resmi • SD Negeri Teja II Rajagaluh' }}</span>
        </div>
      </template>

      <!-- Title: Tegas, Ceria & Menginspirasi -->
      <template #title>
        <span>{{ props.data?.title || 'Membentuk Generasi' }}</span>
        <span
          v-if="props.data?.title_highlight"
          class="text-primary block mt-1"
        >
          {{ props.data.title_highlight }}
        </span>
      </template>

      <!-- Description: Nyata dan Membumi -->
      <template #description>
        {{ props.data?.description || 'Selamat datang di website resmi SD Negeri Teja II. Kami berkomitmen menghadirkan ekosistem pendidikan dasar yang ramah anak, berakar pada budi pekerti luhur, serta mendorong setiap siswa berkembang dengan gembira dan berprestasi.' }}
      </template>

      <!-- Right Slot: Showcase Foto Gedung Sekolah & Maskot Resmi -->
      <template #default>
        <div class="relative w-full rounded-3xl border border-default/70 bg-elevated shadow-sm overflow-hidden">
          <!-- Foto Gedung Sekolah Asli -->
          <div class="relative aspect-16/10 w-full overflow-hidden bg-muted">
            <img
              :src="props.data?.image?.src || '/cover/sekolah.png'"
              :alt="props.data?.image?.alt || 'Gedung SDN Teja II'"
              class="size-full object-cover transition-transform duration-500 hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <div class="flex items-center gap-2 mb-1">
                <img
                  src="/logo.svg"
                  alt="Logo SDN Teja 2"
                  class="size-7 object-contain drop-shadow"
                >
                <span class="text-sm font-bold tracking-wide">SDN TEJA II</span>
              </div>
              <p class="text-xs text-white/90">
                Jl. Desa Teja, Kec. Rajagaluh, Kab. Majalengka 45472
              </p>
            </div>
          </div>

          <!-- Keterangan Lingkungan Sekolah & Maskot Literasi -->
          <div class="p-5 flex items-center justify-between gap-4 border-t border-default/60 bg-muted/10">
            <div class="space-y-1">
              <div class="flex items-center gap-1.5 text-primary font-semibold text-sm">
                <UIcon
                  name="i-lucide-smile"
                  class="size-4"
                />
                <span>{{ props.data?.mascot?.title || 'Pendidikan Karakter & Literasi' }}</span>
              </div>
              <p class="text-xs text-muted leading-relaxed">
                {{ props.data?.mascot?.description || 'Belajar gembira, berdisiplin positif, dan saling menghargai sejak usia dini.' }}
              </p>
            </div>
            <div class="shrink-0">
              <img
                :src="props.data?.mascot?.src || '/maskot/bacabuku.png'"
                :alt="props.data?.mascot?.alt || 'Maskot SDN Teja II'"
                class="size-16 sm:size-20 object-contain drop-shadow-sm"
              >
            </div>
          </div>
        </div>
      </template>

      <!-- Bottom Slot: Highlight NPSN, Kurikulum & Identitas Riil Sekolah -->
      <template #bottom>
        <div class="w-full mt-4 sm:mt-6 pt-6 sm:pt-8 border-t border-default/60">
          <UMarquee
            pause-on-hover
            :repeat="4"
            :ui="{ root: '[--gap:--spacing(4)] [--duration:28s]', content: 'py-1' }"
          >
            <div
              v-for="(item, idx) in (props.data?.highlights?.length ? props.data.highlights : defaultHighlights)"
              :key="idx"
              class="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/30 border border-default/50 transition-colors hover:bg-muted/50 w-64 sm:w-72 shrink-0"
            >
              <div class="size-10 shrink-0 rounded-xl bg-muted border border-default/60 flex items-center justify-center text-primary">
                <UIcon
                  :name="item.icon"
                  class="size-5"
                />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-highlighted truncate">
                  {{ item.title }}
                </div>
                <div class="text-[11px] text-muted truncate">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </UMarquee>
        </div>
      </template>
    </UPageHero>
  </div>
</template>
