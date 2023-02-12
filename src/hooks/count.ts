'use client'
import { create } from 'zustand'
import { combine, devtools, redux } from 'zustand/middleware'
import { produce } from 'immer'
import { immer } from 'zustand/middleware/immer'
import { wait } from '@/helpers/wait'

const initGrumpy = { grumpiness: 0 }
export const useGrumpyStore = create<Bears>()(
  devtools(
    set => ({
      bears: 0,
      increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 })
    }),
    { name: 'bear' }
  )
)

interface Bears {
  bears: number
  increasePopulation: () => void
  removeAllBears: () => void
}

type Args = {
  type: 'increase' | 'decrease' | 'setName'
  by?: number
}

const reducer = produce((state: CountType, action: Args) => {
  const { type, by = 1 } = action

  switch (type) {
    case 'increase':
      state.count = state.count + by
      break
    case 'decrease':
      state.count = state.count - by
    case 'setName':
      state.profile.firstName = 'alfi2'
      break
  }

  return state
})
const initState = { count: 0, profile: { firstName: 'alwan', lastName: 'Nabawi' } }
const useCount = create(
  devtools(
    combine(initState, (set, get) => ({
      dispatch: (args: Args) => set(reducer(get(), args), false, { type: args.type })
    })),
    { name: 'Count Store' }
  )
)
// const useCount = create(
//   devtools(
//     combine(initState, (set, get) => ({
//       dispatch: async (args: Args) => set(await reducer({ ...get() }, args), false, { type: args.type })
//     })),
//     { name: 'Count Store' }
//   )
// )
// const useCount = create(devtools(redux(reducer,initState)))
export default useCount
type CountType = Omit<ReturnType<typeof useCount['getState']>, 'dispatch'>

const types = { increase: 'INCREASE', decrease: 'DECREASE' }

const reducer2 = (state: typeof initGrumpy, { type, by = 1 }: Args) => {
  switch (type) {
    case 'increase':
      return { grumpiness: state.grumpiness + by }
    case 'decrease':
      return { grumpiness: state.grumpiness - by }
  }
}
