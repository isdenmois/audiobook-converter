<script lang="ts">
import { useStore } from '@nanostores/vue'
import { $books, resetBooks } from 'entities/audiobook'
import { addToParse } from 'entities/media-parser'
import { api } from 'shared/api'
import { Card } from 'shared/ui'
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
  <div class="flex flex-1 flex-col">
    <Card class="flex-1">
      <ul class="p-0">
        <li v-for="book of books" :key="book.id" class="flex flex-row items-center mb-2 gap-2">
          <img v-if="book.image" :src="`atom://${book.image}`" :alt="book.title" class="cover" />
          <span v-else class="cover cover_empty" />

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
.cover {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  object-fit: cover;
}

.cover_empty {
  background-color: gray;
}

li {
  border-radius: 16px;
  background-color: var(--card-background);
  list-style-type: none;
}
</style>
