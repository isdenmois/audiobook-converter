import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import path from 'path'
import { spawnSync } from 'child_process'
import { PromisePool } from 'promise-pool'
import { createTempFile, removeFiles } from './remove-on-exit'
import { convertToAac as convertToAacWorker } from './convert.worker.mjs'

if (process.platform === 'win32') {
  ffmpeg.setFfmpegPath('ffmpeg.exe')
  ffmpeg.setFfprobePath('ffprobe.exe')
}

const convertPool = new PromisePool(convertToAacWorker)

export const convert = async (book: any, outputDir: string, onProgress: (percent: number) => void) => {
  onProgress(0)

  const durations = new Map<string, number>()
  const files: string[] = []
  book.chapters.forEach((chapter: any) => {
    if (!durations.has(chapter.path)) {
      durations.set(chapter.path, chapter.duration)
      files.push(chapter.path)
    }
  })
  const progresses = new Map(files.map(path => [path, 0]))
  const sendProgress = () =>
    onProgress(([...progresses.values()].reduce((sum, val) => sum + val, 0) * 0.95) / progresses.size)

  const encoded = await convertPool.run(
    files.map((file, i) => {
      const onProgress = (p: number) => {
        progresses.set(file, p * book.speed || 0)

        sendProgress()
      }

      return {
        file,
        i,
        speed: book.speed,
        onProgress,
      }
    }),
  )

  onProgress(95)

  const metaFile = createTempFile('FFMETADATAFILE')

  await prepareMetaFile(book, metaFile)

  onProgress(96)

  const output = path.join(outputDir, `${book.author} - ${book.title}.m4b`)

  await concatFiles(encoded, metaFile, book.image, output)

  onProgress(99)

  await removeFiles(encoded.concat(metaFile))

  onProgress(100)
}

const prepareMetaFile = async (audiobook: any, metaFile: string) => {
  const meta = [
    ';FFMETADATA1',
    'major_brand=M4A',
    'minor_version=512',
    'compatible_brands=isomiso2',
    `title=${audiobook.title}`,
    `artist=${audiobook.author}`,
    `album=${audiobook.series || audiobook.title}`,
    //            if (StringUtils.isNotBlank(bookInfo.series().get())) {
    //                metaData.add("album=" + bookInfo.series())
    //            } else {
    //                metaData.add("album=" + bookInfo.title())
    //            }
    //            metaData.add("composer=" + bookInfo.narrator())
    //            metaData.add("date=" + bookInfo.year())
    //            metaData.add("comment=" + bookInfo.comment())
    //            metaData.add("track=" + bookInfo.bookNumber().toString() + "/" + bookInfo.totalTracks())
    'media_type=2',
    //            metaData.add("genre=" + bookInfo.genre())
  ]
  let totalDuration = 0

  audiobook.chapters.forEach((chapter: any) => {
    meta.push('[CHAPTER]', 'TIMEBASE=1/1', `START=${totalDuration}`)

    totalDuration += chapter.duration / audiobook.speed

    meta.push(`END=${totalDuration}`, `title=${chapter.title}`)
  })

  console.log(audiobook)
  console.log(meta)

  await fs.writeFile(metaFile, meta.join('\n'), { encoding: 'utf-8' })
}

const ffmpegExe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'

const concatFiles = (files: string[], metaFile: string, image: string | null, output: string) =>
  new Promise((resolve, reject) => {
    console.log('start concat to', output)
    const args = [
      '-y',
      '-i',
      files.length > 1 ? `concat:${files.join('|')}` : files[0],
      '-i',
      metaFile,
      ...(image ? ['-i', image, '-c'] : ['-vn', '-c:a']),
      'copy',
      '-f',
      'mp4',
      '-safe',
      '0',
      '-map',
      '0',
      '-map_metadata',
      '1',
      ...(image ? ['-map', '2', '-disposition:v', 'attached_pic'] : []),
      output,
    ]

    console.log('concat args ffmpeg', args.join(' '))

    try {
      const res = spawnSync(ffmpegExe, args, { encoding: 'utf-8' })

      resolve(res)
      console.log(res)
    } catch (e) {
      reject(e)
    }
  })
