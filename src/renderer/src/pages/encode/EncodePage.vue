<script lang="ts">
import { useStore } from '@nanostores/vue'
import { currentBook$, progress$ } from 'features/encode'
import { $books, BookItem } from 'entities/audiobook'
import { Card, Cover, Progress } from 'shared/ui'
</script>

<script setup lang="ts">
const books = useStore($books)
const currentBook = useStore(currentBook$)
const progress = useStore(progress$)
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
        <Cover :size="100" :title="currentBook.title" :image="currentBook.image" />

        <div class="flex flex-col flex-1">
          <div>{{ currentBook.title }}</div>
          <div class="mt-2">
            <Progress :value="progress" />
          </div>
          <div class="mt-1 text-xs">Converting: {{ Math.round(progress) }}%</div>
        </div>
      </div>
    </Card>
  </div>
</template>
