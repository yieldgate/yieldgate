import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon
} from '@chakra-ui/react'
import type { Post as PostType } from '@entities/Post.entity'
import dayjs from 'dayjs'
import md from 'markdown-it'
import { FaLock } from 'react-icons/fa'

function formatDateTime(date: string): string {
  return dayjs(date).format('MMM D, YYYY h:mm A')
}

function Lock(): JSX.Element {
  return (
    <Grid
      h="200"
      p="5"
      borderRadius="md"
      bg="gray.200"
      overflow="hidden"
      templateColumns="1fr"
      templateRows="1fr"
      mt="5"
    >
      <GridItem gridArea="1 / 1 / 1 / 1">
        <Flex direction="column" gap={2}>
          <Box h="24px" w="95%" bg="gray.300" />
          <Box h="24px" w="98%" bg="gray.300" />
          <Box h="24px" w="93%" bg="gray.300" />
          <Box h="24px" w="95%" bg="gray.300" />
          <Box h="24px" w="76%" bg="gray.300" />
        </Flex>
      </GridItem>
      <GridItem
        gridArea="1 / 1 / 1 / 1"
        alignSelf="center"
        justifySelf="center"
      >
        <Icon as={FaLock} color="gray.600" boxSize="24" />
      </GridItem>
    </Grid>
  )
}

function Post({
  post,
  isLocked,
}: {
  post: PostType
  isLocked: boolean
}): JSX.Element {
  const { content, date, title } = post
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
      <Divider mt="4" />
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
