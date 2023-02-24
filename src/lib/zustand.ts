'use client'
import { create, StoreApi, UseBoundStore } from 'zustand'
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
type Reducer<State, Args> = (state: State, args: Args, set: SetState<State>, get: () => State) => any
type Options = {
  nameStore?: string
  isLogging?: boolean
  hallo?: string
}
export function createStore<State extends object, Args extends { type: string; [key: string]: any }, Method>(
  initState: State,
  handler?: HandlerStore<State, Method>,
  reducer?: Reducer<State, Args>,
  options: Options = {}
) {
  const { nameStore = 'My Store', isLogging = false } = options
  const immerReducer = reducer && produce(reducer)
  return createSelectors(
    create(
      devtools(
        immer(
          combine(initState, (set, get) => ({
            dispatch: async (args: Args) => {
              isLogging && console.log('old State', get())
              set(reducer ? await immerReducer!(get() as unknown as Immutable<State>, args, set, get) : state => state, false, args)
              isLogging && console.log('new State', get())
            },
            set,
            ...handler!(set, get)
          }))
        ),
        { name: nameStore, enabled: process.env.NODE_ENV == 'production' ? false : undefined }
      )
    )
  )
}

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never
export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S) {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store(s => s[k as keyof typeof s])
  }

  return store
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
