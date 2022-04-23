import * as React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react'

function NewPostForm() {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <VStack align="stretch" spacing={3}>
      <Button onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? 'Hide post form' : 'Create a post'}
      </Button>
      {isVisible && (
        <Box p={3} border="1px" borderRadius="md">
          <FormControl>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="body">Body</FormLabel>
            <Textarea id="title" />
          </FormControl>
          <Button>Post</Button>
        </Box>
      )}
    </VStack>
  )
}

export default NewPostForm
