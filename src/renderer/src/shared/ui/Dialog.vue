<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="dialog p-3 b-rd-1.5 mx-3">
    <h3 class="text-m">{{ title }}</h3>
    <div v-if="description" class="text-s secondary mt-1.5">{{ description }}</div>

    <div class="mt-4">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
  font-weight: 500;
}
.dialog {
  background-color: var(--card-background);
}
</style>
