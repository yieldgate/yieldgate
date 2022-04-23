import {
  Box,
  Text,
  Heading,
  Button,
  Flex,
  Image,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  Link,
} from '@chakra-ui/react'
import Layout from '@components/layout/Layout'
import { Creator } from '@entities/Creator.entity'
import { env } from '@lib/environment'
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { BsSearch } from 'react-icons/bs'

export interface IndexPageProps {
  creators: Creator[]
}

function CreatorCard(props: Creator): JSX.Element {
  return (
    <NextLink href={`/users/${props.address}`} passHref>
      <Link>
        <Flex direction="column" border="1px" p={8} borderRadius="md">
          <Text key={props._id} decoration={'underline'}></Text>
          <Box as="pre" overflow="scroll" bg="gray.200">
            <code>{JSON.stringify(props, null, 2)}</code>
          </Box>
        </Flex>
      </Link>
    </NextLink>
  )
}

export default function IndexPage({ creators }: IndexPageProps) {
  return (
    <Layout>
      <Flex
        bgImage="/images/banner-background.png"
        bgPos="center"
        bgSize="cover"
      >
        <Container maxW="5xl" py={24}>
          <Flex direction="column" align="start" gap={3}>
            <Image src="/images/logo-yieldgate-long.svg" h="70px" mb={12} />
            <Text fontSize="3xl">
              Let your fans stake coins on your behalf
            </Text>
            <Button size="lg">Create on Yieldgate</Button>
          </Flex>
        </Container>
      </Flex>
      <Container maxW="5xl">
        <Flex direction="column">
          <Heading mt={24} mb={12} textAlign="center">
            What's Yieldgate?
          </Heading>
          <Text maxW="50em" alignSelf="center" fontSize="xl">
          Yieldgate is a monetisation tool for anyone to start receiving donations, or to support their favourite public goods projects, creators, and security researchers, with yield. No NFTs or tokens, just good old MATIC! Built with ❤️ on top of Aave, Polygon.
          </Text>
        </Flex>
        <Flex direction="column">
          <Heading mt={24} mb={12} textAlign="center">
            How does it work?
          </Heading>
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={10}>
            <Flex direction="column" border="1px">
              <Image fallbackSrc="https://i.imgur.com/2UFgYhq.png" h={52} />
              <Text p={5} fontSize="xl">
                Sign in with your wallet
              </Text>
            </Flex>
            <Flex direction="column" border="1px">
              <Image fallbackSrc="https://i.imgur.com/EkHEXRH.png" h={52} />
              <Text p={5} fontSize="xl">
              Edit your profile and make your first post
              </Text>
            </Flex>
            <Flex direction="column" border="1px">
              <Image fallbackSrc="https://i.imgur.com/8Ee8EMr.png" h={52} />
              <Text p={5} fontSize="xl">
              Share your Yieldgate profile to start receiving donations from your supporters in yield!
              </Text>
            </Flex>
          </Grid>
        </Flex>
        <Flex direction="column">
          <Heading mt={24} mb={12} textAlign="center">
            Explore and sponsor creators
          </Heading>
          <InputGroup size="lg">
            <InputLeftElement
              pointerEvents="none"
              children={<BsSearch size={20} />}
            />
            <Input placeholder="Find creator" />
          </InputGroup>
          <Flex direction="column" gap={8} py={8}>
            {creators.map((creator) => (
              <CreatorCard key={creator._id} {...creator} />
            ))}
          </Flex>
        </Flex>
      </Container>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await fetch(`${env.url}/api/creators/getAllCreators`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { creators }: { creators: Creator[] } = await res.json()

  return {
    props: {
      creators,
    } as IndexPageProps,
    // revalidate: 60,
  }
}
