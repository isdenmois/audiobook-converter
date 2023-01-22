import { z } from 'zod'
import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'

const FANTLAB_API = 'https://api.fantlab.ru/'
const FANTLAB_COVER_PREFIX = 'https://fantlab.ru/images/editions/big'

const coverSchema = z
  .object({
    edition_id: z.coerce.number(),
  })
  .transform(({ edition_id }) => `${FANTLAB_COVER_PREFIX}/${edition_id}`)

const coverResponseSchema = z.array(coverSchema)

export const getCovers = (query: string): Promise<string[]> =>
  wretch(FANTLAB_API)
    .addon(QueryStringAddon)
    .query({ q: query, onlymatches: 1 })
    .get('search-editions')
    .json(json => coverResponseSchema.parse(json))
