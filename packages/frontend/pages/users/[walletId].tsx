import { Center, Container, Flex, Grid, GridItem, Spinner, VStack } from '@chakra-ui/react'
import { CreatorCard } from '@components/creator/CreatorCard'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import NewPostForm from '@components/NewPostForm'
import SponsorsCard from '@components/SponsorsCard'
import { Creator } from '@entities/Creator.entity'
import { useSupporterAmountStaked } from '@lib/creatorReadHooks'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import { useAccount } from 'wagmi'

export default function UsersPage() {
  const router = useRouter()
  let { walletId } = router.query
  walletId = ((walletId as string) || '').toLowerCase()
  const { data: accountData } = useAccount()
  const isOwner =
    walletId &&
    accountData?.address &&
    accountData?.address.toLowerCase() === walletId.toLowerCase()
  const [creator, setCreator] = useState<Creator | null>(null)
  const { supporterAmountStaked, refetch: refetchSupporterAmountStaked } = useSupporterAmountStaked({ supporter: accountData?.address, beneficiary: creator?.address })
  const [contentIsLocked, setContentIsLocked] = useState(true)
  
  // Content Lock
  useEffect(() => {
    setContentIsLocked(!isOwner && (supporterAmountStaked || 0) <= 0)
  }, [supporterAmountStaked])
  
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
  if (
    typeof walletId !== 'string' ||
    !/^0x[a-fA-F0-9]{40}$/.test(walletId as string)
  ) {
    return <>Not a valid address</>
  }

  if (!creator) return <>
    <Center>
      <Spinner size='xl' my='100' />
    </Center>
  </>

  return (<>
    <Layout>
      <Container maxW="5xl">
        <Grid templateColumns="350px 1fr" gap={10} py={10}>
          <Flex direction="column" gap={10} width="full">
            <VStack
              position="sticky"
              spacing={8}
              width="full"
              align="stretch"
            >
              <CreatorCard creator={creator} isOwner={!!isOwner} updateContentIsLocked={refetchSupporterAmountStaked} />
              <SponsorsCard sponsors={creator?.supporters} />
            </VStack>
          </Flex>
          <GridItem>
            {isOwner && <NewPostForm creator={creator} setCreator={setCreator} />}
            <Feed feed={creator?.posts || []} isLocked={contentIsLocked} />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  </>)
}
