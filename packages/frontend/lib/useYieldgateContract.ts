import { ContractAddresses } from '@addresses/index'
import { defaultChain } from '@lib/wagmiClient'
import { useEffect, useState } from 'react'
import { Chain, useNetwork } from 'wagmi'

export type ContractAddressesType = keyof typeof ContractAddresses
export const useYieldgateContract = () => {
  const { activeChain } = useNetwork()
  const [useDefaultChain, setUseDefaultChain] = useState<boolean>(true)
  const [contractChain, setContractChain] = useState<Chain>(defaultChain)
  const [contractChainId, setContractChainId] = useState<ContractAddressesType>(
    defaultChain.id.toString() as ContractAddressesType
  )
  const [contractAddresses, setContractAddresses] = useState(
    ContractAddresses[contractChainId]
  )

  useEffect(() => {
    const useDefaultChain = !activeChain?.id || !!activeChain.unsupported
    const contractChain: Chain = useDefaultChain ? defaultChain : activeChain
    const contractChainId = contractChain.id.toString() as ContractAddressesType
    const contractAddresses = ContractAddresses[contractChainId]

    setUseDefaultChain(useDefaultChain)
    setContractChain(contractChain)
    setContractChainId(contractChainId)
    setContractAddresses(contractAddresses)
  }, [activeChain])

  return {
    useDefaultChain,
    contractChain,
    contractChainId,
    contractAddresses,
  }
}
