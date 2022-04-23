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
              Get your fans support you by letting them stake coins for your
              benefit
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
            Vivamus in scelerisque nunc. Ut quis turpis venenatis, gravida
            tortor ut, suscipit mi. Proin cursus porttitor justo eget maximus.
            Morbi auctor lacus id placerat luctus. Phasellus sagittis ultricies
            elit, nec egestas odio interdum vel. Aenean porta porta ligula, vel
            iaculis erat condimentum sit amet. Pellentesque posuere sem sit amet
            feugiat mollis.
          </Text>
        </Flex>
        <Flex direction="column">
          <Heading mt={24} mb={12} textAlign="center">
            How does it work?
          </Heading>
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={10}>
            <Flex direction="column" border="1px">
              <Image fallbackSrc="https://via.placeholder.com/150" h={52} />
              <Text p={5} fontSize="xl">
                Vivamus in scelerisque nunc. Ut quis turpis venenatis, gravida
                tortor ut, suscipit mi.
              </Text>
            </Flex>
            <Flex direction="column" border="1px">
              <Image fallbackSrc="https://via.placeholder.com/150" h={52} />
              <Text p={5} fontSize="xl">
                Aenean porta porta ligula, vel iaculis erat condimentum sit
                amet. Pellentesque posuere sem sit amet feugiat mollis.
              </Text>
            </Flex>
            <Flex direction="column" border="1px">
              <Image fallbackSrc="https://via.placeholder.com/150" h={52} />
              <Text p={5} fontSize="xl">
                Phasellus sagittis ultricies elit, nec egestas odio interdum
                vel.
              </Text>
            </Flex>
          </Grid>
        </Flex>
        <Flex direction="column">
          <Heading mt={24} mb={12} textAlign="center">
            Sponsor a creator
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
