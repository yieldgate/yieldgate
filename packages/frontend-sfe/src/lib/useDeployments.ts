import { AddressesType, getAddressesFor } from '@deployments/addresses'
import { deployments } from '@deployments/deployments'
import { useState } from 'react'
import { HardhatExportContracts } from 'src/types/hardhat'
import { useAsyncEffect } from 'use-async-effect'
import { Chain, useNetwork } from 'wagmi'
import { defaultChain } from './wagmiClient'

export const useDeployments = () => {
  const { chain } = useNetwork()
  const [useDefaultChain, setUseDefaultChain] = useState<boolean>()
  const [usedChain, setUsedChain] = useState<Chain>()
  const [usedChainId, setUsedChainId] = useState<number>()
  const [contracts, setContracts] = useState<HardhatExportContracts>()
  const [addresses, setAddresses] = useState<AddressesType>()

  useAsyncEffect(async () => {
    const contractsChain = !chain || chain.unsupported ? defaultChain : chain
    if (contractsChain) {
      const contracts = (await deployments[contractsChain.id]).contracts
      setUseDefaultChain(useDefaultChain)
      setUsedChain(contractsChain)
      setUsedChainId(contractsChain.id)
      setContracts(contracts)
      setAddresses(getAddressesFor(contractsChain.id))
    } else {
      setUseDefaultChain(undefined)
      setUsedChain(undefined)
      setUsedChainId(undefined)
      setContracts(undefined)
      setAddresses(undefined)
    }
  }, [chain])

  return {
    useDefaultChain,
    usedChain,
    usedChainId,
    contracts,
    addresses,
  }
}
