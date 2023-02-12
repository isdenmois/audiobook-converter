<script setup lang="ts">
defineProps<{ value: number }>()
</script>

<template>
  <progress max="100" :value="value" />
</template>

<style scoped>
progress {
  height: 16px;
  appearance: none;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  color: red;
  background-color: red;
}

progress::-webkit-progress-bar {
  background-color: #e3ebfe;
}

progress::-webkit-progress-value {
  background-color: #4484ff;
  border-radius: 4px;
}
</style>
