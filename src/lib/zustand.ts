import { create } from 'zustand'
import { combine, devtools } from 'zustand/middleware'
type Reducer<Args> = (state: any, args: Args) => any
type Options = {
  nameStore?: string
  isLogging?: boolean
  hallo?: string
}
export default function createStore<State extends object, Args extends { type: string }>(
  initState: State,
  reducer: Reducer<Args>,
  options: Options = {}
) {
  const { nameStore = 'My Store', isLogging = false } = options
  return create(
    devtools(
      combine(initState, (set, get) => ({
        dispatch: async (args: Args) => {
          isLogging && console.log('old State', get())
          set(await reducer(get(), args), false, args)
          isLogging && console.log('new State', get())
        }
      })),
      { name: nameStore, enabled: process.env.NODE_ENV == 'production' ? false : true }
    )
  )
}
