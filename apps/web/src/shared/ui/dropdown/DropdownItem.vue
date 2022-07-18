<script setup lang="ts">
const emit = defineEmits(['click'])
</script>
<template>
  <a href="#" @click="emit('click')"><slot></slot></a>
</template>

<style scoped>
a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a:hover {
  background-color: #ddd;
}
</style>
