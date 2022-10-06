import { Button, Spinner, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import { SupporterStake } from '@lib/creatorReadHooks'
import { useDeployments } from '@lib/useDeployments'
import { BeneficiaryPool__factory, YieldGate__factory } from '@yieldgate/contracts/typechain-types'
import { ClaimedEvent } from '@yieldgate/contracts/typechain-types/contracts/YieldGate.sol/BeneficiaryPool'
import dayjs from 'dayjs'
import { ethers, Event } from 'ethers'
import { FC, useEffect, useState } from 'react'
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
  const [stakeIsLocked, setStakeIsLocked] = useState<boolean>()
  const [stakeLockedUntilFormatted, setStakeLockedUntilFormatted] = useState<string>()

  // Determine whether stake is locked and until when
  useEffect(() => {
    if (!supporterStake?.lockTimeout) {
      setStakeIsLocked(false)
      setStakeLockedUntilFormatted('')
      return
    }
    const lockedUntil = dayjs.unix(supporterStake?.lockTimeout)
    const isLocked = dayjs().isBefore(lockedUntil)
    setStakeIsLocked(isLocked)
    setStakeLockedUntilFormatted(isLocked ? lockedUntil.format('YYYY/MM/DD h:mm A') : '')
  }, [supporterStake?.lockTimeout])

  // Reset confetti when account changes
  useEffect(() => {
    setShowConfetti(false)
  }, [address, creator?.address])

  // Deploy Pool
  const deploy = async () => {
    await refetchSigner()
    if (!signer || !contracts) return
    setDeployIsLoading(true)

    // Blockchain Transaction
    try {
      const contract = YieldGate__factory.connect(contracts.YieldGate.address, signer)
      const transaction = await contract.deployPool(creator.address, {
        gasLimit: 150000,
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
      toast({
        title: 'Error while trying to stake. Try again.',
        status: 'error',
      })
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
      toast({
        title: 'Error while trying to unstake. Try again.',
        status: 'error',
      })
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
      toast({
        title: 'Error while trying to claim. Try again.',
        status: 'error',
      })
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
        disabled={stakeIsLoading || unstakeIsLoading || poolParamsAreLoading}
        onClick={stakeDialogOnOpen}
        isLoading={stakeIsLoading}
        colorScheme="whatsapp"
      >
        Stake
      </Button>

      {/* Unstake */}
      <Button
        w="full"
        py={'7'}
        disabled={stakeIsLoading || unstakeIsLoading || !supporterStake?.amount || stakeIsLocked}
        onClick={unstake}
        isLoading={unstakeIsLoading}
      >
        <VStack spacing={'1'}>
          <Text>
            {supporterStake?.amount
              ? `Unstake ${supporterStake?.amount} ${contractsChain?.nativeCurrency?.symbol}`
              : 'Unstake'}
          </Text>
          {supporterStakeIsLoading ? (
            <Spinner size={'xs'} />
          ) : (
            stakeIsLocked && (
              <Text fontSize={'xs'} opacity=".75">
                Locked until {stakeLockedUntilFormatted}
              </Text>
            )
          )}
        </VStack>
      </Button>

      {/* Stake Dialog */}
      <SupporterStakeDialog
        isOpen={stakeDialogIsOpen}
        onClose={stakeDialogOnClose}
        stake={stake}
        minAmount={minAmount}
        minDurationDays={minDurationDays}
        supporterStake={supporterStake}
      />
    </>
  )
}
