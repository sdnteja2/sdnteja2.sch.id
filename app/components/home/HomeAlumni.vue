<script setup lang="ts">
interface Alumni {
  nama: string
  jabatan: string
  instansi: string
  angkatan: string
  foto: string
  kutipan: string
}

const alumniList: Alumni[] = [
  {
    nama: 'Wiwi Widiawati, S.I.P.',
    jabatan: 'Kepala Desa',
    instansi: 'Pemerintah Desa Teja',
    angkatan: 'Alumni 2005',
    foto: '/alumni/wiwi-widiawati-kepala-desa-tiga-periode.jpg',
    kutipan: 'Pondasi kejujuran dan disiplin yang ditanamkan para guru di SDN Teja II menjadi bekal berharga dalam melayani masyarakat.'
  },
  {
    nama: 'Deden Kurniawan, S.Pd.',
    jabatan: 'Pendidik & Pembina Pramuka',
    instansi: 'Dinas Pendidikan Kab. Majalengka',
    angkatan: 'Alumni 2008',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    kutipan: 'Kecintaan saya pada dunia pendidikan dan kepanduan bermula dari bimbingan hangat bapak dan ibu guru di sekolah tercinta.'
  },
  {
    nama: 'Rian Firmansyah, S.Kom.',
    jabatan: 'Software Engineer',
    instansi: 'Industri Teknologi Digital',
    angkatan: 'Alumni 2012',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    kutipan: 'Rasa ingin tahu dan dorongan belajar yang dibangun sejak SD menjadi modal utama bersaing di era transformasi teknologi.'
  },
  {
    nama: 'Nisa Anggraeni, S.Tr.Keb.',
    jabatan: 'Bidan Desa',
    instansi: 'Puskesmas Kec. Rajagaluh',
    angkatan: 'Alumni 2014',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    kutipan: 'Nilai kepedulian dan kebersamaan di SDN Teja II memotivasi saya untuk terus mengabdi bagi kesehatan ibu dan anak di desa.'
  },
  {
    nama: 'Arief Budiman, S.T.',
    jabatan: 'Praktisi Infrastruktur & Sipil',
    instansi: 'BUMN Konstruksi Nasional',
    angkatan: 'Alumni 2010',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    kutipan: 'Pelajaran tentang kerja keras dan pantang menyerah di sekolah dasar selalu menjadi pedoman dalam menyelesaikan berbagai proyek di lapangan.'
  },
  {
    nama: 'Siti Rahmawati, S.Farm.',
    jabatan: 'Apoteker Klinis',
    instansi: 'RSUD Kabupaten Majalengka',
    angkatan: 'Alumni 2015',
    foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    kutipan: 'Bimbingan bapak dan ibu guru membuka wawasan saya untuk mencintai sains dan terus melanjutkan pendidikan ke jenjang tinggi.'
  }
]
</script>

<template>
  <section
    id="alumni"
    class="py-12 sm:py-16 lg:py-20 border-t border-default/50"
  >
    <UContainer>
      <!-- Section Header -->
      <div class="max-w-2xl mx-auto text-center space-y-3 mb-10 sm:mb-14">
        <div class="inline-flex items-center gap-2 rounded-full border border-default/70 bg-muted px-3.5 py-1 text-xs font-semibold text-highlighted">
          <span class="inline-block size-2 rounded-full bg-primary" />
          <span>Jejak Prestasi & Pengabdian</span>
        </div>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-highlighted">
          Kiprah Alumni SDN Teja II
        </h2>
        <p class="text-sm sm:text-base text-muted leading-relaxed">
          Keluarga besar alumni SDN Teja II yang kini berkarya di berbagai sektor pemerintahan, pendidikan, kesehatan, dan industri.
        </p>
      </div>

      <!-- Alumni Carousel -->
      <div class="relative px-1 sm:px-2">
        <UCarousel
          v-slot="{ item }"
          arrows
          dots
          loop
          wheel-gestures
          :items="alumniList"
          :ui="{
            viewport: 'overflow-hidden py-3',
            item: 'basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-2.5',
            controls: 'relative mt-6 flex flex-col items-center gap-3',
            dots: 'relative inset-auto flex items-center justify-center gap-2',
            arrows: 'flex items-center justify-center gap-3',
            prev: 'static rounded-full bg-elevated shadow-xs border border-default/80 hover:bg-muted p-2',
            next: 'static rounded-full bg-elevated shadow-xs border border-default/80 hover:bg-muted p-2'
          }"
          class="w-full"
        >
          <div class="h-full flex flex-col justify-between border border-default/80 bg-elevated rounded-2xl p-6 shadow-sm transition-all duration-200 hover:border-primary/50 space-y-4">
            <!-- Bagian Foto & Angkatan -->
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-3">
                <div class="size-16 rounded-full border-2 border-primary/30 overflow-hidden bg-muted shrink-0 shadow-xs">
                  <img
                    :src="item.foto"
                    :alt="item.nama"
                    class="size-full object-cover"
                    loading="lazy"
                  >
                </div>
                <UBadge
                  variant="subtle"
                  color="neutral"
                  class="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-default/60"
                >
                  {{ item.angkatan }}
                </UBadge>
              </div>

              <!-- Nama & Jabatan -->
              <div class="space-y-0.5">
                <h3 class="text-base font-bold text-highlighted line-clamp-1">
                  {{ item.nama }}
                </h3>
                <div class="text-xs font-semibold text-primary line-clamp-1">
                  {{ item.jabatan }}
                </div>
                <div class="text-[11px] text-muted line-clamp-1">
                  {{ item.instansi }}
                </div>
              </div>
            </div>

            <!-- Kutipan / Cerita Singkat -->
            <div class="pt-3 border-t border-default/50 mt-auto">
              <p class="text-xs text-muted leading-relaxed italic line-clamp-4">
                &ldquo;{{ item.kutipan }}&rdquo;
              </p>
            </div>
          </div>
        </UCarousel>
      </div>

      <!-- Banner Pendataan Alumni -->
      <div class="mt-8 rounded-2xl border border-default/70 bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="space-y-1 text-center sm:text-left">
          <div class="text-base font-bold text-highlighted">
            Apakah Anda Bagian dari Alumni SDN Teja II?
          </div>
          <p class="text-xs sm:text-sm text-muted">
            Mari pererat silaturahmi almamater, berbagi kisah inspirasi, dan berpartisipasi dalam kemajuan adik-adik kelas.
          </p>
        </div>
        <div class="shrink-0">
          <UButton
            label="Ikatan Alumni & Kontak"
            to="#kontak"
            icon="i-lucide-users"
            size="md"
            color="primary"
          />
        </div>
      </div>
    </UContainer>
  </section>
</template>
