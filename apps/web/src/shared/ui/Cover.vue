<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ size: number; title?: string; image?: string }>()

const coverUrl = computed(() => (props.image?.startsWith('http') ? props.image : `atom://${props.image}`))
</script>

<template>
  <img v-if="image" class="cover" :src="coverUrl" :alt="title" :width="size" :height="size" />
  <div v-else class="cover cover_empty" />
</template>

<style scoped>
.cover {
  border-radius: 16px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  object-fit: cover;
}

.cover_empty {
  background-color: gray;
}
</style>
