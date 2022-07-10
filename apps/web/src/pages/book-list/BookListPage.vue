<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { ipcRenderer } from 'electron'
import { $books, editBook } from 'entities/audiobook'
import { computed, inject, ref } from 'vue'
import { Card } from 'shared/ui'
import { formatDuration } from 'shared/lib'
import { api } from 'shared/api'
import { timesIcon } from 'shared/assets'
import { addToParse } from 'entities/media-parser'
import { PathOpener, PathSelector, savePath$ } from 'entities/encode'

const dialog: any = inject('dialog')

const books = useStore($books)
const currentBook = ref<any>(null)

const destination = ref<string | null>(null)
const done = ref(false)
const progress = ref(-1)
const savePath = useStore(savePath$)

const disabled = computed(() => progress.value >= 0)

const pathToOpen = computed(() => (done.value && destination.value ? destination.value : savePath.value))

const startEncode = async () => {
  const path = await api.encoder.createDestinationDir(savePath$.get())

  destination.value = path

  for (const book of $books.get()) {
    currentBook.value = book

    try {
      await api.encoder.encode(JSON.parse(JSON.stringify(book)), path)
    } catch (e) {
      console.error(e)
    }
  }

  progress.value = -1
  done.value = true
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
        <li v-for="book of books" :key="book.id" class="flex flex-row items-center mb-2 gap-2" @click="editBook(book)">
          <img v-if="book.image" :src="`atom://${book.image}`" :alt="book.title" class="cover" />
          <span v-else class="cover cover_empty" />

          <div class="flex-1">
            {{ book.title }}, {{ formatDuration(book.duration / book.speed) }} ({{ book.speed }}x)
          </div>

          <div class="remove p-2 items-center" @click.stop="dialog.open('removeBook', { book })">
            <img :src="timesIcon" />
          </div>
        </li>
      </ul>
    </Card>

    <Card class="mt-4">
      <div v-if="!disabled" class="flex flex-row gap-3">
        <PathSelector />

        <PathOpener :path="pathToOpen" />

        <div class="flex-1" />

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

.remove {
  display: none;
  align-self: stretch;
}

li:hover .remove {
  display: flex;
}
</style>
