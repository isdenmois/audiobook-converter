import type { FileFilter } from 'electron'

export interface DialogOpenParams {
  defaultPath?: string
  buttonLabel?: string
  multiple?: boolean
}

export interface DialogOpenFileParams extends DialogOpenParams {
  filters?: FileFilter[]
}

export interface DialogOpenDirectoryParams extends DialogOpenParams {
  allowFiles?: boolean
}
