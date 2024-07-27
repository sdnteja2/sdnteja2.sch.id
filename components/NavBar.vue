<script setup lang="ts">
const open = ref(false)
const trailingIcon = computed(() => open.value ? 'i-hugeicons-cancel-02' : 'i-hugeicons-dashboard-square-01')
const links = [
  [{
    label: 'Home',
    icon: 'i-hugeicons-home-03',
    to: '/',
  }, {
    label: 'Guru',
    icon: 'i-hugeicons-user',
    to: '/guru',
  }, {
    label: 'Berita',
    icon: 'i-hugeicons-news',
    to: '/berita',
  }, {
    label: 'Artikel',
    icon: 'i-hugeicons-notebook',
    to: '/artikel',
  }, {
    label: 'Kegiatan',
    icon: 'i-hugeicons-image-01',
    to: '/kegiatan',
  }],
]
</script>

<template>
  <div class="w-full fixed  top-0 z-50 bg-white dark:bg-gray-900">
    <UContainer class="flex h-14 md:h-16 justify-between items-center">
      <div>LOGO</div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <UHorizontalNavigation :links="links" class="hidden md:block" />
          <div class="flex items-center">
            <ColorMode />
          </div>
          <UDropdown v-model:open="open" class="md:hidden" :items="links" :popper="{ placement: 'bottom-start' }">
            <UButton color="gray" variant="ghost" :trailing-icon="trailingIcon" />
          </UDropdown>
        </div>
      </div>
    </UContainer>
  </div>
</template>
