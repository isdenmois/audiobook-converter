<script setup lang="ts">
import { computed, StyleValue } from 'vue'

const props = defineProps<{
  size?: number
  imageSrc: string
}>()
const size = computed(() => ({ width: props.size || 24, height: props.size || 24 } as StyleValue))
</script>

<template>
  <div class="dropdown">
    <img class="dropbtn" :src="props.imageSrc" :style="size" />

    <div class="dropdown-content">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.dropbtn {
  border: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #f1f1f1;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #eee;
}
</style>
