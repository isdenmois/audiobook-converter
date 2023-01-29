<script lang="ts">
import { useStore } from '@nanostores/vue'
import { $books, resetBooks, BookItem } from 'entities/audiobook'
import { addToParse } from 'entities/media-parser'
import { settings$ } from 'entities/settings'
import { api } from 'shared/api'
import { Card } from 'shared/ui'
import { currentDestination$, resetDone, PathOpener, EncodePathSelector } from 'features/encode'
</script>

<script setup lang="ts">
const books = useStore($books)
const pathToOpen = useStore(currentDestination$)

const startAgain = async () => {
  try {
    const { sourceBooksPath } = settings$.get()
    const paths = await api.dialog.openToParse(sourceBooksPath)

    addToParse(paths)
    resetBooks()
    resetDone()
  } catch {}
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <Card class="flex-1 overflow-hidden flex flex-col">
      <ul class="p-0 overflow-y-auto">
        <BookItem v-for="book of books" :key="book.id" :book="book" />
      </ul>
    </Card>

    <Card class="mt-4">
      <div class="flex flex-row gap-3">
        <EncodePathSelector :path="pathToOpen" :disabled="true" />
        <PathOpener :path="pathToOpen" />

        <div class="flex-1" />

        <button @click="startAgain">Add audiobook</button>
      </div>
    </Card>
  </div>
</template>
