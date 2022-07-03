import ffmpeg from 'fluent-ffmpeg'
import { createTempFile } from './remove-on-exit'

// if (process.platform === 'win32') {
//   ffmpeg.setFfmpegPath('ffmpeg.exe')
//   ffmpeg.setFfprobePath('ffprobe.exe')
// }

export async function convertToAac({ file, i, speed, onProgress }) {
  return new Promise((resolve, reject) => {
    const output = createTempFile(`${i}.aac`)
    console.log('start encode worker', file, 'to', output)
    let command = ffmpeg(file).audioCodec('aac').audioBitrate(64).audioFrequency(44100).noVideo()

    if (speed > 0 && speed !== 1) {
      command = command.audioFilter(`atempo=${speed}`)
    }

    command
      .on('progress', ({ percent }) => {
        console.log('progress ' + percent + '%')
        onProgress(percent)
      })
      .on('end', () => {
        onProgress(100 / speed)
        resolve(output)
      })
      .on('error', reject)
      .save(output)
  })
}
