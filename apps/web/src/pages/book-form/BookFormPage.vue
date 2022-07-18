<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { BookEditForm } from 'entities/audiobook'
import { parseAddProgress$ } from 'entities/media-parser'

const props = defineProps(['book'])
const emit = defineEmits(['save', 'skip'])
const progress = useStore(parseAddProgress$)
</script>

<template>
  <BookEditForm
    :book="props.book"
    :progress="progress"
    cancel-label="Skip"
    save-label="Add"
    @cancel="emit('skip')"
    @save="emit('save', $event)"
  />
</template>
