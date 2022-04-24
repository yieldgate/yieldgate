import {
  Button, Flex, FormControl,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import type { Post } from '@entities/Post.entity'
import * as React from 'react'


export interface NewPostFormProps {
  creator: Creator,
  setCreator: (newCreator: any) => void,
}
function NewPostForm({ creator, setCreator }: NewPostFormProps) {
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const submit = async (
    owner: string,
    title: string,
    content: string
  ): Promise<Post> => {
    setIsLoading(true)
    const res = await fetch('/api/content/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, title, content }),
    })
  
    const { newPost }: { newPost: Post } = await res.json()
    setIsLoading(false)
    return newPost
  }
  
  

  return (
    <Flex p={5} border="1px" borderRadius="md" mb={30} direction="column">
      <FormControl mb={5}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`My latest trip`}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormLabel htmlFor="content">Content</FormLabel>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder={`Secret content where **you** can also use markdown.`}
        />
      </FormControl>
      <Button
        onClick={async () => {
          const newPost = await submit(creator.address, title, content)
          setCreator({
            ...creator,
            posts: [
              newPost,
              ...(creator.posts || []),
            ]
          } as Creator)
        }}
        isLoading={isLoading}
      >
        Post
      </Button>
    </Flex>
  )
}

export default NewPostForm
