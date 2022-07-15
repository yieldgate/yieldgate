import YieldGate from '@artifacts/contracts/YieldGate.sol/YieldGate.json'
import { Provider } from '@ethersproject/providers'
import { useYieldgateContracts } from '@lib/useYieldgateContracts'
import { BigNumber, ethers } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { YieldGate as YieldGateType } from 'types/typechain'
import useAsyncEffect from 'use-async-effect'
import { useProvider } from 'wagmi'

/**
 * Returns total staked amount for given beneficiary address
 */
const fetchTotalAmountStaked = async (
  contractAddress: string,
  provider: Provider,
  beneficiary: string
) => {
  let value = BigNumber.from(0)
  try {
    value = (await contract.staked(beneficiary)) || BigNumber.from(0)
  } catch (e) {
    // do nothing
  }
  return value
}

export const useTotalAmountStaked = ({ beneficiary }: { beneficiary: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useYieldgateContracts()
  const provider = useProvider({ chainId: parseInt(contractsChainId) })
  const [totalAmountsStaked, setTotalAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  useAsyncEffect(async () => {
    setIsLoading(true)
    const contract = new ethers.Contract(
      contracts.YieldGate,
      YieldGate.abi,
      provider
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = (await contract.staked(beneficiary)) || BigNumber.from(0)
    } catch (e) {
      /* do nothing */
    }
    setTotalAmountsStaked((prev) => ({
      ...prev,
      [contractsChainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }, [beneficiary, contractsChainId])

  return {
    isLoading,
    totalAmountsStaked,
    totalAmountStaked: totalAmountsStaked[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      console.log('ishere')
      setIsLoading(true)
      const value = await fetchTotalAmountStaked(contracts.YieldGate, provider, beneficiary)
      setTotalAmountsStaked((prev) => ({
        ...prev,
        [contractsChainId]: parseFloat(formatEther(value) || '0.0'),
      }))
      setIsLoading(false)
    },
  }
}

/**
 * Returns total staked amount for given creator address
 */
export const useSupporterAmountStaked = ({
  supporter,
  beneficiary,
}: {
  supporter?: string
  beneficiary?: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useYieldgateContracts()
  const provider = useProvider({ chainId: parseInt(contractsChainId) })
  const [supporterAmountsStaked, setSupporterAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  const refetch = async () => {
    if (!supporter || !beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contracts.YieldGate,
      YieldGate.abi,
      provider
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.supporterStaked(supporter, beneficiary)
    } catch (e) {
      // do nothing
    }
    setSupporterAmountsStaked((prev) => ({
      ...prev,
      [contractsChainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch()
  }, [supporter, beneficiary, provider])

  return {
    isLoading,
    supporterAmountsStaked,
    supporterAmountStaked: supporterAmountsStaked[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch()
    },
  }
}

/**
 * Returns total claimable amount for given creator address
 */
export const useClaimableAmount = ({ beneficiary }: { beneficiary?: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useYieldgateContracts()
  const provider = useProvider({ chainId: parseInt(contractsChainId) })
  const [claimableAmounts, setClaimableAmounts] = useState<{
    [key: string]: number
  }>({})

  const refetch = async () => {
    if (!beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contracts.YieldGate,
      YieldGate.abi,
      provider
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.claimable(beneficiary)
    } catch (e) {
      // do nothing
    }
    setClaimableAmounts((prev) => ({
      ...prev,
      [contractsChainId]: parseFloat(formatUnits(value, 'finney') || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch()
  }, [beneficiary, provider])

  return {
    isLoading,
    claimableAmounts,
    claimableAmount: claimableAmounts[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch()
    },
  }
}
