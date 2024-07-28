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
  <div class="w-full fixed  top-0 z-50  bg-gray-100/75 dark:bg-gelap-900/75 backdrop-blur">
    <UContainer class="flex h-14 md:h-16 justify-between items-center">
      <div>LOGO</div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <UHorizontalNavigation
            :ui="{
              active: 'text-primary-700  dark:text-primary-300 font-black after:bg-primary-500 dark:after:bg-primary-400 after:rounded-full',
              icon: {
                base: 'flex-shrink-0 w-5 h-5 relative',
                active: 'text-primary-700 dark:text-primary-400',
                inactive: 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200',
              },

            }" :links="links" class="hidden md:block"
          />
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
