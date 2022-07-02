import '@nomiclabs/hardhat-ethers'
import hre, { ethers } from 'hardhat'
import { AaveAddresses } from '../shared/aaveAddresses'
import { saveFrontendAddressFiles } from '../shared/saveFrontendAddressFiles'

async function main() {
  const aave = AaveAddresses[hre.network.name]
  if (aave === undefined) {
    throw new Error(`No Aave addresses for network ${hre.network.name}`)
  }

  const YieldGate = await ethers.getContractFactory('YieldGate')
  const yieldGateContract = await YieldGate.deploy(aave.pool, aave.wETHGateway, aave.nativeAToken)
  console.log('YieldGate deployment transaction: ', yieldGateContract.deployTransaction.hash)
  await yieldGateContract.deployed()
  console.log('YieldGate deployed to:', yieldGateContract.address)

  saveFrontendAddressFiles({
    YieldGate: yieldGateContract.address,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
