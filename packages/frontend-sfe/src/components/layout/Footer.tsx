import type { IconProps } from '@chakra-ui/react'
import { Box, Container, Flex, Grid, GridItem, Icon, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { BsGithub, BsTwitter } from 'react-icons/bs'

const RadicleIcon = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 36 34" fill="currentColor" {...props}>
      <path d="m18.6 19 .8-2.5C22 9.4 24.4 1.7 33 1h1c-.2.2-.3.6-.4 1l-.4 2.2c-.2 1.8-.6 4-1.5 5.7-1.8 3.4-6.9 5.1-9.4 4.6-2.4 2.6-3 8-2.6 12l.3 2c.2 1 .4 1.9.4 2.7-.2 2.4-4.5 2.4-4.6 0 0-.8 0-1.7.3-2.7l.3-2 .1-.7c.4-3.6.6-6.3-1.5-8.5a8 8 0 0 0-.8-.7l-.5.9a4.1 4.1 0 0 1-4 1.6c-2-.3-3.5-2-5-3.7a21.6 21.6 0 0 0-2.6-2.8l1.2-.3C8.8 10.8 14.9 14 17.5 19l.6 1.3.5-1.4Zm-.7-1.1.6-1.6.9-2.8c.8-2.2 1.7-4.4 2.8-6.4 1.2-2 2.6-3.8 4.6-5C28.8.6 31 0 34 0h2l-1.2 1.6-.3 1A32.5 32.5 0 0 0 34 5a17 17 0 0 1-1.5 5.5c-1 2-3 3.4-5 4.2-1.6.7-3.4 1-4.9 1A11 11 0 0 0 21 20a26 26 0 0 0-.2 6.2c0 .7.2 1.3.3 2a95.3 95.3 0 0 1 .4 3c0 .9-.6 1.6-1.2 2a3.7 3.7 0 0 1-4.3 0 2.7 2.7 0 0 1-1.1-2 9.8 9.8 0 0 1 .3-3l.4-2v-.6c.2-1.9.3-3.4.2-4.7a5 5 0 0 0-1.3-2.8A5.1 5.1 0 0 1 9.7 20a7.7 7.7 0 0 1-4.8-3L4 16a45.4 45.4 0 0 0-2.4-2.5l-1.6-1 1.8-.8c6-2.4 13 .8 16.1 6.2Z" />
    </Icon>
  )
}

function Footer(): JSX.Element {
  return (
    <Box borderTop="1px" mt="10">
      <Container maxW="5xl" py={4}>
        <Grid
          as="footer"
          templateAreas={{
            base: '"love" "email" "social"',
            md: '"social love email"',
          }}
          templateColumns={{ base: '1fr', md: '180px 1fr 180px' }}
          placeItems="center"
          gap="4"
        >
          <Flex gap="4" gridArea="social" justifySelf={{ md: 'start' }}>
            <NextLink href="https://twitter.com/yieldgate" passHref>
              <Link>
                <Icon as={BsTwitter} boxSize="8" color="gray.700" />
              </Link>
            </NextLink>
            <NextLink href="https://github.com/yieldgate" passHref>
              <Link>
                <Icon as={BsGithub} boxSize="8" color="gray.700" />
              </Link>
            </NextLink>
            <NextLink
              href="https://app.radicle.network/seeds/maple.radicle.garden/rad:git:hnrkgaqy1ws45bqqazahkw6k47riccwgtwa6o"
              passHref
            >
              <Link>
                <RadicleIcon boxSize="8" color="gray.700" />
              </Link>
            </NextLink>
          </Flex>
          <GridItem textAlign="center" gridArea="love">
            Built with ❤️ at ETHGlobal{' '}
            <Text as="span" whiteSpace="nowrap">
              Amsterdam 🇳🇱
            </Text>
          </GridItem>
          <GridItem gridArea="email" justifySelf={{ md: 'end' }}>
            <NextLink href="mailto:hi@yieldgate.xyz" passHref>
              <Link>hi@yieldgate.xyz</Link>
            </NextLink>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
