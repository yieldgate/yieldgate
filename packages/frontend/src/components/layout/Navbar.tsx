import { Box, Container, Flex, Image, Link } from '@chakra-ui/react'
import { useIsSSR } from '@lib/useIsSSR'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'
import { useAccount } from 'wagmi'

function Navbar(): JSX.Element {
  const { address } = useAccount()
  const isSSR = useIsSSR()

  return (
    <Box borderBottom="1px">
      <Container maxW="5xl" py={4}>
        <Flex alignItems="center" justify="space-between">
          <NextLink href="/" passHref>
            <Link>
              <Image src="/images/logo-yieldgate.svg" boxSize={7} alt="Yieldgate Logo" />
            </Link>
          </NextLink>
          <div className="flex items-center gap-2">
            <ConnectButton />
            {address && !isSSR && (
              <NextLink href={`/users/${(address || '').toLowerCase()}`}>
                <a className="underline">My Profile</a>
              </NextLink>
            )}
          </div>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
