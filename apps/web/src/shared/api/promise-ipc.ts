import promiseIpc from 'electron-promise-ipc/build/renderer'

// @ts-ignore
delete promiseIpc.maxTimeoutMs

export { promiseIpc }
