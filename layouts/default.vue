<script setup lang="ts"></script>

<template>
  <div>
    <!-- header -->
    <header class="text-gray-600 body-font">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <NuxtLink to="/" class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span class="ml-3 text-xl">Tailblocks</span>
        </NuxtLink>
        <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <NuxtLink to="/" class="mr-5 hover:text-gray-900">
            Home
          </NuxtLink>
          <NuxtLink to="/guru" class="mr-5 hover:text-gray-900">
            Guru
          </NuxtLink>
          <NuxtLink to="/berita" class="mr-5 hover:text-gray-900">
            Berita
          </NuxtLink>
          <NuxtLink to="/artikel" class="mr-5 hover:text-gray-900">
            Artikel
          </NuxtLink>
          <NuxtLink to="/kegiatan" class="mr-5 hover:text-gray-900">
            Kegiatan
          </NuxtLink>
        </nav>
        <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
          Button
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </header>
    <slot />
    <!-- footer -->
    <footer class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left md:mt-0 mt-10">
          <NuxtLink class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span class="ml-3 text-xl">Tailblocks</span>
          </NuxtLink>
          <p class="mt-2 text-sm text-gray-500">
            Air plant banjo lyft occupy retro adaptogen indego
          </p>
        </div>
        <div class="flex-grow flex flex-wrap md:pr-20 -mb-10 md:text-left text-center order-first">
          <div class="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              CATEGORIES
            </h2>
            <nav class="list-none mb-10">
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  First Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Second Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Third Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Fourth Link
                </NuxtLink>
              </li>
            </nav>
          </div>
          <div class="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              CATEGORIES
            </h2>
            <nav class="list-none mb-10">
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  First Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Second Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Third Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Fourth Link
                </NuxtLink>
              </li>
            </nav>
          </div>
          <div class="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              CATEGORIES
            </h2>
            <nav class="list-none mb-10">
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  First Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Second Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Third Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Fourth Link
                </NuxtLink>
              </li>
            </nav>
          </div>
          <div class="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              CATEGORIES
            </h2>
            <nav class="list-none mb-10">
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  First Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Second Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Third Link
                </NuxtLink>
              </li>
              <li>
                <NuxtLink class="text-gray-600 hover:text-gray-800">
                  Fourth Link
                </NuxtLink>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div class="bg-gray-100">
        <div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p class="text-gray-500 text-sm text-center sm:text-left">
            © 2020 Tailblocks —
            <NuxtLink href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">
              @knyttneve
            </NuxtLink>
          </p>
          <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
            <NuxtLink class="text-gray-500">
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </NuxtLink>
            <NuxtLink class="ml-3 text-gray-500">
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </NuxtLink>
            <NuxtLink class="ml-3 text-gray-500">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
              </svg>
            </NuxtLink>
            <NuxtLink class="ml-3 text-gray-500">
              <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" stroke="none" />
              </svg>
            </NuxtLink>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
