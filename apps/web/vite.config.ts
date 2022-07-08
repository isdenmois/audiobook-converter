import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import viteResolve from 'vite-plugin-resolve'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetUno(),
      ],
    }),
    viteResolve({
      // Electron
      electron: `
        const { ipcRenderer } = require('electron');
        export {
          ipcRenderer,
        }
      `,
    }),
  ],
  resolve: {
    alias: {
      pages: resolve(__dirname, 'src/pages'),
      features: resolve(__dirname, 'src/features'),
      entities: resolve(__dirname, 'src/entities'),
      shared: resolve(__dirname, 'src/shared'),
    },
  },
})
