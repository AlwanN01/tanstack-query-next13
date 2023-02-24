'use client'
import { Grid } from '@mantine/core'
export default function Supabase() {
  return (
    <div>
      <Grid>
        <Grid.Col span={4}>1</Grid.Col>
        <Grid.Col span={4}>2</Grid.Col>
        <Grid.Col span={4}>3</Grid.Col>
      </Grid>
    </div>
  )
}
