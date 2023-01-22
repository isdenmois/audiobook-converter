<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useStore } from '@nanostores/vue'
import Draggable from "vuedraggable";
import { $books, editBook, resetBooks } from 'entities/audiobook'
import { Card, Cover } from 'shared/ui'
import { formatDuration } from 'shared/lib'
import { api } from 'shared/api'
import { dragIcon, timesIcon } from 'shared/assets'
import { addToParse } from 'entities/media-parser'
import { PathOpener, PathSelector, startEncode, savePath$ } from 'features/encode'

const dialog: any = inject('dialog')

const books = useStore($books)
const savePath = useStore(savePath$)
const encodeDisabled = ref(true)
const isDragging = ref(false)

const bookList = computed({
  set(value) {
    resetBooks(value)
  },
  get() {
    return books.value
  }
});

setTimeout(() => {
  encodeDisabled.value = false
}, 1000)

const addBooks = async () => {
  try {
    const paths = await api.dialog.openToParse()

    addToParse(paths)
  } catch {}
}

const dragOptions = {
  animation: 200,
  ghostClass: "ghost"
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <Card class="flex-1 overflow-hidden flex flex-col">

      <Draggable
        tag="ul"
        v-model="bookList"
        v-bind="dragOptions"
        class="p-0 overflow-y-auto"
        :class="{ dragging: isDragging }"
        handle=".handle"
        item-key="id"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <template #item="{ element: book }">
          <li class="flex flex-row items-center mb-2 gap-2" @click="editBook(book)">
            <Cover :size="100" :image="book.image" :title="book.title"/>

            <div class="flex-1">
              <div>
                {{ book.title }}, {{ formatDuration(book.duration / book.speed) }} ({{ book.speed }}x)
              </div>
              <div class="author">
                {{book.author}}
              </div>
            </div>

            <div class="flex">
              <img v-if="books.length > 1" class="handle p-2" @click.stop :src="dragIcon" />

              <img class="remove p-2" @click.stop="dialog.open('removeBook', { book })" :src="timesIcon" />
            </div>
          </li>
        </template>
      </Draggable>
    </Card>

    <Card class="mt-4">
      <div class="flex flex-row gap-3">
        <PathSelector :path="savePath" />

        <PathOpener :path="savePath" />

        <div class="flex-1" />

        <button @click="addBooks">Add audiobook</button>
        <button @click="startEncode" :disabled="encodeDisabled">Encode</button>
      </div>
    </Card>
  </div>
</template>

<style scoped>
li {
  cursor: pointer;
  border-radius: 16px;
  background-color: var(--card-background);
  list-style-type: none;
  margin: 2px 2px 16px;
}

.author {
  color: var(--secondary-text);
  font-size: 14px;
  margin-top: 8px;
}

.remove {
  opacity: 0;
}

.handle {
  opacity: 0;
  cursor: row-resize;
}

ul:not(.dragging) li:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

ul:not(.dragging) li:hover :is(.remove, .handle) {
  opacity: 1;
}
</style>
<style>
li.ghost {
  opacity: 0.5;
  background-color: var(--card-ghost-background);
}
</style>
