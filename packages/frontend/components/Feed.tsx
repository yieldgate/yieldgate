import * as React from 'react'
import { Box } from '@chakra-ui/react'

import type { Post as PostType } from './types'
import Post from './Post'

interface FeedProps {
  feed: PostType[]
}

function Feed({ feed }: FeedProps): JSX.Element {
  return (
    <Box display="flex-column" sx={{ '> div + div': { mt: '30px' } }}>
      {feed.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Box>
  )
}

export default Feed
