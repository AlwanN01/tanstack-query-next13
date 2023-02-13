'use client'
import { POSTS } from '@/data/post'
import { wait, reject } from '@/helpers/wait'
import { useCount } from '@/hooks/useCount'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Fragment } from 'react'
export default function Home() {
  const { count, profile, dispatch } = useCount()
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: async ctx => {
      // await reject(0)
      const sec = await wait(1000)
      console.log(sec)
      return POSTS
    }
  })
  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

  return (
    <main>
      <h1>Tanstack Query </h1>
      <dl>
        {postsQuery.data.map(v => (
          <Fragment key={v.id}>
            <dt>{v.title}</dt>
            <dd>ID: {v.id}</dd>
          </Fragment>
        ))}
      </dl>
      <h2>{count}</h2>
      <h2>{profile.identitas.kota}</h2>
      <button onClick={() => dispatch({ type: 'increase', by: 2 })}>Increment ++ </button>
      <br />
      <br />
      <input type='text' id='setKota' />
      <button onClick={() => dispatch({ type: 'setKota', kota: document.querySelector<HTMLInputElement>('#setKota')!.value })}>SetName Kota</button>
    </main>
  )
}
