<script setup lang="ts">
const { data: page } = await useAsyncData('home-index', () =>
  queryCollection('index').first()
)

const { data: facilitiesData } = await useAsyncData('home-facilities', () =>
  queryCollection('facilities').first()
)

const { data: alumniData } = await useAsyncData('home-alumni', () =>
  queryCollection('alumni').first()
)

useSeoMeta({
  title: page.value?.title || 'SD Negeri Teja II - Berkarakter, Cerdas & Berakhlak Mulia',
  description:
    page.value?.description
    || 'Website resmi SD Negeri Teja II, Kecamatan Rajagaluh, Kabupaten Majalengka. Sekolah ramah anak yang menumbuhkan karakter dan potensi siswa.',
  ogTitle: page.value?.title || 'SD Negeri Teja II Rajagaluh',
  ogDescription:
    page.value?.description
    || 'Website resmi SD Negeri Teja II, Kecamatan Rajagaluh, Kabupaten Majalengka. Sekolah ramah anak yang menumbuhkan karakter dan potensi siswa.',
  ogImage: page.value?.hero?.image?.src || '/cover/sekolah.png'
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HomeHero :data="page?.hero" />

    <!-- Selayang Pandang & Visi Misi Tujuan Section -->
    <HomeProfile :data="page?.profile" />

    <!-- Fasilitas Sekolah Carousel Section -->
    <HomeFacilities
      :section="page?.facilities_section"
      :items="facilitiesData?.items"
    />

    <!-- Alumni Section -->
    <HomeAlumni
      :section="page?.alumni_section"
      :items="alumniData?.items"
    />
  </div>
</template>
