import fs from "fs";
import hre, { config, ethers } from "hardhat";
import path from "path";

async function main() {
  const YieldGate = await ethers.getContractFactory("YieldGate");
  const yieldGateContract = await YieldGate.deploy(
    "0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B", // pool
    "0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17", // wETHGateway
    "0x89a6AE840b3F8f489418933A220315eeA36d11fF" // native aToken
  );
  console.log(
    "deployment transaction",
    yieldGateContract.deployTransaction.hash
  );
  await yieldGateContract.deployed();
  console.log("YieldGate deployed to:", yieldGateContract.address);

  saveFrontendAddressFiles({
    YieldGate: yieldGateContract.address,
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
    (acc, val) => acc + `'${val}': ContractAddresses_${val},\n`,
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
