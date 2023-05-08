<script setup lang="ts">
defineProps<{ modelValue: number; name?: string }>()
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    class="flex-1"
    :name="name"
    type="range"
    min="0.1"
    max="2.0"
    step="0.1"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.valueAsNumber)"
  />
</template>
