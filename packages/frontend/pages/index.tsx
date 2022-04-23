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
} from '@chakra-ui/react'
import Layout from '@components/layout/Layout'
import { Creator } from '@entities/Creator.entity'
import { env } from '@lib/environment'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { BsSearch } from 'react-icons/bs'

export interface IndexPageProps {
  creators: Creator[]
}

export default function IndexPage({ creators }: IndexPageProps) {
  return (
    <Layout>
      <Flex
        bgImage="images/banner-background.png"
        bgPos="center"
        bgSize="cover"
      >
        <Container maxW="5xl" py={24}>
          <Flex direction="column" align="start" gap={3}>
            <Image src="images/logo-yieldgate-long.svg" h="70px" mb={12} />
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
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<BsSearch size={20} />}
            />
            <Input placeholder="Find creator" />
          </InputGroup>
        </Flex>
        <Box as="details" my={5}>
          <summary>Creators</summary>
          {creators.map((creator) => (
            <Text key={creator._id} decoration={'underline'}>
              <Link href={`/users/${creator.address}`}>{creator.address}</Link>
            </Text>
          ))}
          <Box as="pre" overflow="scroll" bg="gray.200">
            <code>{JSON.stringify(creators, null, 2)}</code>
          </Box>
        </Box>
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
