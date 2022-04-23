import * as React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'

import type { Post } from '@entities/Post.entity'

const submit = async (
  owner: string,
  title: string,
  content: string
): Promise<Post> => {
  const res = await fetch('/api/content/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ owner, title, content }),
  })

  const { newPost }: { newPost: Post } = await res.json()
  return newPost
}

function NewPostForm({ owner }) {
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <Box p={3} border="1px" borderRadius="md">
      <FormControl>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="content">Content</FormLabel>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </FormControl>
      <Button
        onClick={() => submit(owner, title, content)}
        isLoading={isLoading}
      >
        Post
      </Button>
    </Box>
  )
}

export default NewPostForm
