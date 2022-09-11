import { Post } from './Post.entity'

export interface Creator {
  _id: string
  address: string
  supporters: string[]
  supportersCount?: number
  posts?: Post[]
  postsCount?: number
  displayName?: string
  description?: string

  // added on runtime
  ensName?: string
}
