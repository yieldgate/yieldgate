import { Heading, Spinner, VStack } from '@chakra-ui/react'
import { Confetti } from '@components/Confetti'
import { Creator } from '@entities/Creator.entity'
import {
  useClaimableAmount,
  usePoolAddress,
  usePoolParams,
  useSupporterAmountStaked,
  useTotalAmountStaked,
} from '@lib/creatorReadHooks'
import { useDeployments } from '@lib/useDeployments'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { CreatorCardActions } from './CreatorCardActions'
import { CreatorCardDetails } from './CreatorCardDetails'
import { CreatorCardNumbers } from './CreatorCardNumbers'

export interface CreatorCardProps {
  creator: Creator
  isOwner: boolean
  updateContentIsLocked: () => void
}
export const CreatorCard: FC<CreatorCardProps> = ({ creator, isOwner, updateContentIsLocked }) => {
  const { contractsChain } = useDeployments()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const {
    totalAmountStaked,
    isLoading: totalAmountStakedIsLoading,
    refetch: refetchTotalAmountStaked,
  } = useTotalAmountStaked({ beneficiary: creator.address })
  const {
    supporterAmountStaked,
    isLoading: supporterAmountsIsLoading,
    refetch: refetchSupporterAmountStaked,
  } = useSupporterAmountStaked({
    supporter: address,
    beneficiary: creator.address,
  })
  const {
    claimableAmount,
    isLoading: claimableAmountsIsLoading,
    refetch: refetchClaimableAmounts,
  } = useClaimableAmount({ beneficiary: creator.address })
  const {
    poolAddress,
    refetch: refetchPoolAddress,
    isLoading: poolAddressIsLoading,
  } = usePoolAddress({
    beneficiary: creator.address,
  })
  const {
    minAmount,
    minDurationDays,
    refetch: refetchPoolParams,
    isLoading: poolParamsAreLoading,
  } = usePoolParams({ poolAddress })
  const [showConfetti, setShowConfetti] = useState(false)

  // No Creator
  if (!creator) return null

  // No Pool Address yet
  if (poolAddressIsLoading)
    return (
      <>
        <VStack spacing={8} borderRadius="md" border="1px" p={5}>
          <CreatorCardDetails creator={creator} />
          <Heading>
            <Spinner />
          </Heading>
        </VStack>
      </>
    )

  return (
    <>
      <VStack spacing={8} borderRadius="md" border="1px" p={5}>
        <CreatorCardDetails creator={creator} />

        <VStack w="full">
          {address && chain && !chain.unsupported ? (
            <CreatorCardActions
              creator={creator}
              isOwner={isOwner}
              updateContentIsLocked={updateContentIsLocked}
              setShowConfetti={setShowConfetti}
              supporterAmountStaked={supporterAmountStaked}
              supporterAmountsIsLoading={supporterAmountsIsLoading}
              refetchSupporterAmountStaked={refetchSupporterAmountStaked}
              refetchTotalAmountStaked={refetchTotalAmountStaked}
              claimableAmount={claimableAmount}
              claimableAmountsIsLoading={claimableAmountsIsLoading}
              refetchClaimableAmounts={refetchClaimableAmounts}
              poolAddress={poolAddress}
              refetchPoolAddress={refetchPoolAddress}
              minAmount={minAmount}
              minDurationDays={minDurationDays}
              refetchPoolParams={refetchPoolParams}
              poolParamsAreLoading={poolParamsAreLoading}
            />
          ) : (
            <ConnectButton />
          )}
        </VStack>

        {contractsChain && poolAddress && (
          <CreatorCardNumbers
            creator={creator}
            totalAmountStaked={totalAmountStaked}
            totalAmountStakedIsLoading={totalAmountStakedIsLoading}
            contractsChain={contractsChain}
            minAmount={minAmount}
            minDurationDays={minDurationDays}
            poolParamsAreLoading={poolParamsAreLoading}
          />
        )}
      </VStack>

      {/* Confetti after claim */}
      {showConfetti && <Confetti />}
    </>
  )
}
