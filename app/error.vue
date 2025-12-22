<script setup lang="ts">
import type { NuxtError } from '#app'

// Props untuk error
const props = defineProps<{ error: NuxtError }>()

// SEO Meta untuk halaman error
useSeoMeta({
  title: `Error ${props.error.statusCode || 500} - SDN Teja II`,
  description: 'Terjadi kesalahan pada halaman yang Anda cari.',
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="max-w-md mx-auto text-center">
      <!-- Logo -->
      <NuxtLink to="/" class="inline-block mb-8">
        <UiLogo />
      </NuxtLink>

      <!-- Error Code -->
      <h1 class="text-6xl font-bold text-sky-600 dark:text-sky-500 mb-4">
        {{ error.statusCode || 500 }}
      </h1>

      <!-- Error Message -->
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ error.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan' }}
      </h2>

      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ error.statusMessage || 'Maaf, terjadi kesalahan yang tidak terduga.' }}
      </p>

      <!-- Action Button -->
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-home"
        class="w-full sm:w-auto"
        to="/"
      >
        Kembali ke Beranda
      </UButton>
    </div>
  </div>
</template>

<style scoped>
/* Animasi sederhana untuk error code */
h1 {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
