<script setup lang="ts">
defineProps({
  nama: {
    type: String,
    default: 'Yusup, S.Pd.',
  },
  jabatan: {
    type: String,
    default: ' Kepala Sekolah',
  },
  image: {
    type: String,
    default: ' https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
  },
  deskripsi: {
    type: String,
    default: 'Kehadiran website sekolah ini merupakan salah satu upaya kita untuk meningkatkan layanan informasi dan komunikasi sekolah kepada seluruh stakeholders, termasuk siswa, guru, karyawan, orang tua siswa, alumni, dan masyarakat umum.',
  },
})
</script>

<template>
  <div>
    <!-- selayang -->
    <section class=" ">
      <div class=" px-5 py-24 mx-auto flex flex-col">
        <div class="lg:w-4/6 mx-auto">
          <div class="flex items-center flex-col sm:flex-row mt-10">
            <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
              <div class="w-32 h-32  inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-400">
                <NuxtImg
                  :src="image"
                  height="350"
                  width="350"
                  :alt="jabatan"
                  :title="nama"
                  preset="wide"
                  class="w-full rounded-full object-cover object-center  "
                />
              </div>
              <div class="flex flex-col items-center text-center justify-center">
                <h2 class="font-bold  mt-4 text-gray-900 text-lg">
                  Yusup, S.Pd.
                </h2>
                <div class="w-12 h-1 bg-primary-500 rounded mt-2 mb-4" />
                <p class="text-base">
                  Kepala Sekolah
                </p>
              </div>
            </div>
            <div
              class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left"
            >
              <p class="leading-relaxed text-lg ">
                "{{ deskripsi }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
