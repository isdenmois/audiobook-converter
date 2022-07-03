import { spawn } from 'child_process'

const IMAGE_CODEC_FILTER = /^(mjpeg|png)$/
const IMAGE_FILTER = /\.(jpg|jpeg|png)$/i
const AUDIO_FILTER = /\.(mp3|m4b)$/i

function ffprobe(file) {
  return new Promise((resolve, reject) => {
    let proc = spawn(module.exports.FFPROBE_PATH || 'ffprobe', [
      '-hide_banner',
      '-loglevel',
      'fatal',
      '-show_error',
      '-show_format',
      '-show_streams',
      '-show_programs',
      '-show_chapters',
      '-show_private_data',
      '-print_format',
      'json',
      file,
    ])
    let probeData = []
    let errData = []
    let exitCode = null

    proc.stdout.setEncoding('utf8')
    proc.stderr.setEncoding('utf8')

    proc.stdout.on('data', function (data) {
      probeData.push(data)
    })
    proc.stderr.on('data', function (data) {
      errData.push(data)
    })

    proc.on('exit', code => {
      exitCode = code
    })
    proc.on('error', err => reject(err))
    proc.on('close', () => resolve(JSON.parse(probeData.join(''))))
  })
}

export async function parseFile(path: string): Promise<any> {
  if (path.match(IMAGE_FILTER)) {
    return path
  }

  if (path.match(AUDIO_FILTER)) {
    const { format, streams, chapters } = await ffprobe(path)

    return {
      duration: +format.duration,
      tags: format.tags || {},
      hasImage: streams.some((stream: any) => stream.codec_name.match(IMAGE_CODEC_FILTER)),
      path,
      chapters:
        chapters?.map((chapter: any) => ({
          duration: +chapter.end_time - +chapter.start_time,
          title: chapter.tags?.title || '',
          tags: {},
        })) ?? [],
    }
  }

  return null
}
