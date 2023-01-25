<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { BookEditForm, bookToEdit$, cancelEdit, updateBook } from 'entities/audiobook'
import { settings$ } from 'entities/settings'

const book = useStore(bookToEdit$)
const settings = useStore(settings$)
</script>

<template>
  <BookEditForm
    v-if="book"
    :book="book"
    :default-speed="settings.defaultSpeed"
    :covers-path="settings.coversPath"
    cancel-label="Cancel"
    save-label="Save"
    @cancel="cancelEdit"
    @save="updateBook"
  />
</template>
