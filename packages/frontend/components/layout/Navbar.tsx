import { Box, Container, Flex, Image, Link } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'

function Navbar(): JSX.Element {
  return (
    <Box borderBottom="1px">
      <Container maxW="5xl" py={4}>
        <Flex alignItems="center" justify="space-between">
          <NextLink href="/" passHref>
            <Link>
              <Image src="/images/logo-yieldgate.svg" boxSize={7} alt="Yieldgate Logo" />
            </Link>
          </NextLink>
          <ConnectButton />
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
