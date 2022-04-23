import {
  Box,
  Container, Flex, Grid,
  GridItem, Heading, Text
} from '@chakra-ui/react'
import { CreatorCard } from '@components/CreatorCard'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import NewPostForm from '@components/NewPostForm'
import SponsorsCard from '@components/SponsorsCard'
import { Creator } from '@entities/Creator.entity'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'

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
      <Layout>
        <Container maxW="5xl">
          <Grid templateColumns="300px 1fr" gap={10}>
            <Flex direction="column" gap={10}>
              <Box position={'sticky'} top='4' mt='4'>
                <CreatorCard creator={creator} />
                <SponsorsCard />
              </Box>
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
