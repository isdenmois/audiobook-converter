<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { ipcRenderer } from 'electron'
import { $books, editBook } from 'entities/audiobook'
import { computed, ref } from 'vue'
import { Card } from 'shared/ui'
import { formatDuration } from 'shared/lib'
import { addToParse } from 'entities/media-parser'
import { api } from 'shared/api'

const books = useStore($books)
const currentBook = ref<any>(null)

const progress = ref(-1)

const disabled = computed(() => progress.value >= 0)

const startEncode = async () => {
  const path = await api.dialog.selectSaveDirectory()

  for (const book of $books.get()) {
    currentBook.value = book

    try {
      await api.encoder.encode(JSON.parse(JSON.stringify(book)), path)
    } catch (e) {
      console.error(e)
    }
  }
}

const addBooks = async () => {
  try {
    const paths = await api.dialog.openToParse()

    addToParse(paths)
  } catch {}
}

ipcRenderer.on('encoder/progress', (_, { bookId, progress: percent }) => {
  progress.value = percent
})
</script>

<template>
  <div class="flex flex-1 flex-col">
    <Card class="flex-1">
      <ul class="p-0">
        <li v-for="book of books" :key="book.id" class="mb-2" @click="editBook(book)">
          <img v-if="book.image" :src="`atom://${book.image}`" :alt="book.title" class="cover" />
          <span v-else class="cover cover_empty" />
          {{ book.title }}, {{ formatDuration(book.duration / book.speed) }} ({{ book.speed }}x)
        </li>
      </ul>
    </Card>

    <Card class="mt-4">
      <div v-if="!disabled" class="flex flex-row gap-3">
        <button @click="startEncode" :disabled="progress >= 0">Encode</button>
        <button @click="addBooks" :disabled="progress >= 0">Add audiobook</button>
      </div>

      <div v-if="disabled && currentBook">Current book: {{ currentBook.title }}</div>

      <p v-if="disabled">
        <progress max="100" :value="progress" />
        {{ Math.round(progress) }}%
      </p>
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
  cursor: pointer;
  border-radius: 16px;
  background-color: var(--card-background);
  list-style-type: none;
}

li:hover {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}
</style>
