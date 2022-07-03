import { createMachine } from 'xstate'
import { addToParse } from 'entities/media-parser'

export const routerMachine = createMachine(
  {
    initial: 'home',
    context: {
      books: [],
      adding: null,
      editing: null,
      encoding: null,
    },
    states: {
      home: {
        on: {
          ADD_BOOKS: {
            actions: (_, { value }) => addToParse(value),
            target: 'parsing',
          },
          SETTINGS: 'settings',
        },
      },
      settings: {
        on: {
          GO_BACK: [{ target: 'book_list', cond: 'hasBooks' }, 'home'],
        },
      },
      parsing: {
        on: {
          PARSED: 'add_book',
        },
      },
      add_book: {
        on: {
          SKIP: [
            {
              target: 'add_book',
              cond: 'hasParsed',
              actions: 'setAdding',
            },
            {
              target: 'parsing',
              cond: 'hasToParse',
              actions: 'resetAdding',
            },
            {
              target: 'book_list',
              cond: 'hasBooks',
              actions: 'resetAdding',
            },
            { target: 'home' },
          ],
          SAVE: [
            {
              target: 'add_book',
              cond: 'hasParsed',
              actions: ['setAdding', 'addBook'],
            },
            {
              target: 'parsing',
              cond: 'hasToParse',
              actions: ['resetAdding', 'addBook'],
            },
            {
              target: 'book_list',
              actions: ['resetAdding', 'addBook'],
            },
          ],
        },
      },
      book_list: {
        on: {
          ADD_BOOKS: {
            actions: 'addToParse',
            target: 'parsing',
          },
          EDIT: 'edit_book',
          DELETE: [{ target: 'book_list', cond: 'hasBooks' }, 'home'],
          SETTINGS: 'settings',
          START_ENCODING: 'encoding',
        },
      },
      edit_book: {
        on: {
          SAVE: 'book_list',
          CANCEL: 'book_list',
        },
      },
      encoding: {
        on: {
          STOP: 'book_list',
          DONE: ['encoding', 'done'],
          ERROR: ['encoding', 'done'],
        },
      },
      done: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      hasBooks({ books }) {
        return books.length > 0
      },
    },
    actions: {
      addBook(state, { book }) {
        state.books = [...state.books, book]
      },
      setAdding(state) {
        state.adding = state.parsed[0]
        state.parsed = state.parsed.slice(1)
      },
      resetAdding(state) {
        state.adding = null
      },
    },
  },
)
