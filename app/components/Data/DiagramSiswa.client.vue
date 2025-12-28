<script setup lang="ts">
import { Motion } from 'motion-v'

const {
  kelasBreakdown,
} = useSiswaData()

// Bar Chart Data - Transform class breakdown for chart
const chartData = computed(() => {
  return kelasBreakdown.value.map(kelas => ({
    'kelas': `Kelas ${kelas.kelas}`,
    'laki-laki': kelas.laki,
    'perempuan': kelas.perempuan,
    'total': kelas.total,
  }))
})

// Chart categories for gender
const genderCategories = {
  'laki-laki': { name: 'Laki-laki', color: '#3b82f6' },
  'perempuan': { name: 'Perempuan', color: '#ec4899' },
}

// Chart formatters
const xFormatter = (i: number): string => chartData.value[i]?.kelas || ''
const yFormatter = (tick: number) => tick.toString()
</script>

<template>
  <UContainer>
    <Motion
      :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :transition="{ delay: 0.1 }"
    >
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Distribusi Siswa Per Kelas
          </h3>
        </template>

        <BarChart
          :data="chartData"
          :height="300"
          :categories="genderCategories"
          :y-axis="['laki-laki', 'perempuan']"
          :group-padding="0"
          :bar-padding="0.2"
          :x-num-ticks="chartData.length"
          :radius="4"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
          :y-grid-line="true"
        >
          <template #tooltip="{ values }">
            <div>
              <div class="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                {{ values?.kelas }}
              </div>
              <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Total: <strong>{{ values?.total }}</strong> siswa
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-sm">
                  <span class="inline-block h-3 w-3 rounded" style="background-color: #3b82f6" />
                  <span class="text-gray-700 dark:text-gray-300">Laki-laki: <strong>{{ values?.['laki-laki'] }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="inline-block h-3 w-3 rounded" style="background-color: #ec4899" />
                  <span class="text-gray-700 dark:text-gray-300">Perempuan: <strong>{{ values?.perempuan }}</strong></span>
                </div>
              </div>
            </div>
          </template>
        </BarChart>
      </UCard>
    </Motion>
  </UContainer>
</template>

<style>
:root {
  /* Tooltip - Container Background */
  --vis-tooltip-background-color: var(--ui-bg) !important;
  --vis-tooltip-text-color: var(--ui-text) !important;
  --vis-tooltip-border-color: var(--ui-border) !important;
}
</style>
