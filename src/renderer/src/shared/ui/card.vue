<script setup lang="ts">
const props = defineProps(['class'])
</script>

<template>
  <div class="card" :class="props.class">
    <slot></slot>
  </div>
</template>
<style>
.card {
  padding: 24px;
  background-color: var(--card-background);
  border-radius: 16px;
}
</style>
