<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { BookEditForm } from 'entities/audiobook'
import { parseAddProgress$ } from 'entities/media-parser'
import { settings$ } from 'entities/settings'

const props = defineProps(['book'])
const emit = defineEmits(['save', 'skip'])
const progress = useStore(parseAddProgress$)
const settings = useStore(settings$)
</script>

<template>
  <BookEditForm
    :book="props.book"
    :progress="progress"
    :default-speed="settings.defaultSpeed"
    :covers-path="settings.coversPath"
    cancel-label="Skip"
    save-label="Add"
    @cancel="emit('skip')"
    @save="emit('save', $event)"
  />
</template>
