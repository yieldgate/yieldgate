import YieldGate from '@artifacts/contracts/YieldGate.sol/YieldGate.json'
import { useYieldgateContracts } from '@lib/useYieldgateContracts'
import { BigNumber, ethers, getDefaultProvider } from 'ethers'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { YieldGate as YieldGateType } from 'types/typechain'
import { rpcsByChainId } from './wagmiClient'

/**
 * Returns total staked amount for given beneficiary address
 */
export const useTotalAmountStaked = ({ beneficiary }: { beneficiary: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useYieldgateContracts()
  const [totalAmountsStaked, setTotalAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: string) => {
    if (!beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contracts.YieldGate,
      YieldGate.abi,
      getDefaultProvider(rpcsByChainId[parseInt(chainId)])
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.staked(beneficiary)
    } catch (e) {
      // do nothing
    }
    setTotalAmountsStaked((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [beneficiary, contractsChainId])

  return {
    isLoading,
    totalAmountsStaked,
    totalAmountStaked: totalAmountsStaked[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
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
  const [supporterAmountsStaked, setSupporterAmountsStaked] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: string) => {
    if (!supporter || !beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contracts.YieldGate,
      YieldGate.abi,
      getDefaultProvider(rpcsByChainId[parseInt(chainId)])
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.supporterStaked(supporter, beneficiary)
    } catch (e) {
      // do nothing
    }
    setSupporterAmountsStaked((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatEther(value) || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [supporter, beneficiary, contractsChainId])

  return {
    isLoading,
    supporterAmountsStaked,
    supporterAmountStaked: supporterAmountsStaked[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}

/**
 * Returns total claimable amount for given creator address
 */
export const useClaimableAmount = ({ beneficiary }: { beneficiary?: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { contractsChain, contractsChainId, contracts } = useYieldgateContracts()
  const [claimableAmounts, setClaimableAmounts] = useState<{
    [key: string]: number
  }>({})

  const refetch = async (chainId: string) => {
    if (!beneficiary) return
    setIsLoading(true)
    const contract = new ethers.Contract(
      contracts.YieldGate,
      YieldGate.abi,
      getDefaultProvider(rpcsByChainId[parseInt(chainId)])
    ) as YieldGateType
    let value = BigNumber.from(0)
    try {
      value = await contract.claimable(beneficiary)
    } catch (e) {
      // do nothing
    }
    setClaimableAmounts((prev) => ({
      ...prev,
      [chainId]: parseFloat(formatUnits(value, 'finney') || '0.0'),
    }))
    setIsLoading(false)
  }
  useEffect(() => {
    refetch(contractsChainId)
  }, [beneficiary, contractsChainId])

  return {
    isLoading,
    claimableAmounts,
    claimableAmount: claimableAmounts[contractsChainId],
    contractChain: contractsChain,
    contractChainId: contractsChainId,
    refetch: async () => {
      refetch(contractsChainId)
    },
  }
}
