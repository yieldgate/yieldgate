import { Box, Divider, Heading } from '@chakra-ui/react'
import type { Post as PostType } from '@entities/Post.entity'
import dayjs from 'dayjs'
import md from 'markdown-it'

function formatDateTime(date: string): string {
  return dayjs(date).format('MMM D, YYYY h:mm A')
}

function Lock(): JSX.Element {
  return (
    <Box
      h="200"
      bg="gray.400"
      sx={{ '> div + div': { mt: '8px' } }}
      p="5"
      overflow="hidden"
      mt={5}
      borderRadius="md"
    >
      <Box h="24px" w="95%" bg="gray.500" />
      <Box h="24px" w="98%" bg="gray.500" />
      <Box h="24px" w="93%" bg="gray.500" />
      <Box h="24px" w="95%" bg="gray.500" />
      <Box h="24px" w="76%" bg="gray.500" />
    </Box>
  )
}

function Post({
  post,
  isLocked,
}: {
  post: PostType
  isLocked: boolean
}): JSX.Element {
  const { _id, content, date, owner, title } = post
  if (isLocked) {
    return (
      <Box
        border="1px"
        borderRadius="md"
        padding="5"
        display="flex-column"
        sx={{ '> div + div': { mt: '12px' } }}
      >
        <Heading size="lg">{title}</Heading>
        <Box as="span" color="gray.400" fontSize="lg">
          {formatDateTime(date)}
        </Box>
        <Lock />
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
      <Box as="span" color="gray.400" fontSize="lg">
        {formatDateTime(date)}
      </Box>
      <Divider mt='4' />
      <Box
        dangerouslySetInnerHTML={{ __html: md().render(content) }}
        mt={5}
        sx={{
          '* + *': { mt: 3 },
          ol: { ml: 10 },
          'li + li': { mt: 0 },
        }}
      />
    </Box>
  )
}

export default Post
