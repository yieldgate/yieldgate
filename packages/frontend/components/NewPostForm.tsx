import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'

function NewPostForm() {
  return (
    <Box p={3} border="1px" borderRadius="md" mb="30px">
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
  )
}

export default NewPostForm
