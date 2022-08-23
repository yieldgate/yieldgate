import { Button, Spinner, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import { SupporterStake } from '@lib/creatorReadHooks'
import { useDeployments } from '@lib/useDeployments'
import { BeneficiaryPool__factory, YieldGate__factory } from '@yieldgate/contracts/typechain-types'
import { ClaimedEvent } from '@yieldgate/contracts/typechain-types/contracts/YieldGate.sol/BeneficiaryPool'
import { ethers, Event } from 'ethers'
import { FC, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { CreatorPoolParamsDialog } from './CreatorPoolParamsDialog'
import { SupporterStakeDialog } from './SupporterStakeDialog'

export interface CreatorCardActionsProps {
  creator: Creator
  isOwner: boolean
  claimableAmount: number | undefined
  claimableAmountsIsLoading: boolean
  refetchClaimableAmounts: () => void
  updateContentIsLocked: () => void
  setShowConfetti: (_: boolean) => void
  supporterStake: SupporterStake | undefined
  supporterStakeIsLoading: boolean
  refetchSupporterStake: () => void
  refetchTotalAmountStaked: () => void
  poolAddress?: string | false
  refetchPoolAddress: () => void
  minAmount?: string
  minDurationDays?: number
  refetchPoolParams: () => void
  poolParamsAreLoading: boolean
}
export const CreatorCardActions: FC<CreatorCardActionsProps> = ({
  creator,
  isOwner,
  claimableAmount,
  claimableAmountsIsLoading,
  refetchClaimableAmounts,
  updateContentIsLocked,
  setShowConfetti,
  supporterStake,
  supporterStakeIsLoading,
  refetchSupporterStake,
  refetchTotalAmountStaked,
  poolAddress,
  refetchPoolAddress,
  minAmount,
  minDurationDays,
  refetchPoolParams,
  poolParamsAreLoading,
}) => {
  const { data: signer, refetch: refetchSigner } = useSigner()
  const { contractsChain, contracts } = useDeployments()
  const { address } = useAccount()
  const [stakeIsLoading, setStakeIsLoading] = useState(false)
  const [deployIsLoading, setDeployIsLoading] = useState(false)
  const [unstakeIsLoading, setUnstakeIsLoading] = useState(false)
  const [claimIsLoading, setClaimIsLoading] = useState(false)
  const toast = useToast()
  const {
    isOpen: stakeDialogIsOpen,
    onOpen: stakeDialogOnOpen,
    onClose: stakeDialogOnClose,
  } = useDisclosure()
  const {
    isOpen: paramsDialogIsOpen,
    onOpen: paramsDialogOnOpen,
    onClose: paramsDialogOnClose,
  } = useDisclosure()

  // Deploy Pool
  const deploy = async () => {
    await refetchSigner()
    if (!signer || !contracts) return
    setDeployIsLoading(true)

    // Blockchain Transaction
    try {
      const contract = YieldGate__factory.connect(contracts.YieldGate.address, signer)
      const transaction = await contract.deployPool(creator.address, {
        gasLimit: 500000,
      })
      console.log({ transaction })
      const receipt = await transaction.wait()
      console.log({ receipt })
    } catch (e) {
      console.error('Error while deploying pool:', e)
      setDeployIsLoading(false)
      return
    }

    // Update UI
    refetchTotalAmountStaked()
    refetchSupporterStake()
    updateContentIsLocked()
    refetchPoolAddress()

    toast({
      title: 'Pool Deployed',
      description: `You've successfully created a pool. It can now be staked on the creators behalf.`,
      status: 'success',
    })
    setDeployIsLoading(false)
  }

  // Stake
  const stake = async (value: string) => {
    await refetchSigner()
    if (!poolAddress || !contracts || !signer || !address) return
    setStakeIsLoading(true)

    try {
      const poolContract = BeneficiaryPool__factory.connect(poolAddress, signer)
      const transaction = await poolContract.stake(address, {
        value: ethers.utils.parseEther(value),
        gasLimit: 500000,
      })
      console.log({ transaction })
      const receipt = await transaction.wait()
      console.log({ receipt })
    } catch (e) {
      console.error('Error while staking:', e)
      setStakeIsLoading(false)
      return
    }

    // Database Transaction
    const res = await fetch('/api/supporters/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supporter: address,
        beneficary: creator.address,
      }),
    })
    const { isAdded } = await res.json()
    if (isAdded) creator.supportersCount = (creator?.supportersCount || 0) + 1

    // Update UI
    refetchTotalAmountStaked()
    refetchSupporterStake()
    updateContentIsLocked()

    toast({
      title: 'Amount Staked',
      description: `You've successfully staked ${value} ${contractsChain?.nativeCurrency?.symbol}`,
      status: 'success',
    })
    setShowConfetti(true)
    setStakeIsLoading(false)
  }

  // Unstake
  const unstake = async () => {
    await refetchSigner()
    if (!poolAddress || !contracts || !signer) return
    setUnstakeIsLoading(true)

    // Blockchain Transaction
    try {
      const poolContract = BeneficiaryPool__factory.connect(poolAddress, signer)
      const transaction = await poolContract.unstake({
        gasLimit: 500000,
      })
      console.log({ transaction })
      const receipt = await transaction.wait()
      console.log({ receipt })
    } catch (e) {
      console.error('Error while unstaking:', e)
      setUnstakeIsLoading(false)
      return
    }

    // Database Transaction
    const res = await fetch('/api/supporters/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supporter: address,
        beneficary: creator.address,
      }),
    })
    const { isRemoved } = await res.json()
    if (isRemoved) creator.supportersCount = Math.max(0, (creator?.supportersCount || 0) - 1)

    // Update UI
    refetchTotalAmountStaked()
    refetchSupporterStake()
    updateContentIsLocked()

    toast({
      title: 'Amount Unstaked',
      description: `You've successfully unstaked ${supporterStake?.amount?.toFixed(2)} ${
        contractsChain?.nativeCurrency?.symbol
      }`,
      status: 'success',
    })
    setUnstakeIsLoading(false)
  }

  // Claim
  const claim = async () => {
    await refetchSigner()
    if (!poolAddress || !contracts || !signer) return
    setClaimIsLoading(true)

    // Blockchain Transaction
    let claimedAmount
    try {
      const poolContract = BeneficiaryPool__factory.connect(poolAddress, signer)
      const transaction = await poolContract.claim({
        gasLimit: 500000,
      })
      console.log({ transaction })
      const receipt = await transaction.wait()
      console.log({ receipt })
      const claimedEvent = (receipt.events || []).filter(
        (e: Event) => e.event === 'Claimed'
      )?.[0] as ClaimedEvent
      claimedAmount = ethers.utils.formatUnits(claimedEvent?.args?.amount, 'finney')
      console.log({ claimedEvent, claimedAmount })
    } catch (e) {
      console.error('Error while claiming:', e)
      setClaimIsLoading(false)
      return
    }

    // Update UI
    refetchClaimableAmounts()

    toast({
      title: 'Ammount claimed',
      description: `You've successfully claimed ${claimedAmount} m${contractsChain?.nativeCurrency?.symbol}`,
      status: 'success',
    })
    setClaimIsLoading(false)
    setShowConfetti(true)
  }

  if (!poolAddress)
    return (
      <>
        {/* Deploy */}
        <Button
          w="full"
          py={'7'}
          disabled={deployIsLoading}
          onClick={deploy}
          isLoading={deployIsLoading}
        >
          Deploy Pool
        </Button>
      </>
    )

  if (isOwner)
    return (
      <>
        {/* Claim */}
        <Button
          w="full"
          py={'7'}
          colorScheme="whatsapp"
          disabled={claimIsLoading || claimableAmountsIsLoading || !claimableAmount}
          onClick={claim}
          isLoading={claimIsLoading}
        >
          <VStack spacing={'1'}>
            <Text>Claim</Text>
            {claimableAmountsIsLoading ? (
              <Spinner size={'xs'} />
            ) : (
              <Text fontSize={'xs'} opacity=".75">
                {claimableAmount
                  ? `${claimableAmount.toFixed(8)} m${contractsChain?.nativeCurrency?.symbol}`
                  : 'Nothing to claim yet'}
              </Text>
            )}
          </VStack>
        </Button>

        {poolAddress && (
          <>
            {/* Open Pool Params */}
            <Button
              w="full"
              py={'7'}
              onClick={paramsDialogOnOpen}
              disabled={
                minAmount === undefined || minDurationDays === undefined || poolParamsAreLoading
              }
            >
              Pool Settings
            </Button>

            {/* Pool Params Dialog */}
            <CreatorPoolParamsDialog
              isOpen={paramsDialogIsOpen}
              onClose={paramsDialogOnClose}
              poolAddress={poolAddress}
              minAmount={minAmount}
              minDurationDays={minDurationDays}
              refetchPoolParams={refetchPoolParams}
            />
          </>
        )}
      </>
    )

  return (
    <>
      {/* Stake */}
      <Button
        w="full"
        disabled={stakeIsLoading || unstakeIsLoading}
        onClick={stakeDialogOnOpen}
        isLoading={stakeIsLoading}
      >
        Stake
      </Button>

      {/* Unstake */}
      <Button
        w="full"
        py={'7'}
        disabled={stakeIsLoading || unstakeIsLoading || !supporterStake?.amount}
        onClick={unstake}
        isLoading={unstakeIsLoading}
      >
        <VStack spacing={'1'}>
          <Text>Unstake</Text>
          {supporterStakeIsLoading ? (
            <Spinner size={'xs'} />
          ) : (
            <Text fontSize={'xs'} opacity=".75">
              {supporterStake?.amount
                ? `${supporterStake.amount.toFixed(2)} ${contractsChain?.nativeCurrency?.symbol}`
                : 'Nothing to unstake yet'}
            </Text>
          )}
        </VStack>
      </Button>

      {/* Stake Dialog */}
      <SupporterStakeDialog isOpen={stakeDialogIsOpen} onClose={stakeDialogOnClose} stake={stake} />
    </>
  )
}
