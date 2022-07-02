import { exec } from 'child_process'
import fs from 'fs'
import hre, { config } from 'hardhat'
import path from 'path'

/**
 * Helper function to store contract addresses in .ts files
 */
export const saveFrontendAddressFiles = async (contracts: any, doPrettify: boolean = true) => {
  // Create adresses/ directory
  const addressesDir = path.join(config.paths.artifacts, `../addresses`)
  fs.mkdirSync(addressesDir, { recursive: true })

  // Lowercase all addresses
  for (let contractKey of Object.keys(contracts)) {
    contracts[contractKey] = contracts[contractKey].toLowerCase()
  }

  // Create {chainId}.ts
  const addressesFilePath = path.join(addressesDir, `${hre.network.config.chainId}.ts`)
  const addressesFileContents = `export const ContractAddresses_${
    hre.network.config.chainId
  } = ${JSON.stringify(contracts, null, 2)}`
  fs.writeFileSync(addressesFilePath, addressesFileContents)

  // Create index.ts
  const chainIds = fs
    .readdirSync(addressesDir)
    .filter((name) => name?.endsWith('.ts') && name !== 'index.ts')
    .map((name) => name?.replace('.ts', ''))
  chainIds.sort()
  let indexFileContents = chainIds.reduce(
    (acc, val) => acc + `import { ContractAddresses_${val} } from './${val}'\n`,
    ''
  )
  indexFileContents += `export const ContractAddresses = {`
  indexFileContents += `${chainIds.reduce(
    (acc, val) => acc + `'${val}': ContractAddresses_${val},\n`,
    ''
  )}}`
  const indexFilePath = path.join(addressesDir, 'index.ts')
  fs.writeFileSync(indexFilePath, indexFileContents)

  // Prettify all generated files
  if (doPrettify) {
    await exec(`npx prettier --write ${addressesDir}`)
  }
}
