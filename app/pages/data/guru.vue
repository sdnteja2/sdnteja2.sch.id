<script setup lang="ts">
interface SocialItem {
  platform?: string
  url: string
  icon?: string
  label?: string
}

interface StaffMember {
  name: string
  role: string
  category: string
  tugas: string
  pendidikan: string
  sertifikasi?: boolean
  avatar: string
  socials?: SocialItem[] | Record<string, string>
}

interface NormalizedSocial {
  platform: string
  url: string
  icon: string
  label: string
}

function resolveSocialMeta(platformOrUrl: string): { icon: string, label: string } {
  const str = platformOrUrl.toLowerCase()
  if (str.includes('instagram') || str === 'ig') {
    return { icon: 'i-simple-icons-instagram', label: 'Instagram' }
  }
  if (str.includes('facebook') || str === 'fb') {
    return { icon: 'i-simple-icons-facebook', label: 'Facebook' }
  }
  if (str.includes('tiktok') || str === 'tt') {
    return { icon: 'i-simple-icons-tiktok', label: 'TikTok' }
  }
  if (str.includes('youtube') || str.includes('youtu.be') || str === 'yt') {
    return { icon: 'i-simple-icons-youtube', label: 'YouTube' }
  }
  if (str.includes('twitter') || str.includes('x.com') || str === 'x') {
    return { icon: 'i-simple-icons-x', label: 'X (Twitter)' }
  }
  if (str.includes('whatsapp') || str.includes('wa.me') || str === 'wa') {
    return { icon: 'i-simple-icons-whatsapp', label: 'WhatsApp' }
  }
  if (str.includes('linkedin')) {
    return { icon: 'i-simple-icons-linkedin', label: 'LinkedIn' }
  }
  if (str.includes('telegram') || str.includes('t.me') || str === 'tg') {
    return { icon: 'i-simple-icons-telegram', label: 'Telegram' }
  }
  if (str.includes('threads')) {
    return { icon: 'i-simple-icons-threads', label: 'Threads' }
  }
  if (str.includes('github')) {
    return { icon: 'i-simple-icons-github', label: 'GitHub' }
  }
  if (str.includes('mailto:') || str === 'email' || str === 'mail') {
    return { icon: 'i-lucide-mail', label: 'Email' }
  }
  if (str.includes('http') || str === 'website' || str === 'web' || str === 'blog') {
    return { icon: 'i-lucide-globe', label: 'Website' }
  }
  return { icon: 'i-lucide-link', label: 'Tautan' }
}

function getStaffSocials(staff: StaffMember): NormalizedSocial[] {
  if (!staff.socials) return []

  if (Array.isArray(staff.socials)) {
    return staff.socials
      .filter((item) => Boolean(item && item.url))
      .map((item) => {
        const meta = resolveSocialMeta(item.platform || item.url)
        return {
          platform: item.platform || meta.label.toLowerCase(),
          url: item.url,
          icon: item.icon || meta.icon,
          label: item.label || meta.label
        }
      })
  }

  if (typeof staff.socials === 'object') {
    return Object.entries(staff.socials)
      .filter(([_, url]) => Boolean(url))
      .map(([platform, url]) => {
        const meta = resolveSocialMeta(platform || url)
        return {
          platform,
          url,
          icon: meta.icon,
          label: meta.label
        }
      })
  }

  return []
}

const categoryOptions = [
  'Semua Kategori',
  'Kepala Sekolah',
  'Guru Kelas',
  'Guru Mapel'
]

const defaultStaffList: StaffMember[] = [
  {
    name: 'Nama Guru',
    role: 'Jabatan',
    category: 'Guru Kelas',
    tugas: 'Tugas Pokok & Fungsi',
    pendidikan: 'S1',
    sertifikasi: true,
    avatar: 'i-lucide-user'
  }
]

const { data: staffList } = await useAsyncData('page-data-guru-list', async () => {
  const items = await queryCollection('guru').all()
  return items.sort((a, b) => {
    const numA = Number((a.stem || a.id || '').match(/(?:^|\/)(\d+)\./)?.[1] ?? 999)
    const numB = Number((b.stem || b.id || '').match(/(?:^|\/)(\d+)\./)?.[1] ?? 999)
    if (numA !== numB) {
      return numA - numB
    }
    return (a.stem || a.id || '').localeCompare(b.stem || b.id || '', undefined, { numeric: true })
  })
})

const activeStaffList = computed<StaffMember[]>(() => {
  return staffList.value?.length ? staffList.value : defaultStaffList
})

useSeoMeta({
  title: 'Guru & Tenaga Kependidikan',
  description:
    'Profil pendidik profesional dan staf tenaga kependidikan yang berdedikasi membimbing dan mendampingi siswa SD Negeri Teja II.',
  ogTitle: 'Guru & Tenaga Kependidikan | SDN Teja II',
  ogDescription:
    'Profil pendidik profesional dan staf tenaga kependidikan yang berdedikasi membimbing dan mendampingi siswa SD Negeri Teja II.'
})

defineOgImage('OgImage', {
  page: 'Data Guru',
  title: 'Guru & Tenaga Kependidikan',
  description: 'Profil pendidik profesional dan staf tenaga kependidikan yang berdedikasi membimbing dan mendampingi siswa SD Negeri Teja II.'
})

const searchQuery = ref('')
const selectedCategory = ref('Semua Kategori')

const filteredStaff = computed(() => {
  return activeStaffList.value.filter((item) => {
    const matchCat
      = selectedCategory.value === 'Semua Kategori'
        || item.category === selectedCategory.value
    const matchSearch
      = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.role.toLowerCase().includes(searchQuery.value.toLowerCase())
        || item.tugas.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchSearch
  })
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <UContainer class="space-y-8">
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
            to="/data"
            class="hover:text-highlighted transition-colors"
          >
            Data
          </NuxtLink>
          <span>/</span>
          <span class="text-highlighted font-medium">Guru & Tendik</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
              Guru & Tenaga Kependidikan
            </h1>
            <p class="text-muted text-base sm:text-lg mt-1 max-w-2xl">
              Tenaga pendidik profesional dan staf pendukung yang berdedikasi mendidik, melayani, dan membina generasi berkarakter.
            </p>
          </div>

          <UBadge
            variant="subtle"
            color="neutral"
            size="md"
            class="self-start md:self-auto"
          >
            Total: {{ activeStaffList.length }} Pendidik & Staf
          </UBadge>
        </div>
      </div>

      <!-- Search & Dropdown Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-default bg-elevated/40">
        <div class="flex-1 max-w-md">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Cari nama guru atau bidang tugas..."
            size="md"
            class="w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-muted hidden sm:inline">Kategori:</span>
          <USelect
            v-model="selectedCategory"
            :items="categoryOptions"
            icon="i-lucide-filter"
            size="md"
            class="w-full sm:w-56"
          />
        </div>
      </div>

      <!-- Staff Grid -->
      <div
        v-if="filteredStaff.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <UCard
          v-for="staff in filteredStaff"
          :key="staff.name"
          variant="subtle"
          class="transition-all hover:ring-primary/50"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-2">
              <UUser
                :name="staff.name"
                :description="staff.role"
                :avatar="{ icon: staff.avatar }"
                size="lg"
                :ui="{
                  name: 'font-bold text-highlighted',
                  description: 'text-primary text-xs font-semibold uppercase tracking-wider'
                }"
              />
            </div>

            <div class="pt-3 border-t border-default space-y-2.5 text-sm">
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-briefcase"
                  class="size-4 mt-0.5 text-muted shrink-0"
                />
                <div class="min-w-0">
                  <p class="text-dimmed text-[11px] uppercase tracking-wide">
                    Tugas
                  </p>
                  <p class="text-highlighted font-medium">
                    {{ staff.tugas }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-graduation-cap"
                  class="size-4 mt-0.5 text-muted shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-dimmed text-[11px] uppercase tracking-wide">
                    Pendidikan
                  </p>
                  <div class="flex items-center flex-wrap gap-1.5">
                    <span class="text-highlighted font-medium">{{ staff.pendidikan }}</span>
                    <UBadge
                      v-if="staff.sertifikasi"
                      color="success"
                      variant="subtle"
                      size="xs"
                      icon="i-lucide-check-circle"
                    >
                      Tersertifikasi
                    </UBadge>
                  </div>
                </div>
              </div>

              <!-- Social Media Links (Fleksibel: Tampil hanya jika ada) -->
              <div
                v-if="getStaffSocials(staff).length > 0"
                class="pt-2.5 border-t border-default/60 flex items-center justify-between gap-2"
              >
                <span class="text-dimmed text-[11px] uppercase tracking-wide">
                  Media Sosial
                </span>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <UTooltip
                    v-for="(soc, sIdx) in getStaffSocials(staff)"
                    :key="sIdx"
                    :text="soc.label"
                  >
                    <UButton
                      :to="soc.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      :icon="soc.icon"
                      size="xs"
                      color="neutral"
                      variant="subtle"
                      class="size-7 p-0 flex items-center justify-center rounded-lg hover:text-primary hover:bg-primary/10 transition-colors"
                      :aria-label="`${soc.label} ${staff.name}`"
                    />
                  </UTooltip>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="text-center py-16 space-y-3 rounded-2xl border border-dashed border-default p-8"
      >
        <UIcon
          name="i-lucide-user-x"
          class="size-10 text-muted mx-auto"
        />
        <p class="text-highlighted font-semibold text-lg">
          Data Guru Tidak Ditemukan
        </p>
        <p class="text-muted text-sm max-w-sm mx-auto">
          Tidak ada data pendidik yang cocok dengan kata kunci atau kategori yang dipilih.
        </p>
        <UButton
          label="Reset Filter"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="searchQuery = ''; selectedCategory = 'Semua Kategori'"
        />
      </div>
    </UContainer>
  </div>
</template>
