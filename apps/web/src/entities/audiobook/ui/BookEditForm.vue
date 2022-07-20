<script lang="ts">
import { unref, ref, toRaw, computed, onMounted, inject } from 'vue'
import { api } from 'shared/api'
import { interpolate } from 'shared/lib'
</script>

<script setup lang="ts">
import { Card, Dropdown, DropdownItem, Player } from 'shared/ui'
import { currentIcon, currentAndBelowIcon } from 'shared/assets'
import { formatDuration } from 'shared/lib'

const props = defineProps(['book', 'saveLabel', 'cancelLabel', 'progress'])
const emit = defineEmits(['save', 'cancel'])
const scrollRef = ref<HTMLElement | null>(null)
const book = props.book

let image = ref(book.image)
let title = ref(book.title)
let author = ref(book.author)
let speed = ref(book.speed || 1.6)
let chapters = ref(book.chapters.map((chapter: any) => ({ ...chapter })))

const tags = Object.values(book.chapters[0].tags)

const duration = computed(() => formatDuration(book.duration, speed.value))

const setChaptersTags = (index: number, tag: string) => {
  chapters.value.forEach((chapter: any, i: number) => {
    if (i >= index) {
      if (tag === 'start_with_1') {
        chapter.title = String(i - index + 1)
      } else {
        chapter.title = chapter.tags[tag]
      }
    }
  })
}

const applyChapterTags = (index: number, text: string) => {
  chapters.value.forEach((chapter: any, i: number) => {
    if (i >= index) {
      let tags = chapter.tags
      if (text.includes('start_with_1')) {
        tags = { ...tags, start_with_1: String(i - index + 1) }
      }
      chapter.title = interpolate(text, tags)
    }
  })
}

const save = () => {
  emit('save', {
    ...book,
    title: unref(title),
    author: unref(author),
    image: unref(image),
    speed: unref(speed),
    chapters: toRaw(chapters.value),
  })
}

const selectCover = async () => {
  try {
    const [imagePath] = await api.dialog.openCover()

    image.value = imagePath
  } catch {}
}

const dialog = inject<any>('dialog')

const openChapterEditor = (index: number, chapter: any) => {
  dialog.open('chapterEditor', { tags: chapter.tags, apply: (text: string) => applyChapterTags(index, text) })
}

onMounted(() => {
  scrollRef.value!.scrollTop = 1
})
</script>

<template>
  <Card class="flex flex-row">
    <div @click="selectCover">
      <img v-if="image" :src="`atom://${image}`" :alt="title" class="cover" />
      <div v-else class="cover cover_empty" />
    </div>

    <div class="flex-1 ml-3">
      <p class="flex flex-row gap-3 items-center">
        <input class="flex-1" type="text" v-model="title" />
        <Dropdown :image-src="currentIcon">
          <DropdownItem v-for="tag of tags" @click="title = tag">{{ tag }}</DropdownItem>
        </Dropdown>
      </p>

      <p class="flex flex-row gap-3 items-center">
        <input class="flex-1" type="text" v-model="author" />
        <Dropdown :image-src="currentIcon">
          <DropdownItem v-for="tag of tags" @click="author = tag">{{ tag }}</DropdownItem>
        </Dropdown>
      </p>

      <p class="flex flex-row gap-3">
        <input
          class="flex-1"
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          :value="speed"
          @input="speed = +$event.target.value"
        />
        <span>{{ speed }}x, {{ duration }} </span>
      </p>
    </div>
  </Card>

  <Card class="overflow-hidden flex flex-col flex-1 mt-3">
    <ol class="scroll" ref="scrollRef">
      <li
        class="flex flex-row gap-3 items-center mt-2 relative"
        v-for="(chapter, index) in chapters"
        :key="chapter.path"
      >
        <div>{{ String(index + 1).padStart(3, '0') }}</div>

        <div class="player">
          <Player :path="chapter.path" :speed="speed" />
        </div>
        <input class="flex-1" type="text" v-model="chapter.title" />

        <div>{{ formatDuration(chapter.duration, speed) }}</div>

        <Dropdown :image-src="currentIcon">
          <DropdownItem v-for="tag of Object.values(chapter.tags)" @click="chapter.title = tag">{{ tag }}</DropdownItem>
        </Dropdown>

        <Dropdown :image-src="currentAndBelowIcon">
          <DropdownItem v-for="tag of Object.keys(chapter.tags)" @click="setChaptersTags(index, tag)">{{
            chapter.tags[tag]
          }}</DropdownItem>
          <DropdownItem @click="setChaptersTags(index, 'start_with_1')">Start with 1</DropdownItem>
          <DropdownItem @click="openChapterEditor(index, chapter)">Chapter Editor</DropdownItem>
        </Dropdown>
      </li>
    </ol>
  </Card>

  <Card class="flex flex-row mt-3 items-center">
    <div v-if="progress">
      {{ progress }}
    </div>

    <div class="flex-1" />

    <button class="secondary" @click="emit('cancel')">{{ props.cancelLabel }}</button>
    <button class="ml-3" @click="save">{{ props.saveLabel }}</button>
  </Card>
</template>

<style scoped>
.cover {
  cursor: pointer;
  width: 184px;
  height: 184px;
  border-radius: 16px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  object-fit: cover;
}

.cover_empty {
  background-color: gray;
}

.player {
  position: absolute;
  left: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
