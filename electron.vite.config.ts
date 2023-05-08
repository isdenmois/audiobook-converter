import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import fs from 'fs'
import { join, resolve } from 'path'
import { presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import { type PluginOption } from 'vite'
import { replaceCodePlugin } from 'vite-plugin-replace'
import viteResolve from 'vite-plugin-resolve'

const alias = {}

fs.readdirSync(join(__dirname, './src/renderer/src'), { withFileTypes: true })
  .filter(file => file.isDirectory())
  .map(dir => dir.name)
  .forEach(dir => {
    alias[dir] = join(__dirname, `./src/renderer/src/${dir}`)
  })

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['electron-json-storage', 'fluent-ffmpeg'],
      }),
      // `fluent-ffmpeg` is required of this package
      replaceCodePlugin({
        replacements: [
          {
            from: 'process.env.FLUENTFFMPEG_COV',
            to: 'false',
          },
        ],
      }),
    ],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        ...alias,

        '@main': resolve(__dirname, 'src/main'),
      },
    },
    plugins: [
      vue(),
      UnoCSS({
        presets: [presetUno()],
      }) as PluginOption,
      viteResolve({
        // Electron
        electron: `
          const { ipcRenderer } = window.electron;
          export {
            ipcRenderer,
          }
        `,
      }) as PluginOption,
    ],
  },
})
