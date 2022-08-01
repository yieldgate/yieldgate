import { Divider, VStack } from '@chakra-ui/react'
import { Confetti } from '@components/Confetti'
import { Creator } from '@entities/Creator.entity'
import {
  useClaimableAmount,
  useSupporterAmountStaked,
  useTotalAmountStaked,
} from '@lib/creatorReadHooks'
import { useYieldgateContracts } from '@lib/useYieldgateContracts'
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
  const { contractsChain } = useYieldgateContracts()
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
  const [showConfetti, setShowConfetti] = useState(false)

  if (!creator) return null

  return (
    <>
      <VStack spacing={8} borderRadius="md" border="1px" p={5}>
        <CreatorCardDetails creator={creator} />

        <Divider />
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
            />
          ) : (
            <ConnectButton />
          )}
        </VStack>

        <CreatorCardNumbers
          creator={creator}
          totalAmountStaked={totalAmountStaked}
          totalAmountStakedIsLoading={totalAmountStakedIsLoading}
          contractChain={contractsChain}
        />
      </VStack>

      {/* Confetti after claim */}
      {showConfetti && <Confetti />}
    </>
  )
}
