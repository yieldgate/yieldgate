import YieldGate from '@artifacts/contracts/YieldGate.sol/YieldGate.json'
import { Button } from '@chakra-ui/react'
import Layout from '@components/layout/Layout'
import { ContractAddresses_1337 } from 'artifacts/addresses/1337'
import { ethers } from 'ethers'
import { useState } from 'react'
import { YieldGate as YieldGateType } from 'types/typechain'
import useAsyncEffect from 'use-async-effect'
import { useProvider, useSigner } from 'wagmi'

export default function TestPage() {
  const [{ data, error, loading }, getSigner] = useSigner()
  const provider = useProvider()


  //       const signer = library.getSigner()
  //       const contract = new ethers.Contract(
  //         CONTRACT_ADDRESS,
  //         YourContract.abi,
  //         signer
  //       ) as YourContractType
  //       const transaction = await contract.setGreeting(state.inputValue)
  //       await transaction.wait()

  // const contract = useContract({
  //   addressOrName: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  //   contractInterface: YieldGate,
  //   signerOrProvider: data,
  // })

  const [poolAddress, setPoolAddress] = useState('')
  useAsyncEffect(async () => {
    const signer = await getSigner()
    if (!provider) return
    const contract = new ethers.Contract(
      ContractAddresses_1337.YieldGate,
      YieldGate.abi,
      provider
    ) as YieldGateType
    console.log({contract})
    const beneficiaryPool = await contract.beneficiaryPools('0xfbfdab35e38c496993e858a2ae3e8b304f58a80a')
    console.log({beneficiaryPool})
  }, [provider])

  const testContract = async () => {
    const signer = await getSigner()
    const contract = new ethers.Contract(
      ContractAddresses_1337.YieldGate,
      YieldGate.abi,
      signer
    ) as YieldGateType
    const transaction = await contract.getOrDeployPool('0xfbfdab35e38c496993e858a2ae3e8b304f58a80a')
    const receipt = await transaction.wait()
    console.log('receipt:', receipt)
  }

  return <>
    <Layout>
      <Button onClick={testContract}>getOrDeployPool</Button>
    </Layout>
  </>
}
