import YieldGate from '@artifacts/contracts/YieldGate.sol/YieldGate.json'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import StakeAmountForm from '@components/StakeAmountForm'
import { Creator } from '@entities/Creator.entity'
import { useYieldgateContract } from '@lib/useYieldgateContract'
import { ethers } from 'ethers'
import { FC, useState } from 'react'
import { YieldGate as YieldGateType } from 'types/typechain'
import { ClaimedEvent } from 'types/typechain/contracts/YieldGate.sol/YieldGate'
import { useAccount, useSigner } from 'wagmi'

export interface CreatorCardActionsProps {
  creator: Creator, 
  isOwner: boolean,
  claimableAmount: number
  claimableAmountsIsLoading: boolean
  refetchClaimableAmounts: () => void
  updateContentIsLocked: () => void
  setShowConfetti: (_: boolean) => void
  supporterAmountStaked: number
  supporterAmountsIsLoading: boolean
  refetchSupporterAmountStaked: () => void
  refetchTotalAmountStaked: () => void
}
export const CreatorCardActions: FC<CreatorCardActionsProps> = ({
  creator,
  isOwner,
  claimableAmount,
  claimableAmountsIsLoading,
  refetchClaimableAmounts,
  updateContentIsLocked,
  setShowConfetti,
  supporterAmountStaked,
  supporterAmountsIsLoading,
  refetchSupporterAmountStaked,
  refetchTotalAmountStaked,
}) => {
  const { data: signer, refetch: refetchSigner } = useSigner()
  const {contractChain, contractAddresses} = useYieldgateContract()
  const { data: accountData } = useAccount()
  const [stakeIsLoading, setStakeIsLoading] = useState(false)
  const [unstakeIsLoading, setUnstakeIsLoading] = useState(false)
  const [claimIsLoading, setClaimIsLoading] = useState(false)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Stake
  const stake = async (value: string) => {
    await refetchSigner()
    if (!signer) return
    setStakeIsLoading(true)
    
    // Blockchain Transaction
    const contract = new ethers.Contract(
      contractAddresses.YieldGate,
      YieldGate.abi,
      signer
    ) as YieldGateType
    try {
      const transaction = await contract.stake(creator.address, {
        value: ethers.utils.parseEther(value),
        gasLimit: 500000,
      })
      console.log({transaction})
      const receipt = await transaction.wait()
      console.log({receipt})
    } catch (_) {
      setStakeIsLoading(false)
      return
    }

    // Database Transaction
    const res = await fetch('/api/supporters/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supporter: accountData?.address,
        beneficary: creator.address,
      }),
    })
    const { isAdded } = await res.json()
    if (isAdded) creator.supportersCount = (creator?.supportersCount || 0) + 1

    // Update UI
    refetchTotalAmountStaked()
    refetchSupporterAmountStaked()
    updateContentIsLocked()
    
    toast({
      title: 'Amount Staked',
      description: `You've successfully staked ${value} ${contractChain?.nativeCurrency?.symbol}`,
      status: 'success',
    })
    setShowConfetti(true)
    setStakeIsLoading(false)
  }

  // Unstake

  const unstake = async () => {
    await refetchSigner()
    if (!signer) return
    setUnstakeIsLoading(true)

    // Blockchain Transaction
    const contract = new ethers.Contract(
      contractAddresses.YieldGate,
      YieldGate.abi,
      signer
    ) as YieldGateType
    const transaction = await contract.unstake(creator.address, {
      gasLimit: 500000
    })
    console.log({ transaction })
    const receipt = await transaction.wait()
    console.log({ receipt })

    // Database Transaction
    const res = await fetch('/api/supporters/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supporter: accountData?.address,
        beneficary: creator.address,
      }),
    })
    const { isRemoved } = await res.json()
    if (isRemoved) creator.supportersCount = Math.max(0, (creator?.supportersCount || 0) - 1)

    // Update UI
    refetchTotalAmountStaked()
    refetchSupporterAmountStaked()
    updateContentIsLocked()

    toast({
      title: 'Amount Unstaked',
      description: `You've successfully unstaked ${supporterAmountStaked.toFixed(2)} ${contractChain?.nativeCurrency?.symbol}`,
      status: 'success',
    })
    setUnstakeIsLoading(false)
  }

  // Claim
  const claim = async () => {
    await refetchSigner()
    if (!signer) return
    setClaimIsLoading(true)

    // Blockchain Transaction
    const contract = new ethers.Contract(
      contractAddresses.YieldGate,
      YieldGate.abi,
      signer
    ) as YieldGateType
    const transaction = await contract.claim({
      gasLimit: 500000
    })
    console.log({ transaction })
    const receipt = await transaction.wait()
    console.log({ receipt })

    const claimedEvent = (receipt.events || []).filter(
      (e) => e.event === 'Claimed'
    )?.[0] as ClaimedEvent
    const claimedAmount = ethers.utils.formatUnits(
      claimedEvent?.args?.amount,
      'finney'
    )
    console.log({ claimedEvent, claimedAmount })

    // Update UI
    refetchClaimableAmounts()

    toast({
      title: 'Ammount claimed',
      description: `You've successfully claimed ${claimedAmount} m${contractChain?.nativeCurrency?.symbol}`,
      status: 'success',
    })
    setClaimIsLoading(false)
    setShowConfetti(true)
  }

  if (isOwner) return <>
    {/* Claim */}
    <Button w="full" py={'7'} colorScheme="whatsapp"
      disabled={claimIsLoading || claimableAmountsIsLoading || !claimableAmount}
      onClick={claim}
      isLoading={claimIsLoading}>
      <VStack spacing={'1'}>
        <Text>Claim</Text>
        {claimableAmountsIsLoading
          ? <Spinner size={'xs'} />
          : <Text fontSize={'xs'} opacity=".75">
            {claimableAmount
              ? `${claimableAmount.toFixed(8)} m${contractChain?.nativeCurrency?.symbol}`
              : 'Nothing to claim yet'}
          </Text>}
      </VStack>
    </Button>
  </>

  return <>
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
          <StakeAmountForm stake={stake} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>

    {/* Stake */}
    <Button w="full"
      disabled={stakeIsLoading || unstakeIsLoading}
      onClick={onOpen}
      isLoading={stakeIsLoading}>
      Stake
    </Button>

    {/* Unstake */}
    <Button
      w="full"
      py={'7'}
      disabled={stakeIsLoading || unstakeIsLoading || !supporterAmountStaked}
      onClick={unstake}
      isLoading={unstakeIsLoading}
    >
      <VStack spacing={'1'}>
        <Text>Unstake</Text>
        {supporterAmountsIsLoading
          ? <Spinner size={'xs'} />
          : <Text fontSize={'xs'} opacity=".75">
            {supporterAmountStaked
              ? `${supporterAmountStaked.toFixed(2)} ${contractChain?.nativeCurrency?.symbol}`
              : 'Nothing to unstake yet'}
          </Text>}
      </VStack>
    </Button>
  </>
}