<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Selamat datang di website SDN TEJA II',
  },
  description: {
    type: String,
    default: 'Wujudkan Impian Pendidikan Berkualitas untuk Semua, Lingkungan Belajar yang Nyaman, Kreatif, dan Menyenangkan',
  },
  fasilitas: {
    type: Array as () => { image: string, label: string }[],
    default: () => ([
      { image: 'https://dummyimage.com/400x400', label: 'contoh1' },
      { image: 'https://dummyimage.com/400x700', label: 'contoh2' },
      { image: 'https://dummyimage.com/400x500', label: 'contoh3' },
      { image: 'https://dummyimage.com/400x600', label: 'contoh4' },
      { image: 'https://picsum.photos/1920/1080?random=1', label: 'contoh5' },
      { image: 'https://picsum.photos/1920/1080?random=2', label: 'contoh6' },
      { image: 'https://picsum.photos/1920/1080?random=3', label: 'contoh7' },

    ]),

  },
  cta: {
    type: String,
    default: 'Tentang Kami',
  },
  url: {
    type: String,
    default: '/',
  },
})

const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value)
      return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 1500)
})
</script>

<template>
  <UContainer>
    <div class=" grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>ini visi</div>
      <div>ini artikel terbaru</div>
    </div>
  </UContainer>
</template>
