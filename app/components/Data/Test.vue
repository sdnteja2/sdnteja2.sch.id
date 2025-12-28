<script lang="ts" setup>
interface RevenueDataItem {
  month: string
  desktop: number
  mobile: number
}

const RevenueData: RevenueDataItem[] = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const RevenueCategoriesMultple = {
  desktop: { name: 'Desktop', color: '#3b82f6' },
  mobile: { name: 'Mobile', color: '#22c55e' },
}

const xFormatter = (i: number): string => `${RevenueData[i]?.month}`
const yFormatter = (tick: number) => tick.toString()
</script>

<template>
  <BarChart
    :data="RevenueData"
    :height="300"
    :categories="RevenueCategoriesMultple"
    :y-axis="['desktop', 'mobile']"
    :group-padding="0"
    :bar-padding="0.2"
    :x-num-ticks="6"
    :radius="4"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    :legend-position="LegendPosition.TopRight"
    :hide-legend="false"
    :y-grid-line="true"
  />
</template>
