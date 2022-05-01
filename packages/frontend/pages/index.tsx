import { Button, Container, Flex, Grid, Heading, Image, Text } from '@chakra-ui/react'
import { CreatorsList } from '@components/creator/CreatorsList'
import Layout from '@components/layout/Layout'
import { Creator } from '@entities/Creator.entity'
import { env } from '@lib/environment'
import { useIsSSR } from '@lib/useIsSSR'
import { GetServerSideProps } from 'next'
import NextLink from 'next/link'
import { useAccount } from 'wagmi'

export interface IndexPageProps {
  creators: Creator[]
}
export default function IndexPage({ creators }: IndexPageProps) {
  const { data: accountData } = useAccount()
  const isSSR = useIsSSR()

  return (
    <Layout>
      <Flex
        bgImage="/images/banner-background.png"
        bgPos="center"
        bgSize="cover"
      >
        <Container maxW="5xl" py={24}>
          <Flex direction="column" align="start" gap={3}>
            <Image src="/images/logo-yieldgate-long.svg" h="70px" mb={2} alt="Yieldgate Cover Image" />
            <Text fontSize="3xl" fontWeight={700}>
              Earn yield from your supporters.
              <br />
              Support your favourite projects and creators with yield.
            </Text>
            {!isSSR && accountData && (
              <NextLink href={`/users/${accountData.address}`} passHref>
                <Button size="lg" mt="6">
                  Create on Yieldgate
                </Button>
              </NextLink>
            )}
          </Flex>
        </Container>
      </Flex>
      <Container maxW="5xl">
        <Flex direction="column">
          <Heading mt={24} mb={12} textAlign="center">
            What's Yieldgate?
          </Heading>
          <Text
            maxW="30em"
            alignSelf="center"
            fontSize="2xl"
            textAlign="center"
          >
            Yieldgate is a protocol that allows anyone to start earning and building products with programmable yield.
          </Text>
        </Flex>
        <Flex direction="column">
          <Heading mt={24} mb={12} textAlign="center">
            How does it work?
          </Heading>
          <Grid gridTemplateColumns="repeat(3, 1fr)" gap={10}>
            <Flex
              direction="column"
              border="1px"
              borderRadius="md"
              overflow="hidden"
            >
              <Image src="/images/step-1.png" h={52} alt="Step 1" />
              <Text p={5} fontSize="xl">
                Sign in with your wallet
              </Text>
            </Flex>
            <Flex
              direction="column"
              border="1px"
              borderRadius="md"
              overflow="hidden"
            >
              <Image src="/images/step-2.png" h={52} alt="Step 2" />
              <Text p={5} fontSize="xl">
                Edit your profile and make your first post
              </Text>
            </Flex>
            <Flex
              direction="column"
              border="1px"
              borderRadius="md"
              overflow="hidden"
            >
              <Image src="/images/step-3.png" h={52} alt="Step 3" />
              <Text p={5} fontSize="xl">
                Share your Yieldgate profile to start receiving donations from
                your supporters in yield!
              </Text>
            </Flex>
          </Grid>
        </Flex>
        <CreatorsList creators={creators} />
        <Flex direction="column" mb={40}>
          <Heading mt={24} mb={24} textAlign="center">
            On the shoulders of giants
          </Heading>
          <Grid
            templateColumns="1fr 1fr"
            templateRows="100px 100px"
            gap="20"
            placeItems="center"
          >
            <Image src="/images/aave.svg" h="60%" alt="AAVE" />
            <Image src="/images/polygon.svg" h="70%" alt="Polygon" />
            <Image src="/images/walletconnect.svg" h="60%" alt="WalletConnect" />
            <Image src="/images/coinbase.svg" h="50%" alt="Coinbase" />
          </Grid>
        </Flex>
      </Container>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
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
  }
}
