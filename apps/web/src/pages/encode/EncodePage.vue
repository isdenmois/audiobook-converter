<script lang="ts">
import { useStore } from '@nanostores/vue'
import { currentBook$, progress$ } from 'features/encode'
import { $books } from 'entities/audiobook'
import { Card } from 'shared/ui'
</script>

<script setup lang="ts">
import { formatDuration } from 'shared/lib'

const books = useStore($books)
const currentBook = useStore(currentBook$)
const progress = useStore(progress$)
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <Card class="flex-1 overflow-hidden flex flex-col">
      <ul class="p-0 overflow-y-auto">
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
        <img v-if="currentBook.image" :src="`atom://${currentBook.image}`" :alt="currentBook.title" class="cover" />

        <div class="flex flex-col flex-1">
          <div>{{ currentBook.title }}</div>
          <progress class="mt-2" max="100" :value="progress" />
          <div class="mt-1 text-xs">Converting: {{ Math.round(progress) }}%</div>
        </div>
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

progress {
  height: 16px;
  appearance: none;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  color: red;
  background-color: red;
}

progress::-webkit-progress-bar {
  background-color: #e3ebfe;
}

progress::-webkit-progress-value {
  background-color: #4484ff;
  border-radius: 4px;
}
</style>
