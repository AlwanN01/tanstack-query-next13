import { create } from 'zustand'
import { combine, persist, devtools, StateStorage, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { get, set, del } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.
type Reducer<Args> = (state: any, args: Args) => any
type Options = {
  nameStore?: string
  isLogging?: boolean
  hallo?: string
}
export default function createStore<State extends object, Args extends { type: string }>(
  initState: State,
  reducer?: Reducer<Args>,
  options: Options = {}
) {
  const { nameStore = 'My Store', isLogging = false } = options
  return create(
    devtools(
      persist(
        immer(
          combine(initState, (set, get) => ({
            dispatch: async (args: Args) => {
              isLogging && console.log('old State', get())
              set(reducer ? await reducer(get(), args) : state => state, false, args)
              isLogging && console.log('new State', get())
            },
            set
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
