import { Box, Container, Flex, Grid, GridItem, Icon, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import * as React from 'react'
import { BsGithub, BsTwitter } from 'react-icons/bs'


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
