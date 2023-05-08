import path, { basename, extname } from 'path'
import { readdir, stat } from 'fs/promises'
import Ffmpeg from 'fluent-ffmpeg'
import { PromisePool } from './promise-pool'
import { createTempFile } from './remove-on-exit'
import { parseFile } from './parse.worker'

if (process.platform === 'win32') {
  Ffmpeg.setFfmpegPath('ffmpeg.exe')
  Ffmpeg.setFfprobePath('ffprobe.exe')
} else {
  Ffmpeg.setFfmpegPath('/usr/bin/ffmpeg')
  Ffmpeg.setFfprobePath('/usr/bin/ffprobe')
}

const parsePool = new PromisePool(parseFile)

let getId = 0

interface ParsedDirectoryResult {
  id: number
  title: string
  author: string
  image: string | null
  chapters: ParsedChapterResult[]
  duration: number
}

const getFilePaths = async (dir: string): Promise<string[]> => {
  const paths: string[] = []
  const files = await readdir(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)

    try {
      const fileStat = await stat(filePath)

      if (fileStat.isDirectory()) {
        paths.push(...(await getFilePaths(filePath)))
      } else {
        paths.push(filePath)
      }
    } catch {}
  }

  return paths
}

export async function parseDirectory(dir: string): Promise<ParsedDirectoryResult> {
  const result: ParsedDirectoryResult = {
    id: ++getId,
    title: '',
    author: '',
    image: null,
    chapters: [],
    duration: 0,
  }

  console.time('parseChapters')
  const filePaths = await getFilePaths(dir)

  const parsed = await parsePool.run(filePaths)
  let i = 1

  parsed.forEach(info => {
    if (!result.image && typeof info === 'string') {
      result.image = info
    } else if (info !== null && typeof info === 'object') {
      result.title = result.title || info.tags.album || info.tags.title
      result.author = result.author || info.tags.artist || info.tags.album_artist

      if (info.chapters.length) {
        info.chapters.forEach(chapter => {
          const number = String(i++)

          result.duration += chapter.duration
          result.chapters.push({
            ...chapter,
            path: info.path,
            hasImage: info.hasImage,
            tags: {
              number,
              number2: number.padStart(2, '0'),
              ...chapter.tags,
            },
          })
        })
      } else {
        const number = String(i++)
        const title = info.tags.title

        result.duration += info.duration
        result.chapters.push({
          path: info.path,
          duration: info.duration,
          title,
          hasImage: info.hasImage,
          tags: {
            number,
            number2: number.padStart(2, '0'),
            number3: number.padStart(3, '0'),
            chapterNumber: `Глава ${number}`,
            numberTitle: `${number} - ${title}`,
            ...info.tags,
            filename: basename(info.path, extname(info.path)),
          },
        })
      }
    }
  })

  if (!result.image) {
    const chapterWithImage = result.chapters.find(chapter => chapter.hasImage)

    console.log('chapterWithImage', chapterWithImage)

    if (chapterWithImage) {
      result.image = await parseCover(chapterWithImage.path!)
    }
  }

  return result
}

interface ParsedChapterResult {
  path?: string
  duration: number
  title: string
  hasImage: boolean
  tags: Record<string, string>
}

let coverIdx = 0

function parseCover(filePath: string): Promise<string | null> {
  const coverPath = createTempFile(`cover-${coverIdx++}.jpg`)

  return new Promise(resolve => {
    const command: any = Ffmpeg(filePath).noAudio().videoCodec('copy')

    command._currentOutput.options('-map', '0:v')
    command._currentOutput.options('-map', '-0:V')
    command.output(coverPath)

    console.log('ffmpeg', command._getArguments().join(' '))

    command
      .on('end', () => resolve(coverPath))
      .on('error', () => resolve(null))
      .run()
  })
}
