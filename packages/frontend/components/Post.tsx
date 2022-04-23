import { Box, Heading } from '@chakra-ui/react'
import type { Post as PostType } from './types'

function formatDateTime(timestamp: number): string {
  return `${new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} - ${new Date(timestamp).toLocaleTimeString()}`
}

function Lock(): JSX.Element {
  return (
    <Box
      h="200"
      bg="gray.400"
      sx={{ '> div + div': { mt: '8px' } }}
      p="5"
      overflow="hidden"
    >
      <Box h="24px" w="95%" bg="gray.500" />
      <Box h="24px" w="98%" bg="gray.500" />
      <Box h="24px" w="93%" bg="gray.500" />
      <Box h="24px" w="95%" bg="gray.500" />
      <Box h="24px" w="76%" bg="gray.500" />
    </Box>
  )
}

function Post({ locked, title, timestamp, body }: PostType): JSX.Element {
  if (locked) {
    return (
      <Box border="1px" borderRadius="md" display="flex-column">
        <Lock />
        <Box padding="5">
          <Heading size="lg">{title}</Heading>
          <Box as="span">{formatDateTime(timestamp)}</Box>
        </Box>
      </Box>
    )
  }
  return (
    <Box
      border="1px"
      borderRadius="md"
      padding="5"
      display="flex-column"
      sx={{ '> div + div': { mt: '12px' } }}
    >
      <Heading size="lg">{title}</Heading>
      <Box as="span">{formatDateTime(timestamp)}</Box>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </Box>
  )
}

export default Post
