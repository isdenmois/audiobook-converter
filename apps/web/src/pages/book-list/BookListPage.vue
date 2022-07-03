<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { ipcRenderer } from 'electron'
import { $books } from 'entities/audiobook'
import { ref } from 'vue'
import { formatDuration } from 'shared/lib'
import { addToParse } from 'entities/media-parser'
import { api } from 'shared/api'

const books = useStore($books)

const progress = ref(-1)

const startEncode = async () => {
  for (const book of $books.get()) {
    await api.encoder.encode(JSON.parse(JSON.stringify(book)))
  }
  // const book = JSON.parse(JSON.stringify($books.get()[0]))

  // api.encoder.encode(book)
  // ipcRenderer.send('convert-book', book)
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
  <ul>
    <li v-for="book of books">
      <img v-if="book.image" :src="`atom://${book.image}`" :alt="book.title" class="cover" />
      <span v-else class="cover cover_empty" />
      {{ book.title }}, {{ formatDuration(book.duration / book.speed) }} ({{ book.speed }}x)
    </li>
  </ul>

  <button @click="startEncode" :disabled="progress >= 0">Encode</button>
  <button @click="addBooks" :disabled="progress >= 0">Add audiobook</button>

  <p v-if="progress >= 0">
    <progress max="100" :value="progress" />
    {{ Math.round(progress) }}%
  </p>
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
</style>
