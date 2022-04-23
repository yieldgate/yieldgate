import { ContractAddresses } from '@artifacts/addresses'
import YieldGate from '@artifacts/contracts/YieldGate.sol/YieldGate.json'
import { Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { Creator } from '@entities/Creator.entity'
import { ethers } from 'ethers'
import { FC, useState } from 'react'
import { YieldGate as YieldGateType } from 'types/typechain'
import { useAccount, useSigner } from 'wagmi'
import { BlockiesAvatar } from './BlockiesAvatar'
import ConnectWalletButton from './ConnectWalletButton'

export interface CreatorCardProps {
  creator: Creator
}
export const CreatorCard: FC<CreatorCardProps> = ({creator}) => {
  const [{ data, error, loading }, getSigner] = useSigner()
  const [{ data: accountData }, disconnect] = useAccount()
  const YieldGateContractAddress = ContractAddresses['80001'].YieldGate
  const [stakeIsLoading, setStakeIsLoading] = useState(false)
  const [unstakeIsLoading, setUnstakeIsLoading] = useState(false)

  // const readBeneficaryPools = async () => {
  //   const provider = ethers.getDefaultProvider(env.rpc.hardhat)
  //   const contract = new ethers.Contract(
  //     ContractAddresses_80001.YieldGate,
  //     YieldGate.abi,
  //     provider
  //   ) as YieldGateType
  //   const beneficiaryPool = await contract.beneficiaryPools('0xfbfdab35e38c496993e858a2ae3e8b304f58a80a')
  //   console.log({beneficiaryPool})
  // }


  const stake = async () => {
    const signer = await getSigner()
    if (!signer) return
    setStakeIsLoading(true)
    const contract = new ethers.Contract(
      YieldGateContractAddress,
      YieldGate.abi,
      signer
    ) as YieldGateType
    const beneficiary = accountData?.address
    const transaction = await contract.stake(beneficiary, {
      value: ethers.utils.parseEther('0.1'),
      gasLimit: 2000000,
    })
    console.log({transaction})
    const receipt = await transaction.wait()
    console.log({receipt})
    setStakeIsLoading(false)
  }

  const unstake = async () => {
    const signer = await getSigner()
    if (!signer) return
    setUnstakeIsLoading(true)
    const contract = new ethers.Contract(
      YieldGateContractAddress,
      YieldGate.abi,
      signer
    ) as YieldGateType
    const beneficiary = accountData?.address
    const transaction = await contract.unstake(beneficiary)
    console.log({transaction})
    const receipt = await transaction.wait()
    console.log({receipt})
    setUnstakeIsLoading(false)
  }

  if (!creator) return <></>

  return <>
    <VStack p={8} spacing={8} borderRadius="md">
      <BlockiesAvatar
        address={creator?.address}
        borderRadius="full"
        width="200px"
        height="200px"
      />
      <Heading textAlign={'center'}>{creator.displayName || creator.address}</Heading>
      <VStack w='full'>
        {accountData
          ? <>
            <Button w="full" disabled={stakeIsLoading} onClick={stake} isDisabled={stakeIsLoading} isLoading={stakeIsLoading}>
                  Stake
            </Button>
            <Button w="full" disabled={stakeIsLoading} onClick={unstake} isDisabled={unstakeIsLoading} isLoading={stakeIsLoading}>
                  Unstake
            </Button>
          </>
          : <ConnectWalletButton />}
      </VStack>
      <HStack spacing={8} mx={8}>
        <Flex direction="column" align="center">
          <Heading>{creator?.supportersCount}</Heading>
          <Text>Supporters</Text>
        </Flex>
        {/* <Flex direction="column" align="center">
                <Heading>{creator.supportersCount}</Heading>
                <Text>ETH staked</Text>
              </Flex> */}
        <Flex direction="column" align="center">
          <Heading>{creator?.postsCount}</Heading>
          <Text>Posts</Text>
        </Flex>
      </HStack>
      <Text>{creator?.description}</Text>
    </VStack>

  </>
}