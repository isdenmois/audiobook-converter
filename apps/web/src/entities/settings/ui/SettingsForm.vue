<script lang="ts">
import { ref } from 'vue'
import { PathSelector } from 'shared/ui'
import { settings$ } from '../model'
</script>

<script lang="ts" setup>
const sourceBooksPath = ref(settings$.get().sourceBooksPath)
const outputPath = ref(settings$.get().outputPath)
const coversPath = ref(settings$.get().coversPath)
const speed = ref(settings$.get().defaultSpeed)
</script>

<template>
  <p class="flex flex-row gap-3 items-center">
    <span class="input-title">Source books path</span>
    <input name="sourceBooksPath" type="hidden" v-model="sourceBooksPath" />
    
    <div class="flex-1">
      <PathSelector :path="sourceBooksPath" @select="sourceBooksPath = $event" />
    </div>
  </p>

  <p class="flex flex-row gap-3 items-center">
    <span class="input-title">Output path</span>
    <input name="outputPath" type="hidden" v-model="outputPath" />

    <div class="flex-1">
      <PathSelector :path="outputPath" @select="outputPath = $event" />
    </div>
  </p>

  <p class="flex flex-row gap-3 items-center">
    <span class="input-title">Covers path</span>
    <input name="coversPath" type="hidden" v-model="coversPath" />

    <div class="flex-1">
      <PathSelector :path="coversPath" @select="coversPath = $event" />
    </div>
  </p>

  <p class="flex flex-row gap-3">
    <input
      class="flex-1"
      name="speed"
      type="range"
      min="0.1"
      max="2.0"
      step="0.1"
      :value="speed"
      @input="speed = $event.target.valueAsNumber"
    />
    <span>{{ speed }}x</span>
  </p>
</template>
