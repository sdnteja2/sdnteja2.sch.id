<script setup lang="ts"></script>

<template>
  <div>
    <HeroSection />
    <!-- Card Grid -->
    <div class="py-12 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
      <!-- Card -->
      <a class="group flex flex-col focus:outline-none" href="#">
        <div class="aspect-w-16 aspect-h-12 overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img class="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl" src="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Image">
        </div>

        <div class="pt-4">
          <h3 class="relative inline-block font-medium text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition before:origin-left before:scale-x-0 group-hover:before:scale-x-100 dark:text-white">
            eYoga
          </h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">
            A revamped and dynamic approach to yoga analytics
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Discovery
            </span>
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Brand Guidelines
            </span>
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Yoga
            </span>
          </div>
        </div>
      </a>
      <!-- End Card -->

      <!-- Card -->
      <a class="group flex flex-col focus:outline-none" href="#">
        <div class="aspect-w-16 aspect-h-12 overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img class="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl" src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Image">
        </div>

        <div class="pt-4">
          <h3 class="relative inline-block font-medium text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition before:origin-left before:scale-x-0 group-hover:before:scale-x-100 dark:text-white">
            Nike React
          </h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">
            Rewriting sport's playbook for billions of athletes
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Brand Strategy
            </span>
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Visual Identity
            </span>
          </div>
        </div>
      </a>
      <!-- End Card -->

      <!-- Card -->
      <a class="group flex flex-col focus:outline-none" href="#">
        <div class="aspect-w-16 aspect-h-12 overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img class="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl" src="https://images.unsplash.com/photo-1649999920973-ab6bfd0c0017?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Image">
        </div>

        <div class="pt-4">
          <h3 class="relative inline-block font-medium text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition before:origin-left before:scale-x-0 group-hover:before:scale-x-100 dark:text-white">
            Day Spa
          </h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">
            Designing a new cocktail can
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Brand Strategy
            </span>
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Visual Identity
            </span>
          </div>
        </div>
      </a>
      <!-- End Card -->

      <!-- Card -->
      <a class="group flex flex-col focus:outline-none" href="#">
        <div class="aspect-w-16 aspect-h-12 overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <img class="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl" src="https://images.unsplash.com/photo-1528291954423-c0c71c12baeb?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Blog Image">
        </div>

        <div class="pt-4">
          <h3 class="relative inline-block font-medium text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition before:origin-left before:scale-x-0 group-hover:before:scale-x-100 dark:text-white">
            Diamond Dynamics
          </h3>
          <p class="mt-1 text-gray-600 dark:text-neutral-400">
            From cutting-edge equipment to stylish apparel
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Sports Gear
            </span>
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Equipment
            </span>
            <span class="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
              Discovery
            </span>
          </div>
        </div>
      </a>
      <!-- End Card -->
    </div>
    <!-- End Card Grid -->
  </div>
</template>

<style scoped></style>
