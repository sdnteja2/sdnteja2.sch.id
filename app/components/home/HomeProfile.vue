<script setup lang="ts">
interface PrincipalData {
  name: string
  role: string
  location: string
  avatar: string
}

interface ProfileData {
  headline?: string
  title: string
  description: string
  quote: string
  principal: PrincipalData
  vision: string
  missions: string[]
  goals: string[]
}

const props = defineProps<{
  data?: ProfileData
}>()

const defaultMisi = [
  'Menciptakan lingkungan sekolah yang bernuansa agamis, bersih dan sehat',
  'Meningkatkan kegiatan ibadah melalui kegiatan kultum dan Shalat berjamaah',
  'Mengoptimalkan guru profesional dan berdedikasi tinggi sehingga peserta didik mempunyai kompetensi yang baik dan berkarakter',
  'Menyelenggarakan pendidikan, pelatihan dan pembinaan berdasarkan bakat, minat dan kreativitas peserta didik melalui ekstrakurikuler',
  'Meningkatkan prestasi peserta didik dengan mengoptimalkan proses pembelajaran yang efektif dan efisien'
]

const defaultTujuan = [
  'Terciptanya lingkungan yang agamis, bersih dan sehat',
  'Meningkatnya ketakwaan peserta didik terhadap Tuhan Yang Maha Esa',
  'Berkembangnya profesionalisme tenaga pendidik',
  'Terbentuknya pribadi peserta didik yang cerdas, terampil, kreatif, aktif dan berkarakter',
  'Meningkatnya jumlah peserta didik yang melanjutkan pendidikan ke jenjang yang lebih tinggi'
]
</script>

<template>
  <section
    id="profil"
    class="py-12 sm:py-16 lg:py-20 border-t border-default/50"
  >
    <UContainer>
      <!-- Layout 2 Kolom: Kiri Sticky (Selayang Pandang), Kanan Scrollable (Visi Misi Tujuan) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <!-- Kolom Kiri: Selayang Pandang & Sambutan Kepala Sekolah (Sticky di Desktop) -->
        <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 rounded-full border border-default/70 bg-muted px-3.5 py-1 text-xs font-semibold text-highlighted">
              <span class="inline-block size-2 rounded-full bg-primary" />
              <span>{{ props.data?.headline || 'Selayang Pandang' }}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-highlighted">
              {{ props.data?.title || 'Sambutan Kepala Sekolah' }}
            </h2>
            <p class="text-sm text-muted leading-relaxed">
              {{ props.data?.description || 'Mewujudkan layanan pendidikan transparan, berkualitas, dan kolaboratif bagi seluruh keluarga besar SDN Teja II.' }}
            </p>
          </div>

          <!-- Card Sambutan -->
          <UPageCard
            variant="subtle"
            class="border border-default/70 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <!-- Teks Sambutan -->
            <div class="space-y-3">
              <UIcon
                name="i-lucide-quote"
                class="size-7 text-primary/40"
              />
              <p class="text-sm sm:text-base text-muted leading-relaxed italic">
                &ldquo;{{ props.data?.quote || 'Kehadiran website sekolah ini merupakan salah satu upaya kita untuk meningkatkan layanan informasi dan komunikasi sekolah kepada seluruh stakeholders, termasuk siswa, guru, karyawan, orang tua siswa, alumni, dan masyarakat umum.' }}&rdquo;
              </p>
            </div>

            <USeparator />

            <!-- Profil Kepala Sekolah -->
            <div class="flex items-center gap-4">
              <div class="size-14 shrink-0 rounded-full border-2 border-primary/30 overflow-hidden bg-muted flex items-center justify-center">
                <img
                  :src="props.data?.principal?.avatar || '/cover/guru.png'"
                  :alt="props.data?.principal?.name || 'Kepala Sekolah SDN Teja II'"
                  class="size-full object-cover"
                >
              </div>
              <div class="min-w-0">
                <div class="text-base font-bold text-highlighted truncate">
                  {{ props.data?.principal?.name || 'Susi Susanti, S.Pd.I., M.Pd.' }}
                </div>
                <div class="text-xs font-medium text-primary">
                  {{ props.data?.principal?.role || 'Kepala Sekolah SDN Teja II' }}
                </div>
                <div class="text-[11px] text-muted">
                  {{ props.data?.principal?.location || 'Kec. Rajagaluh, Kab. Majalengka' }}
                </div>
              </div>
            </div>
          </UPageCard>
        </div>

        <!-- Kolom Kanan: Visi, Misi, dan Tujuan (Bisa di-scroll) -->
        <div class="lg:col-span-7 space-y-10">
          <!-- 1. Visi -->
          <div class="space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="size-8 rounded-lg bg-muted text-primary flex items-center justify-center border border-default/60">
                <UIcon
                  name="i-lucide-compass"
                  class="size-4"
                />
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-highlighted">
                Visi Sekolah
              </h3>
            </div>

            <UPageCard
              variant="subtle"
              class="border border-primary/40 rounded-2xl p-6"
            >
              <p class="text-base sm:text-lg font-semibold text-highlighted leading-relaxed">
                &ldquo;{{ props.data?.vision || 'Terwujudnya pribadi yang beriman dan bertakwa kepada Tuhan Yang Maha Esa, berilmu, berkarakter, terampil, kreatif dan berprestasi.' }}&rdquo;
              </p>
            </UPageCard>
          </div>

          <!-- 2. Misi -->
          <div class="space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="size-8 rounded-lg bg-muted text-primary flex items-center justify-center border border-default/60">
                <UIcon
                  name="i-lucide-target"
                  class="size-4"
                />
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-highlighted">
                Misi Sekolah
              </h3>
            </div>

            <div class="space-y-3">
              <div
                v-for="(misi, idx) in (props.data?.missions?.length ? props.data.missions : defaultMisi)"
                :key="idx"
                class="flex items-start gap-3.5 p-4 rounded-xl border border-default/60 bg-muted/30 transition-colors hover:bg-muted/50"
              >
                <div class="size-7 shrink-0 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5 shadow-xs">
                  {{ idx + 1 }}
                </div>
                <p class="text-sm text-highlighted leading-relaxed">
                  {{ misi }}
                </p>
              </div>
            </div>
          </div>

          <!-- 3. Tujuan -->
          <div class="space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="size-8 rounded-lg bg-muted text-primary flex items-center justify-center border border-default/60">
                <UIcon
                  name="i-lucide-award"
                  class="size-4"
                />
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-highlighted">
                Tujuan Pendidikan
              </h3>
            </div>

            <div class="space-y-3">
              <div
                v-for="(tujuan, idx) in (props.data?.goals?.length ? props.data.goals : defaultTujuan)"
                :key="idx"
                class="flex items-start gap-3.5 p-4 rounded-xl border border-default/60 bg-muted/30 transition-colors hover:bg-muted/50"
              >
                <div class="size-7 shrink-0 rounded-lg bg-muted text-primary border border-default/60 flex items-center justify-center text-xs font-bold mt-0.5">
                  <UIcon
                    name="i-lucide-check"
                    class="size-4"
                  />
                </div>
                <p class="text-sm text-highlighted leading-relaxed">
                  {{ tujuan }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
