<script setup lang="ts">
import { formatDuration } from 'shared/lib'
import { ListItem } from 'shared/ui'
import { computed } from 'vue'

const props = defineProps(['book', 'clickable'])
const emit = defineEmits(['click'])

const duration = computed(() => formatDuration(props.book.duration / props.book.speed))
const title = computed(() => `${props.book.title}, ${duration.value} (${props.book.speed}x)`)
</script>

<template>
  <ListItem :image="book.image" :title="title" :subtitle="book.author" :clickable="clickable" @click="emit('click')">
    <slot />
  </ListItem>
</template>
