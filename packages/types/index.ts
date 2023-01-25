import { z } from 'zod'

export const settingsSchema = z.object({
  outputPath: z.string(),
  sourceBooksPath: z.string(),
  coversPath: z.string(),
  defaultSpeed: z.number(),
})

export type Settings = z.infer<typeof settingsSchema>
