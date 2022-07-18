import { api } from 'shared/api'
import { atom, computed } from 'nanostores'
import { events } from 'shared/lib'

export const toParse$ = atom<string[]>([])
export const parsed$ = atom<any[]>([])

export const parseInProgress$ = atom(false)

export const addToParse = (paths: string[]) => {
  toParse$.set(paths)
  // events.send('add-to-parse')
}
// export const hasToParse = () => toParse$.get().length > 0

export const addParsed = (metadata: any) => parsed$.set([...parsed$.get(), metadata])

// export const hasParsed = () => parsed$.get().length > 0

export const nextParsedMedia = () => parsed$.set(parsed$.get().slice(1))

toParse$.listen(async paths => {
  if (paths && !parseInProgress$.get()) {
    parseInProgress$.set(true)

    while (toParse$.get().length > 0) {
      const path = toParse$.get()[0]

      try {
        const metadata = await api.parser.parse(path)

        if (metadata?.chapters?.length) {
          addParsed(metadata)
        } else {
          throw {}
        }
      } catch {
        events.send('error', `Can't parse "${path}"`)
      } finally {
        toParse$.set(toParse$.get().slice(1))
      }
    }

    parseInProgress$.set(false)
  }
})
