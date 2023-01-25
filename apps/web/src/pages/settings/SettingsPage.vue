<script lang="ts" setup>
import { SettingsForm, closeSettings, saveSettings } from 'entities/settings'
import { Card } from 'shared/ui'

const submitSettings = (target: HTMLFormElement) => {
  const data = new FormData(target)

  saveSettings({
    coversPath: data.get('coversPath') as string,
    outputPath: data.get('outputPath') as string,
    sourceBooksPath: data.get('sourceBooksPath') as string,
    defaultSpeed: +data.get('speed')!,
  })

  closeSettings()
}
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <form class="flex-1 overflow-hidden flex flex-col" @submit.prevent="submitSettings($event.target)">
      <Card class="flex-1 overflow-hidden flex flex-col">
        <SettingsForm />
      </Card>

      <Card class="flex flex-row mt-3 justify-end">
        <button class="secondary" @click="closeSettings">Cancel</button>
        <button class="ml-3" type="submit">Save</button>
      </Card>
    </form>
  </div>
</template>
