import { create } from 'zustand'
import { combine, persist, devtools, StateStorage, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { get, set, del } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.
import { Immutable, produce } from 'immer'
import type { Draft } from 'immer'
export type SetState<State> = (
  nextStateOrUpdater: State | Partial<State> | ((state: Draft<State>) => void),
  shouldReplace?: boolean | undefined,
  action?:
    | string
    | {
        type: unknown
      }
    | undefined
) => void
type HandlerStore<State, Method> = (set: SetState<State>, get: () => State) => Method
type Reducer<State, Args> = (state: State, args: Args) => any
type Options = {
  nameStore?: string
  isLogging?: boolean
  hallo?: string
}
export default function createStore<State extends object, Args extends { type: unknown }, Method>(
  initState: State,
  handler?: HandlerStore<State, Method>,
  reducer?: Reducer<State, Args>,
  options: Options = {}
) {
  const { nameStore = 'My Store', isLogging = false } = options
  const immerReducer = reducer && produce(reducer)
  return create(
    devtools(
      persist(
        immer(
          combine(initState, (set, get) => ({
            dispatch: async (args: Args) => {
              isLogging && console.log('old State', get())
              set(reducer ? await immerReducer!(get() as unknown as Immutable<State>, args) : state => state, false, args)
              isLogging && console.log('new State', get())
            },
            set,
            ...handler!(set, get)
          }))
        ),
        { name: '', storage: undefined }
      ),
      { name: nameStore, enabled: process.env.NODE_ENV == 'production' ? false : true }
    )
  )
}

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved')
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved')
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, 'has been deleted')
    await del(name)
  }
}
