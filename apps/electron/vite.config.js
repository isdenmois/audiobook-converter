import { builtinModules } from 'module'
import { replaceCodePlugin } from 'vite-plugin-replace'
import { node } from './.electron-vendors.cache.json'

const PACKAGE_ROOT = __dirname

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  plugins: [
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
  build: {
    sourcemap: process.env.MODE === 'development',
    target: `node${node}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron', 'electron-devtools-installer', ...builtinModules.flatMap(p => [p, `node:${p}`])],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  server: {
    port: 3030,
  },
}

export default config
