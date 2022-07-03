<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { $parserProgress } from 'entities/media-parser'

const parserProgress = useStore($parserProgress)
</script>

<template>
  <div>Parsing ({{ parserProgress?.parsed }} / {{ parserProgress?.total }})...</div>
</template>
