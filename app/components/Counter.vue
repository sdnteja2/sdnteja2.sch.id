<script setup lang="ts">
const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
</script>

<template>
  <div>
    <h3>Counter: {{ count }}</h3>
    <UButton color="primary" @click="increment">
      Increment
    </UButton>
    <UButton color="error" @click="decrement">
      Decrement
    </UButton>
  </div>
</template>

<style scoped>
button {
  margin: 5px;
}
</style>
