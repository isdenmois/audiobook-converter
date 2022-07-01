if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date()
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${
    now.getUTCHours() * 60 + now.getUTCMinutes()
  }`
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'ru.isden.iaudiobooksconv',
  directories: {
    output: '../../release',
  },
  asar: false,
  files: ['dist/**', '!node_modules/**/*', 'node_modules/web/dist'],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
  linux: {
    target: [
      {
        target: 'dir',
      },
    ],
  },
  win: {
    target: [
      {
        target: 'zip',
        arch: ['x64'],
      },
    ],
    artifactName: '${productName}_${version}.${ext}',
  },
}

module.exports = config
