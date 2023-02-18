'use client'
import { POSTS } from '@/data/post'
import { wait, reject } from '@/helpers/wait'
import { useCount, setKota } from '@/hooks/useCount'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Fragment, useMemo, useRef } from 'react'

setKota()
export default function Home() {
  const refKota = useRef<HTMLInputElement>(null)

  const querClient = useQueryClient()
  const { count, profile, element, getButtonInnerHtml, setKota } = useCount()
  const dispatch = useCount.use.dispatch()
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

  if (postsQuery.isLoading) return <h1>Loading</h1>
  if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>

  return (
    <main>
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
      {element}
      <br />
      <br />
      <button onClick={() => dispatch({ type: 'increase', by: 2 })}>Increment ++ </button>
      <button onClick={getButtonInnerHtml}>Change Element</button>
      <br />
      <br />
      <h2>{profile.identitas.kota}</h2>
      <input type='text' id='setKota' ref={refKota} />
      <button onClick={setKota(refKota)}>SetName Kota</button>
    </main>
  )
}
