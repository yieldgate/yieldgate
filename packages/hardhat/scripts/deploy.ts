import fs from "fs";
import hre, { config, ethers } from "hardhat";
import path from "path";

async function main() {
  const YourContract = await ethers.getContractFactory("YourContract");
  const yourContract = await YourContract.deploy("Hello, Hardhat!");
  await yourContract.deployed();
  console.log("YourContract deployed to:", yourContract.address);

  const MulticallContract = await ethers.getContractFactory("Multicall");
  const multicallContract = await MulticallContract.deploy();
  await multicallContract.deployed();
  console.log("Multicall deployed to:", multicallContract.address);

  saveFrontendAddressFiles({
    YourContract: yourContract.address,
    MulticallContract: multicallContract.address,
  });
}

/**
 * Helper function to store contract addresses in .ts file
 */
function saveFrontendAddressFiles(contracts: any) {
  // Create adresses/ directory
  const addressesDir = path.join(config.paths.artifacts, `addresses`);
  fs.mkdirSync(addressesDir, { recursive: true });
  // Lowercase all addresses
  for (let contractKey of Object.keys(contracts)) {
    contracts[contractKey] = contracts[contractKey].toLowerCase();
  }
  // Create {chainId}.ts
  const addressesFilePath = path.join(
    addressesDir,
    `${hre.network.config.chainId}.ts`
  );
  const addressesFileContents = `export const ContractAddresses_${
    hre.network.config.chainId
  } = ${JSON.stringify(contracts, null, 2)}`;
  fs.writeFileSync(addressesFilePath, addressesFileContents);
  // Create index.ts
  const chainIds = fs
    .readdirSync(addressesDir)
    .filter((name) => name?.endsWith(".ts") && name !== "index.ts")
    .map((name) => name?.replace(".ts", ""));
  let indexFileContents = chainIds.reduce(
    (acc, val) => acc + `import { ContractAddresses_${val} } from './${val}'\n`,
    ""
  );
  indexFileContents += `export const ContractAddresses = {`;
  indexFileContents += `${chainIds.reduce(
    (acc, val) => acc + `'${val}': ContractAddresses_${val}\n`,
    ""
  )}}`;
  const indexFilePath = path.join(addressesDir, "index.ts");
  fs.writeFileSync(indexFilePath, indexFileContents);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
