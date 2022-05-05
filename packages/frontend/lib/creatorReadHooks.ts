import YieldGate from '@artifacts/contracts/YieldGate.sol/YieldGate.json'
import { useYieldgateContract } from '@lib/useYieldgateContract'
import { getProvider } from '@wagmi/core'
import { BigNumber, ethers } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { YieldGate as YieldGateType } from 'types/typechain'

/**
 * Returns total staked amount for given beneficiary address
 */
export const useTotalAmountStaked = ({
  beneficiary,
}: {
  beneficiary: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractChain, contractChainId, contractAddresses } =
    useYieldgateContract()
  const [totalAmountsStaked, setTotalAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: string) => {
    if (!beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contractAddresses.YieldGate,
      YieldGate.abi,
      getProvider({ chainId: parseInt(chainId) })
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.staked(beneficiary)
    } catch (e) {}
    setTotalAmountsStaked((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractChainId)
  }, [beneficiary, contractChainId])

  return {
    isLoading,
    totalAmountsStaked,
    totalAmountStaked: totalAmountsStaked[contractChainId],
    contractChain,
    contractChainId,
    refetch: async () => {
      refetch(contractChainId)
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
  const { contractChain, contractChainId, contractAddresses } =
    useYieldgateContract()
  const [supporterAmountsStaked, setSupporterAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: string) => {
    if (!supporter || !beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contractAddresses.YieldGate,
      YieldGate.abi,
      getProvider({ chainId: parseInt(chainId) })
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.supporterStaked(supporter, beneficiary)
    } catch (e) {}
    setSupporterAmountsStaked((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractChainId)
  }, [supporter, beneficiary, contractChainId])

  return {
    isLoading,
    supporterAmountsStaked,
    supporterAmountStaked: supporterAmountsStaked[contractChainId],
    contractChain,
    contractChainId,
    refetch: async () => {
      refetch(contractChainId)
    },
  }
}

/**
 * Returns total claimable amount for given creator address
 */
export const useClaimableAmount = ({
  beneficiary,
}: {
  beneficiary?: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractChain, contractChainId, contractAddresses } =
    useYieldgateContract()
  const [claimableAmounts, setClaimableAmounts] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: string) => {
    if (!beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contractAddresses.YieldGate,
      YieldGate.abi,
      getProvider({ chainId: parseInt(chainId) })
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.claimable(beneficiary)
    } catch (e) {}
    setClaimableAmounts((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatUnits(value, 'finney') || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractChainId)
  }, [beneficiary, contractChainId])

  return {
    isLoading,
    claimableAmounts,
    claimableAmount: claimableAmounts[contractChainId],
    contractChain,
    contractChainId,
    refetch: async () => {
      refetch(contractChainId)
    },
  }
}
