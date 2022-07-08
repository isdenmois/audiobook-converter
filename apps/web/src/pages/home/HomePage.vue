<script setup lang="ts">
import { addToParse } from 'entities/media-parser'
import { api } from 'shared/api'
import { emptyBackground } from 'shared/assets'
import { Card } from 'shared/ui'

const addBooks = async () => {
  try {
    const paths = await api.dialog.openToParse()

    addToParse(paths)
  } catch {}
}
</script>

<template>
  <div class="home-page flex flex-col">
    <Card class="home-empty flex flex-col">
      <img class="empty-img" :src="emptyBackground" />
      <div class="text-m mt-4">Start by adding the first audiobook</div>
      <div class="text-s secondary mt-2">Add an audiobook file or folder to begin the process of encoding</div>
      <button class="mt-4" @click="addBooks">Add audiobook</button>
    </Card>
  </div>
</template>

<style>
.home-page {
  flex: 1;
  padding: 24px;
  justify-content: stretch;
}

.empty-img {
  height: 337px;
  width: 436px;
}

.home-empty {
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
