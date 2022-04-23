import {
  Grid,
  GridItem,
  Container,
  Text,
  Heading,
  Flex,
  HStack,
  VStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { BlockiesAvatar } from '@components/BlockiesAvatar'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import SponsorsCard from '@components/SponsorsCard'
import NewPostForm from '@components/NewPostForm'
import { Creator } from '@entities/Creator.entity'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import StakeAmountForm from '@components/StakeAmountForm'

export default function UsersPage() {
  const router = useRouter()
  let { walletId } = router.query
  if (
    typeof walletId !== 'string' ||
    !/^0x[a-fA-F0-9]{40}$/.test(walletId as string)
  ) {
    return <>Not a valid address</>
  }
  walletId = walletId.toLowerCase()

  // const { account } = useEthers()
  const account = undefined
  const [isMyPage, setIsMyPage] = useState(false)
  const [creator, setCreator] = useState<Creator | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchCreator = async (): Promise<Creator> => {
    const res = await fetch('/api/creators/getCreator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: walletId,
      }),
    })

    const { creator }: { creator: Creator } = await res.json()
    return creator
  }

  useEffect(() => {
    if (!walletId || !account) {
      setIsMyPage(false)
    }
    setIsMyPage(walletId === account)
  }, [account])

  useAsyncEffect(async () => {
    if (!walletId) {
      setCreator(null)
      return
    }
    const creator = await fetchCreator()
    setCreator(creator)
  }, [walletId])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How much do you want to stake?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              You can unstake and get the full amount minus gas fees back
              anytime.
            </Text>
            <StakeAmountForm />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Layout>
        <Container maxW="5xl">
          <Grid templateColumns="300px 1fr" gap={10}>
            <Flex direction="column" gap={10}>
              <VStack p={8} spacing={8} borderRadius="md" bg="gray.200">
                <BlockiesAvatar
                  address={creator?.address}
                  borderRadius="full"
                  width="200px"
                  height="200px"
                />
                <Button
                  w="full"
                  bg="gray.900"
                  color="gray.100"
                  onClick={onOpen}
                >
                  Stake
                </Button>
                <HStack spacing={8} mx={8}>
                  <Flex direction="column" align="center">
                    <Heading>{creator?.supportersCount}</Heading>
                    <Text>Supporters</Text>
                  </Flex>
                  {/* <Flex direction="column" align="center">
                <Heading>{creator.supportersCount}</Heading>
                <Text>ETH staked</Text>
              </Flex> */}
                  <Flex direction="column" align="center">
                    <Heading>{creator?.postsCount}</Heading>
                    <Text>Posts</Text>
                  </Flex>
                </HStack>
                <Text>
                  Reward description. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.
                </Text>
              </VStack>
              <SponsorsCard sponsors={creator?.supporters} />
            </Flex>
            <GridItem>
              <NewPostForm />
              <Heading>Perry Mason</Heading>
              <Text>The most influential creator in web3</Text>
              <Text>
                Proin pulvinar lectus massa, at ornare arcu pellentesque in.
                Aliquam eget pulvinar dui, ac finibus purus. Sed sollicitudin
                est quis nunc porta commodo. Fusce commodo arcu non metus
                bibendum, vel finibus odio sagittis. Praesent et dolor sit amet
                enim porta sodales nec in tortor. Vestibulum metus metus, dictum
                sit amet erat vel, blandit ornare est. Vivamus porta enim sed
                orci varius mattis. Fusce at volutpat nunc. Nunc varius feugiat
                ornare. Sed non sapien maximus, consectetur metus vel,
                condimentum magna. Pellentesque in ipsum ac dui tempor ornare.
                Nunc non risus nec risus sollicitudin rutrum vitae ut metus.
              </Text>
              <Feed feed={creator?.posts || []} isLocked={false} />
            </GridItem>
          </Grid>
        </Container>
      </Layout>
    </>
  )
}
