import { wait } from '@/helpers/wait'
import createStore, { SetState } from '@/lib/zustand'
import { createElement } from 'react'

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
  },
  element: createElement('button', { onClick: e => console.log(e.currentTarget.innerHTML) }, 'Button Element') as unknown as React.ReactNode
}
type CountType = typeof initState
type Args = {
  type: 'increase' | 'decrease' | 'setKota' | 'changeElement'
  by?: number
  kota?: string
  element?: React.ReactNode
}
const reducer = async (state: CountType, action: Args) => {
  const { type, by = 1 } = action
  const {
    profile: { identitas }
  } = state
  // prettier-ignore
  switch (type) {
    case 'increase': state.count = state.count + by; break 
    case 'decrease': state.count = state.count - by; break
    case 'changeElement': state.element = action.element!; break
    case 'setKota':
      const kota = await wait(action.kota)
      identitas.kota = kota || identitas.kota
      break
  }
}
const handler = (set: SetState<CountType>) => ({
  getButtonInnerHtml: (e: React.MouseEvent) => set({ element: e.currentTarget.innerHTML }),
  setKota: (ref: React.RefObject<HTMLInputElement>) => () =>
    set(state => {
      state.profile.identitas.kota = ref.current!.value
    })
})
export const useCount = createStore(initState, handler, reducer)

// export function useMethodCount() {
//   const set = useCount(state => state.set)
//   return {
//     getButtonInnerHtml: (e: React.MouseEvent) => set({ element: e.currentTarget.innerHTML }),
//     setKota: (ref: React.RefObject<HTMLInputElement>) => () =>
//       set(state => {
//         state.profile.identitas.kota = ref.current!.value
//       })
//   }
// }
