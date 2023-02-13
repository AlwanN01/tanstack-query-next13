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
      return [...POSTS]
    }
  })

  const postMutation = useMutation({
    mutationFn: async (title: string) => {
      await wait(1000)
      POSTS.push({ id: Math.random() * 1000, title })
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
      <button onClick={() => postMutation.mutate('New Posts')}>Add New Post</button>
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
