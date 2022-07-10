<script setup lang="ts">
import { BookEditForm } from 'entities/audiobook'

const props = defineProps(['book'])
const emit = defineEmits(['save', 'skip'])
</script>
<template>
  <BookEditForm
    :book="props.book"
    cancel-label="Skip"
    save-label="Add"
    @cancel="emit('skip')"
    @save="emit('save', $event)"
  />
</template>
