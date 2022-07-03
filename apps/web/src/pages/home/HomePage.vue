<script setup lang="ts">
import { addToParse } from 'entities/media-parser'
import { api } from 'shared/api'

const addBooks = async () => {
  try {
    const paths = await api.dialog.openToParse()

    addToParse(paths)
  } catch {}
}
</script>

<template>
  <h3>Start by adding the first audiobook</h3>
  <h4>Add an audiobook file or folder to begin the process of encoding</h4>
  <button @click="addBooks">Add audiobook</button>
</template>
