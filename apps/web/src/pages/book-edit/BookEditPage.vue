<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { BookEditForm, bookToEdit$, cancelEdit, updateBook } from 'entities/audiobook'

const book = useStore(bookToEdit$)
</script>

<template>
  <BookEditForm
    v-if="book"
    :book="book"
    cancel-label="Cancel"
    save-label="Save"
    @cancel="cancelEdit"
    @save="updateBook"
  />
</template>
