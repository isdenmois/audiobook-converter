<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { HomePage } from 'pages/home'
import { ParsingProgressPage } from 'pages/parsing'
import { BookFormPage } from 'pages/book-form'
import { BookListPage } from 'pages/book-list'
import { nextParsedMedia, parsed$ } from 'entities/media-parser'
import { currentRoute$ } from './current-route'
import { addBook } from 'entities/audiobook'

const route = useStore(currentRoute$)
const parsed = useStore(parsed$)
const isDev = import.meta.env.DEV

const handleSave = (data: any) => {
  addBook(data)
  nextParsedMedia()
}
</script>

<template>
  <h3 v-if="isDev">Current route is: {{ route }}</h3>

  <HomePage v-if="route === 'HOME'" />
  <ParsingProgressPage v-if="route === 'PARSING'" />
  <BookFormPage
    v-if="route === 'ADD_BOOK'"
    :key="parsed[0].id"
    :book="parsed[0]"
    @save="handleSave"
    @skip="nextParsedMedia"
  />

  <BookListPage v-if="route === 'BOOK_LIST'" />
</template>
