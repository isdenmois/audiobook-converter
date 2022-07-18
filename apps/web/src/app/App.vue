<script setup lang="ts">
import { provide, ref } from 'vue'
import { useStore } from '@nanostores/vue'
import { api } from 'shared/api'
import { HomePage } from 'pages/home'
import { ParsingProgressPage } from 'pages/parsing'
import { BookFormPage } from 'pages/book-form'
import { BookListPage } from 'pages/book-list'
import { BookEditPage } from 'pages/book-edit'
import { EncodePage } from 'pages/encode'
import { DonePage } from 'pages/done'
import { nextParsedMedia, parsed$ } from 'entities/media-parser'
import { addBook, BookRemoveDialog } from 'entities/audiobook'
import { events } from 'shared/lib'
import { ErrorDialog } from 'shared/ui'
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

let id = 0
const dialogs = ref<any[]>([])
const DIALOG_TYPES: Record<string, any> = {
  error: ErrorDialog,
  removeBook: BookRemoveDialog,
}
const open = (type: string, params: any) => {
  dialogs.value.push({ id: id++, type, params })
}
const close = (dialog: any) => {
  dialogs.value = dialogs.value.filter(d => d !== dialog)
}

events.on('error', (error: string) => {
  open('error', { error })
})

provide('dialog', { open })
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
  <BookEditPage v-if="route === 'BOOK_EDIT'" />

  <BookListPage v-if="route === 'BOOK_LIST'" />

  <EncodePage v-if="route === 'ENCODING'" />

  <DonePage v-if="route === 'DONE'" />

  <div v-for="dialog of dialogs" :key="dialog.id" class="app-dialog">
    <div class="backdrop" @click="close(dialog)"></div>
    <div class="dialog-content">
      <component :is="DIALOG_TYPES[dialog.type]" :params="dialog.params" @close="close(dialog)"></component>
    </div>
  </div>
</template>

<style>
.app-dialog {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000a;
  z-index: 0;
}

.dialog-content {
  z-index: 1;
}
</style>
