import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";
import path from "path";
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.10",
  paths: {
    artifacts: path.resolve("../frontend/artifacts"),
  },
  networks: {
    localhost: {
      chainId: 1337,
      url: "http://127.0.0.1:8545",
    },
    mumbai: {
      chainId: 80001,
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`${process.env.PRIVATE_KEY_MUMBAI}`],
    },
  },
  typechain: {
    outDir: "../frontend/types/typechain",
  },
};

export default config;
