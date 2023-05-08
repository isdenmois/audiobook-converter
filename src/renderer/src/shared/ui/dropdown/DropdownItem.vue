<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
  <a href="#" class="text-s" @click="emit('click')"><slot></slot></a>
</template>

<style scoped>
a {
  color: var(--primary-text);
  padding: 8px 16px;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a:hover {
  background-color: var(--background);
}
</style>
