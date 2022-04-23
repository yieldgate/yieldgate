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
            <Flex direction="column" border="1px" borderRadius="md">
              <Image fallbackSrc="https://via.placeholder.com/150" h={52} />
              <Text p={5} fontSize="xl">
                Vivamus in scelerisque nunc. Ut quis turpis venenatis, gravida
                tortor ut, suscipit mi.
              </Text>
            </Flex>
            <Flex direction="column" border="1px" borderRadius="md">
              <Image fallbackSrc="https://via.placeholder.com/150" h={52} />
              <Text p={5} fontSize="xl">
                Aenean porta porta ligula, vel iaculis erat condimentum sit
                amet. Pellentesque posuere sem sit amet feugiat mollis.
              </Text>
            </Flex>
            <Flex direction="column" border="1px" borderRadius="md">
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
