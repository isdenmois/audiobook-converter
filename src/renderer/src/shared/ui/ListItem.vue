<script setup lang="ts">
import Cover from './Cover.vue'

defineProps<{
  title: string
  clickable?: boolean
  subtitle?: string
  image?: string
}>()
const emit = defineEmits(['click'])
</script>

<template>
  <li class="flex flex-row items-center mb-2 gap-2" :class="{ clickable }" @click="emit('click')">
    <Cover :size="100" :image="image" :title="title" />

    <div class="flex-1">
      <div>{{ title }}</div>
      <div v-if="subtitle" class="subtitle">
        {{ subtitle }}
      </div>
    </div>

    <slot />
  </li>
</template>

<style scoped>
li {
  border-radius: 16px;
  background-color: var(--card-background);
  list-style-type: none;
  margin: 2px 2px 16px;
}

.clickable {
  cursor: pointer;
}

.subtitle {
  color: var(--secondary-text);
  font-size: 14px;
  margin-top: 8px;
}
</style>
