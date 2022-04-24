import { ContractAddresses } from '@artifacts/addresses'
import YieldGate from '@artifacts/contracts/YieldGate.sol/YieldGate.json'
import {
  Container,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { CreatorCard } from '@components/CreatorCard'
import Feed from '@components/Feed'
import Layout from '@components/layout/Layout'
import NewPostForm from '@components/NewPostForm'
import SponsorsCard from '@components/SponsorsCard'
import StakeAmountForm from '@components/StakeAmountForm'
import { Creator } from '@entities/Creator.entity'
import { env } from '@lib/environment'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useState } from 'react'
import { YieldGate as YieldGateType } from 'types/typechain'
import { useAsyncEffect } from 'use-async-effect'
import { useAccount } from 'wagmi'

export default function UsersPage() {
  const router = useRouter()
  let { walletId } = router.query
  walletId = ((walletId as string) || '').toLowerCase()
  const [{ data: account }] = useAccount({
    fetchEns: true,
  })
  const isOwner =
    walletId &&
    account?.address &&
    account?.address.toLowerCase() === walletId.toLowerCase()
  const [creator, setCreator] = useState<Creator | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [{ data: accountData }, disconnect] = useAccount()

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

  const YieldGateContractAddress = ContractAddresses['80001'].YieldGate
  const [supporterIsStaking, setSupporterIsStaking] = useState(false)
  const readSupporterStakedAmount = async () => {
    const provider = ethers.getDefaultProvider(env.rpc.polygonMumbai)
    const supporter = accountData?.address
    const beneficiary = creator?.address
    if (!supporter || !beneficiary) {
      setSupporterIsStaking(false)
      return
    }
    const contract = new ethers.Contract(
      YieldGateContractAddress,
      YieldGate.abi,
      provider
    ) as YieldGateType
    const value = await contract.supporterStaked(supporter, beneficiary)
    setSupporterIsStaking(value.gt(0))
  }
  React.useEffect(() => {
    readSupporterStakedAmount()
  }, [accountData?.address, creator?.address])


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
          <Grid templateColumns="350px 1fr" gap={10} py={10}>
            <Flex direction="column" gap={10} width="full">
              <VStack
                position="sticky"
                spacing={8}
                width="full"
                align="stretch"
              >
                <CreatorCard creator={creator} isOwner={isOwner} updateContentIsLocked={readSupporterStakedAmount} />
                <SponsorsCard sponsors={creator?.supporters} />
              </VStack>
            </Flex>
            <GridItem>
              {isOwner && <NewPostForm owner={account.address} />}
              <Feed feed={creator?.posts || []} isLocked={!supporterIsStaking} />
            </GridItem>
          </Grid>
        </Container>
      </Layout>
    </>
  )
}
