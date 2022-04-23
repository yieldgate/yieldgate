import { Post } from './Post.entity'

export interface Creator {
  _id: string
  address: string
  supporters: string[]
  posts?: Post[]
  displayName?: string
  description?: string
}
