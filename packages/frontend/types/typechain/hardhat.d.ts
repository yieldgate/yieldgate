/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IAaveIncentivesController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAaveIncentivesController__factory>;
    getContractFactory(
      name: "IAToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAToken__factory>;
    getContractFactory(
      name: "IInitializableAToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IInitializableAToken__factory>;
    getContractFactory(
      name: "IPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPool__factory>;
    getContractFactory(
      name: "IPoolAddressesProvider",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPoolAddressesProvider__factory>;
    getContractFactory(
      name: "IScaledBalanceToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IScaledBalanceToken__factory>;
    getContractFactory(
      name: "IWETHGateway",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWETHGateway__factory>;
    getContractFactory(
      name: "BeneficiaryPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BeneficiaryPool__factory>;
    getContractFactory(
      name: "YieldGate",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.YieldGate__factory>;

    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IAaveIncentivesController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAaveIncentivesController>;
    getContractAt(
      name: "IAToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAToken>;
    getContractAt(
      name: "IInitializableAToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IInitializableAToken>;
    getContractAt(
      name: "IPool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPool>;
    getContractAt(
      name: "IPoolAddressesProvider",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPoolAddressesProvider>;
    getContractAt(
      name: "IScaledBalanceToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IScaledBalanceToken>;
    getContractAt(
      name: "IWETHGateway",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWETHGateway>;
    getContractAt(
      name: "BeneficiaryPool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BeneficiaryPool>;
    getContractAt(
      name: "YieldGate",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.YieldGate>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
