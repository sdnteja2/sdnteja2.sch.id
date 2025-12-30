<script setup lang="ts">
const route = useRoute()
const router = useRouter()

// Fetch artikel dan berita data dengan penanganan kesalahan
const { data: artikels } = await useAsyncData(route.path, async () => {
  const artikelData = await queryCollection('artikel').order('date', 'DESC').all()
  const beritaData = await queryCollection('berita').order('date', 'DESC').all()
  return [...artikelData, ...beritaData]
})

// Mengambil semua tag dari setiap artikel dan berita
const tags = computed<string[]>(() => {
  const selectedTags = new Set<string>()
  if (artikels.value?.length) {
    artikels.value.forEach((item) => {
      if (item.tags?.length) {
        item.tags.forEach((tag) => {
          selectedTags.add(tag)
        })
      }
    })
  }
  return Array.from(selectedTags)
})

// State untuk menyimpan tag yang dipilih
const selectedTag = ref('')

// Fungsi untuk menangani pemilihan tag
function handleTagSelect(tag: string) {
  if (tag) {
    router.push(`/tags/${tag}`)
  }
}
</script>

<template>
  <div data-aos="fade-up" class="flex w-full justify-end my-4 items-center">
    <USelect
      v-model="selectedTag"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
        placeholder: 'truncate text-night-800 dark:text-night-300',
      }"
      placeholder="Tag"
      :items="tags"
      class="w-32"
      @update:model-value="handleTagSelect"
    />
  </div>
</template>
