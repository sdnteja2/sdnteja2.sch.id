<script setup lang="ts">
interface Facility {
  name: string
  category: string
  description: string
  image: string
  features: string[]
  icon: string
}

interface FacilitySection {
  headline?: string
  title?: string
  description?: string
}

const props = defineProps<{
  section?: FacilitySection
  items?: Facility[]
}>()

const defaultFacilities: Facility[] = [
  {
    name: 'Ruang Kelas Nyaman',
    category: 'Akademik',
    description: 'Ruang belajar yang bersih, berpencahayaan alami, dan dilengkapi sarana pembelajaran interaktif.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    features: ['Meja & kursi ramah anak', 'Ventilasi udara segar', 'Media pembelajaran aktif'],
    icon: 'i-lucide-book-open'
  },
  {
    name: 'Perpustakaan Sekolah',
    category: 'Literasi',
    description: 'Koleksi buku pengetahuan, cerita rakyat, dan pojok baca yang mendorong kecintaan literasi siswa.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    features: ['Ratusan judul buku', 'Area baca tenang', 'Peminjaman buku teratur'],
    icon: 'i-lucide-library'
  },
  {
    name: 'Laboratorium Komputer',
    category: 'Teknologi',
    description: 'Sarana pengenalan teknologi informasi dan literasi digital sejak dini bagi seluruh peserta didik.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    features: ['Perangkat komputer siap pakai', 'Bimbingan guru TIK', 'Simulasi asesmen digital'],
    icon: 'i-lucide-monitor'
  },
  {
    name: 'Unit Kesehatan Sekolah (UKS)',
    category: 'Kesehatan',
    description: 'Layanan pertolongan pertama dan pemeliharaan kesehatan siswa yang siap siaga dan higienis.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    features: ['Tempat tidur periksa', 'Kotak P3K lengkap', 'Pemeriksaan berkala'],
    icon: 'i-lucide-heart-pulse'
  },
  {
    name: 'Lapangan Olahraga',
    category: 'Aktivitas Luar',
    description: 'Sarana serbaguna untuk upacara bendera, senam kebugaran, futsal, dan kegiatan pramuka.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    features: ['Upacara bendera rutin', 'Olahraga jasmani', 'Latihan pramuka terpadu'],
    icon: 'i-lucide-trophy'
  },
  {
    name: 'Taman Sekolah & Area Hijau',
    category: 'Lingkungan',
    description: 'Lingkungan terbuka yang asri dan sejuk untuk melatih kepedulian siswa terhadap pelestarian alam.',
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    features: ['Tanaman bunga & peneduh', 'Tempat istirahat nyaman', 'Edukasi peduli sampah'],
    icon: 'i-lucide-trees'
  }
]
</script>

<template>
  <section
    id="fasilitas"
    class="py-12 sm:py-16 lg:py-20 border-t border-default/50"
  >
    <UContainer>
      <!-- Header Section -->
      <div class="max-w-2xl mx-auto text-center space-y-3 mb-10 sm:mb-14">
        <div class="inline-flex items-center gap-2 rounded-full border border-default/70 bg-muted px-3.5 py-1 text-xs font-semibold text-highlighted">
          <span class="inline-block size-2 rounded-full bg-primary" />
          <span>{{ props.section?.headline || 'Sarana & Prasarana' }}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-highlighted">
          {{ props.section?.title || 'Fasilitas Penunjang Belajar' }}
        </h2>
        <p class="text-sm sm:text-base text-muted leading-relaxed">
          {{ props.section?.description || 'SDN Teja II menyediakan sarana dan lingkungan yang memadai demi mendukung kenyamanan belajar dan perkembangan potensi setiap siswa.' }}
        </p>
      </div>

      <!-- Carousel Fasilitas -->
      <div class="relative px-1 sm:px-2">
        <UCarousel
          v-slot="{ item }"
          arrows
          dots
          loop
          wheel-gestures
          :items="props.items && props.items.length ? props.items : defaultFacilities"
          :ui="{
            viewport: 'overflow-hidden py-3',
            item: 'basis-full sm:basis-1/2 lg:basis-1/3 p-2.5',
            controls: 'relative mt-6 flex flex-col items-center gap-3',
            dots: 'relative inset-auto flex items-center justify-center gap-2',
            arrows: 'flex items-center justify-center gap-3',
            prev: 'static rounded-full bg-elevated shadow-xs border border-default/80 hover:bg-muted p-2',
            next: 'static rounded-full bg-elevated shadow-xs border border-default/80 hover:bg-muted p-2'
          }"
          class="w-full"
        >
          <div class="h-full rounded-2xl border border-default/80 bg-elevated p-5 flex flex-col justify-between shadow-sm transition-all duration-200 hover:border-primary/50">
            <div class="space-y-4">
              <!-- Foto Fasilitas -->
              <div class="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="size-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                >
                <div class="absolute top-2.5 left-2.5">
                  <UBadge
                    variant="subtle"
                    color="neutral"
                    class="bg-elevated/90 backdrop-blur-sm text-xs font-medium px-2 py-0.5 rounded-md border border-default/60"
                  >
                    {{ item.category }}
                  </UBadge>
                </div>
              </div>

              <!-- Judul & Deskripsi -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="size-7 rounded-lg bg-muted text-primary flex items-center justify-center border border-default/60">
                    <UIcon
                      :name="item.icon"
                      class="size-4"
                    />
                  </div>
                  <h3 class="text-base font-bold text-highlighted">
                    {{ item.name }}
                  </h3>
                </div>
                <p class="text-xs text-muted leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <!-- Fitur Utama -->
            <div class="space-y-1.5 pt-4 border-t border-default/50 mt-4 w-full">
              <div
                v-for="(feature, fIdx) in item.features"
                :key="fIdx"
                class="flex items-center gap-2 text-xs text-muted"
              >
                <UIcon
                  name="i-lucide-check"
                  class="size-3.5 text-primary shrink-0"
                />
                <span class="truncate">{{ feature }}</span>
              </div>
            </div>
          </div>
        </UCarousel>
      </div>
    </UContainer>
  </section>
</template>
