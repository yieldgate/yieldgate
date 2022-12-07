import { useDeployments } from '@lib/useDeployments'
import { ToucanOffsetter__factory } from '@yieldgate/contracts/typechain-types'
import {
  OffsetEvent,
  ToucanOffsetter,
} from '@yieldgate/contracts/typechain-types/contracts/ToucanOffsetter.sol/ToucanOffsetter'
import { BigNumber } from 'ethers'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useProvider } from 'wagmi'

export type OffsetEventsProviderContextType = {
  isLoading?: boolean
  isError?: boolean
  offsetEvents?: OffsetEvent[]
  accumulatedUSDCYield?: BigNumber
  accumulatedTCO2Offset?: BigNumber
}
export const OffsetEventsProviderContext = createContext<OffsetEventsProviderContextType>({})

export const useOffsetEvents = () => {
  return useContext(OffsetEventsProviderContext)
}

export const OffsetEventsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { contracts, usedChainId, addresses } = useDeployments()
  const provider = useProvider({ chainId: usedChainId })

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [offsetEvents, setOffsetEvents] = useState<OffsetEvent[]>()
  const [accumulatedUSDCYield, setAccumulatedUSDCYield] = useState<BigNumber>()
  const [accumulatedTCO2Offset, setAccumulatedTCO2Offset] = useState<BigNumber>()

  // Accumulate yield & offset
  const accumulateYieldAndOffset = (
    contract: ToucanOffsetter | undefined,
    events: OffsetEvent[]
  ) => {
    if (!contract || !events?.length) {
      setAccumulatedUSDCYield(undefined)
      setAccumulatedTCO2Offset(undefined)
      return
    }

    let accYield = BigNumber.from(0)
    let accOffset = BigNumber.from(0)
    events.forEach((event) => {
      const args = contract.interface.parseLog(event).args

      const yieldVal: BigNumber = args?.[1]
      if (yieldVal && BigNumber.isBigNumber(yieldVal)) {
        accYield = accYield.add(yieldVal)
      }

      const offsetVal: BigNumber = args?.[3]
      if (offsetVal && BigNumber.isBigNumber(offsetVal)) {
        accOffset = accOffset.add(offsetVal)
      }
    })

    setAccumulatedUSDCYield(accYield)
    setAccumulatedTCO2Offset(accOffset)
  }

  // Fetch OffsetEvents
  const fetchEvents = async () => {
    const offsetterAddress = contracts?.ToucanOffsetter?.address
    const usdcAddress = addresses?.USDC
    const nctAddress = addresses?.NCT
    if (!offsetterAddress || !usdcAddress || !nctAddress || !provider) return

    setIsLoading(true)
    setIsError(false)
    let contract: ToucanOffsetter
    try {
      contract = ToucanOffsetter__factory.connect(offsetterAddress, provider)
      const filter = contract.filters.Offset(usdcAddress, null, nctAddress, null)
      const events = await contract.queryFilter(filter, 29521695, 'latest')
      setOffsetEvents(events)
      accumulateYieldAndOffset(contract, events)
    } catch (e) {
      console.error('Error while fetching offset events:', e)
      setIsError(true)
      setOffsetEvents(undefined)
      accumulateYieldAndOffset(undefined, [])
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchEvents()
  }, [usedChainId])

  return (
    <OffsetEventsProviderContext.Provider
      value={{
        isLoading,
        isError,
        offsetEvents,
        accumulatedUSDCYield,
        accumulatedTCO2Offset,
      }}
    >
      {children}
    </OffsetEventsProviderContext.Provider>
  )
}
