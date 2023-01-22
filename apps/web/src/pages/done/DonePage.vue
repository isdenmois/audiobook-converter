<script lang="ts">
import { useStore } from '@nanostores/vue'
import { $books, resetBooks } from 'entities/audiobook'
import { addToParse } from 'entities/media-parser'
import { api } from 'shared/api'
import { Card, Cover } from 'shared/ui'
import { currentDestination$, resetDone } from 'features/encode'
</script>

<script setup lang="ts">
import { PathOpener, PathSelector } from 'features/encode'
import { formatDuration } from 'shared/lib'

const books = useStore($books)
const pathToOpen = useStore(currentDestination$)

const startAgain = async () => {
  try {
    const paths = await api.dialog.openToParse()

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
        <li v-for="book of books" :key="book.id" class="flex flex-row items-center mb-2 gap-2">
          <Cover :size="100" :title="book.title" :image="book.image" />

          <div class="flex-1">
            {{ book.title }}, {{ formatDuration(book.duration / book.speed) }} ({{ book.speed }}x)
          </div>
        </li>
      </ul>
    </Card>

    <Card class="mt-4">
      <div class="flex flex-row gap-3">
        <PathSelector :path="pathToOpen" :disabled="true" />
        <PathOpener :path="pathToOpen" />

        <div class="flex-1" />

        <button @click="startAgain">Add audiobook</button>
      </div>
    </Card>
  </div>
</template>

<style scoped>
li {
  border-radius: 16px;
  background-color: var(--card-background);
  list-style-type: none;
}
</style>
