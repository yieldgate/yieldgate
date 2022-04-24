import * as React from 'react'
import {
  Flex,
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
    <Flex p={5} border="1px" borderRadius="md" mb={30} direction="column">
      <FormControl mb={5}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormLabel htmlFor="content">Content</FormLabel>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />
      </FormControl>
      <Button
        onClick={() => submit(owner, title, content)}
        isLoading={isLoading}
      >
        Post
      </Button>
    </Flex>
  )
}

export default NewPostForm
