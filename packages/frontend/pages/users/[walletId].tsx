import {
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { CreatorCard } from '@components/CreatorCard'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import NewPostForm from '@components/NewPostForm'
import SponsorsCard from '@components/SponsorsCard'
import StakeAmountForm from '@components/StakeAmountForm'
import { Creator } from '@entities/Creator.entity'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'

export default function UsersPage() {
  const router = useRouter()
  let { walletId } = router.query
  walletId = ((walletId as string) || '').toLowerCase()

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

  if (
    typeof walletId !== 'string' ||
    !/^0x[a-fA-F0-9]{40}$/.test(walletId as string)
  ) {
    return <>Not a valid address</>
  }

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
          <Grid templateColumns="300px 1fr" gap={10} py={10}>
            <Flex direction="column" gap={10}>
              <VStack position="sticky" top="4" mt="4">
                <CreatorCard creator={creator} />
                <SponsorsCard sponsors={creator?.supporters} />
              </VStack>
            </Flex>
            <GridItem>
              <NewPostForm />
              <Feed feed={creator?.posts || []} isLocked={false} />
            </GridItem>
          </Grid>
        </Container>
      </Layout>
    </>
  )
}
