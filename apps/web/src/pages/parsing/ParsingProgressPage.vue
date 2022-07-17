<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { $parserProgress } from 'entities/media-parser'
import { Spinner } from 'shared/ui'

const parserProgress = useStore($parserProgress)
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <Spinner />
  </div>
</template>
