'use client'
import { POSTS } from '@/data/post'
import { wait, reject } from '@/helpers/wait'
import useCount, { useGrumpyStore } from '@/hooks/count'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Fragment } from 'react'
import { shallow } from 'zustand/shallow'
export default function Home() {
  const { profile, count } = useCount(({ profile, count }) => ({ profile, count }), shallow)
  const dispatch = useCount(({ dispatch }) => dispatch)

  const { bears, increasePopulation } = useGrumpyStore()
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
  console.log('rerender')

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
      <h2>{count}</h2>
      <h2>{profile.firstName}</h2>
      <button onClick={() => dispatch({ type: 'increase', by: 2 })}>Increment ++ </button>
      <button onClick={() => dispatch({ type: 'setName' })}>SetName Alfi</button>
      <h2>{bears}</h2>
      <button onClick={increasePopulation}>Increment ++ </button>
    </main>
  )
}
