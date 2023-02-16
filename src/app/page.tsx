'use client'
import { POSTS } from '@/data/post'
import { wait, reject } from '@/helpers/wait'
import { useCount } from '@/hooks/useCount'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Fragment } from 'react'
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)
const countryAtom = atom('Japan')
const citiesAtom = atom(['Tokyo', 'Kyoto', 'Osaka'])
const mangaAtom = atom({ 'Dragon Ball': 1984, 'One Piece': 1997, Naruto: 1999 })
const doubledCountAtom = atom(get => get(countAtom) * 2)

export default function Home() {
  const [doubledCount] = useAtom(doubledCountAtom)
  const [atomCount, setAtomCount] = useAtom(countAtom)

  const querClient = useQueryClient()
  const { count, profile, element, dispatch } = useCount()
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: async ctx => {
      // await reject(0)
      const sec = await wait(1000)
      console.log(sec)
      return [...POSTS]
    }
  })
  console.log('rendered')

  const postMutation = useMutation({
    mutationFn: async (title: string) => {
      await wait(1000)
      POSTS.push({ id: Math.random() * 1000, title })
    },
    onSuccess: () => querClient.invalidateQueries(['posts'])
  })

  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

  return (
    <main>
      <h1>{atomCount}</h1>
      <CountAtom />
      <CountAtom />
      <h2>{doubledCount}</h2>
      <h1>Tanstack Query</h1>
      <dl>
        {postsQuery.data.map(v => (
          <Fragment key={v.id}>
            <dt>{v.title}</dt>
            <dd>ID: {v.id}</dd>
          </Fragment>
        ))}
      </dl>
      <button onClick={() => postMutation.mutate('New Posts')} disabled={postMutation.isLoading}>
        Add New Post
      </button>
      <h2>{count}</h2>
      <button onClick={() => dispatch({ type: 'increase', by: 2 })}>Increment ++ </button>
      {element}
      <button onClick={() => dispatch({ type: 'changeElement', element: <h2>Awesome</h2> })}>Change Element</button>
      <br />
      <br />
      <h2>{profile.identitas.kota}</h2>
      <input type='text' id='setKota' />
      <button onClick={() => dispatch({ type: 'setKota', kota: document.querySelector<HTMLInputElement>('#setKota')!.value })}>SetName Kota</button>
    </main>
  )
}
function CountAtom() {
  const [atomCount, setAtomCount] = useAtom(countAtom)
  return (
    <div>
      <h2>{atomCount}</h2>
      <button onClick={() => setAtomCount(c => c + 1)}>one up</button>
    </div>
  )
}
