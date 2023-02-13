import { produce } from 'immer'
import { wait } from '@/helpers/wait'
import createStore from '@/lib/zustand'

const initState = {
  count: 0,
  profile: {
    firstName: 'alwan',
    lastName: 'Nabawi',
    identitas: {
      provinsi: 'Jawa Barat',
      kota: 'Bandung',
      alamat: 'Margahayu'
    }
  }
}
type CountType = typeof initState
type Args = {
  type: 'increase' | 'decrease' | 'setKota'
  by?: number
  kota?: string
}
const reducer = produce(async (state: CountType, action: Args) => {
  const { type, by = 1 } = action
  const {
    profile: { identitas }
  } = state
  switch (type) {
    case 'increase':
      state.count = state.count + by
      break
    case 'decrease':
      state.count = state.count - by
      break
    case 'setKota':
      const kota = await wait(action.kota)
      identitas.kota = kota || identitas.kota
      break
  }
})
export const useCount = createStore(initState, reducer)
