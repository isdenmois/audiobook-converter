<script setup lang="ts">
import { inject } from 'vue'
import { useStore } from '@nanostores/vue'
import { $books, editBook } from 'entities/audiobook'
import { Card } from 'shared/ui'
import { formatDuration } from 'shared/lib'
import { api } from 'shared/api'
import { timesIcon } from 'shared/assets'
import { addToParse } from 'entities/media-parser'
import { PathOpener, PathSelector, startEncode, savePath$ } from 'features/encode'

const dialog: any = inject('dialog')

const books = useStore($books)
const savePath = useStore(savePath$)

const addBooks = async () => {
  try {
    const paths = await api.dialog.openToParse()

    addToParse(paths)
  } catch {}
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <Card class="flex-1 overflow-hidden flex flex-col">
      <ul class="p-0 overflow-y-auto">
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
      <div class="flex flex-row gap-3">
        <PathSelector :path="savePath" />

        <PathOpener :path="savePath" />

        <div class="flex-1" />

        <button @click="addBooks">Add audiobook</button>
        <button @click="startEncode">Encode</button>
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
