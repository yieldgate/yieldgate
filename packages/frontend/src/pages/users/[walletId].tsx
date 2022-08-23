import { Center, Container, Grid, GridItem, Spinner, VStack } from '@chakra-ui/react'
import { CreatorCard } from '@components/creator/CreatorCard'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import NewPostForm from '@components/NewPostForm'
import SponsorsCard from '@components/SponsorsCard'
import { Creator } from '@entities/Creator.entity'
import { useSupporterStake } from '@lib/creatorReadHooks'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import { useAccount } from 'wagmi'

export default function UsersPage() {
  const router = useRouter()
  let { walletId } = router.query
  walletId = ((walletId as string) || '').toLowerCase()
  const { address } = useAccount()
  const isOwner =
    walletId && address && ethers.utils.getAddress(address) === ethers.utils.getAddress(walletId)
  const [creator, setCreator] = useState<Creator | null>(null)
  const { supporterStake, refetch: refetchSupporterStake } = useSupporterStake({
    supporter: address,
    beneficiary: creator?.address,
  })
  const [contentIsLocked, setContentIsLocked] = useState(true)

  // Content Lock
  useEffect(() => {
    setContentIsLocked(!isOwner && (supporterStake?.amount || 0) <= 0)
  }, [supporterStake])

  // Fetch Creator
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
  useAsyncEffect(async () => {
    if (!walletId) {
      setCreator(null)
      return
    }
    const creator = await fetchCreator()
    setCreator(creator)
  }, [walletId])

  // Check if wallet-address is valid
  if (typeof walletId !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(walletId as string)) {
    return <>Not a valid address</>
  }

  if (!creator)
    return (
      <>
        <Center>
          <Spinner size="xl" my="100" />
        </Center>
      </>
    )

  return (
    <Layout>
      <Container maxW="5xl">
        <Grid
          templateColumns={{ base: '1fr', md: 'minmax(auto, 0.75fr) 1fr' }}
          placeItems="start stretch"
          gap={10}
          py={10}
        >
          <VStack
            position={{ base: 'static', md: 'sticky' }}
            top="8"
            spacing={8}
            width="full"
            align="stretch"
          >
            <CreatorCard
              creator={creator}
              isOwner={!!isOwner}
              updateContentIsLocked={refetchSupporterStake}
            />
            <SponsorsCard sponsors={creator?.supporters} />
          </VStack>
          <GridItem>
            {isOwner && <NewPostForm creator={creator} setCreator={setCreator} />}
            <Feed feed={creator?.posts || []} isLocked={contentIsLocked} />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}
