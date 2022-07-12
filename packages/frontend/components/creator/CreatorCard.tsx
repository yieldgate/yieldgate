import { Divider, VStack } from '@chakra-ui/react'
import { ChainSwitchMenu } from '@components/ChainSwitchMenu'
import { Confetti } from '@components/Confetti'
import { Creator } from '@entities/Creator.entity'
import {
  useClaimableAmount,
  useSupporterAmountStaked,
  useTotalAmountStaked,
} from '@lib/creatorReadHooks'
import { useYieldgateContracts } from '@lib/useYieldgateContracts'
import { FC, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import ConnectWalletButton from '../ConnectWalletButton'
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

  if (!creator) return <></>

  return (
    <>
      <VStack spacing={8} borderRadius="md" border="1px" p={5}>
        <CreatorCardDetails creator={creator} />

        <Divider />
        <VStack w="full">
          {address ? (
            chain?.unsupported ? (
              <ChainSwitchMenu />
            ) : (
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
            )
          ) : (
            <ConnectWalletButton />
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
