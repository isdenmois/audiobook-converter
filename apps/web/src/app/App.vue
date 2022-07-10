<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { api } from 'shared/api'
import { HomePage } from 'pages/home'
import { ParsingProgressPage } from 'pages/parsing'
import { BookFormPage } from 'pages/book-form'
import { BookListPage } from 'pages/book-list'
import { nextParsedMedia, parsed$ } from 'entities/media-parser'
import { addBook } from 'entities/audiobook'
import { currentRoute$ } from './current-route'

const route = useStore(currentRoute$)
const parsed = useStore(parsed$)
const isDev = import.meta.env.DEV

const openUnoCss = () => {
  api.shell.open('http://localhost:3999/__unocss')
}

const handleSave = (data: any) => {
  addBook(data)
  nextParsedMedia()
}
</script>

<template>
  <h3 v-if="isDev">Current route is: {{ route }}</h3>
  <div v-if="isDev">
    <button @click="openUnoCss">UnoCSS</button>
  </div>

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
