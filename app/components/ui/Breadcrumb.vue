<!-- app/components/Ui/Breadcrumb.vue -->
<script lang="ts" setup>
const { data: breadcrumbData } = await useAsyncData('Breadcrumbnavigation', () => queryCollectionNavigation('content'))

const breadcrumbs = useBreadcrumbs(breadcrumbData.value || [])
</script>

<template>
  <UBreadcrumb :items="breadcrumbs" />
</template>
