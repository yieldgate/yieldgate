import { getProvider } from '@wagmi/core'
import { useState } from 'react'
import useAsyncEffect from 'use-async-effect'

export const useEnsDomain = ({ address }: { address?: string }) => {
  const [ensDomain, setEnsDomain] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useAsyncEffect(async () => {
    if (!address) {
      setEnsDomain('')
      return
    }
    setIsLoading(true)
    const provider = getProvider({ chainId: 1 })
    const ens = await provider.lookupAddress(address)
    setEnsDomain(ens || '')
    setIsLoading(false)
  }, [address])

  return { ensDomain, isLoading }
}
