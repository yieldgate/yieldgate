import { Box } from '@chakra-ui/react'
import { Post as PostType } from '@entities/Post.entity'
import * as React from 'react'
import Post from './Post'

interface FeedProps {
  isLocked: boolean
  feed: PostType[]
}

function Feed({ feed, isLocked }: FeedProps): JSX.Element {
  return (
    <Box display="flex-column" sx={{ '> div + div': { mt: '30px' } }}>
      {feed.map((post) => (
        <Post key={post.date} isLocked={isLocked} post={post} />
      ))}
    </Box>
  )
}

export default Feed
