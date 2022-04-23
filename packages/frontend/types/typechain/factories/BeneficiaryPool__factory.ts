/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BeneficiaryPool,
  BeneficiaryPoolInterface,
} from "../BeneficiaryPool";

const _abi = [
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "earned",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stake",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "staked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "supporters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610c83806100206000396000f3fe6080604052600436106100705760003560e01c80633a4b66f11161004e5780633a4b66f1146100e05780634e71d92d146100ea578063647c75e214610101578063d6f192621461013e57610070565b80630b76619b14610075578063184b9559146100a05780632def6620146100c9575b600080fd5b34801561008157600080fd5b5061008a610169565b6040516100979190610884565b60405180910390f35b3480156100ac57600080fd5b506100c760048036038101906100c29190610902565b6101d9565b005b3480156100d557600080fd5b506100de610355565b005b6100e8610443565b005b3480156100f657600080fd5b506100ff6104fd565b005b34801561010d57600080fd5b5061012860048036038101906101239190610955565b61053e565b6040516101359190610884565b60405180910390f35b34801561014a57600080fd5b50610153610556565b6040516101609190610884565b60405180910390f35b600080600090506101d26040518060400160405280601781526020017f546f74616c207374616b656420666f722025733a202573000000000000000000815250600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836105c6565b8091505090565b600073ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461026a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610261906109df565b60405180910390fd5b61028e6040518060600160405280603a8152602001610c14603a9139848484610665565b826000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506103fb6040518060400160405280601381526020017f556e7374616b696e6720257320666f722025730000000000000000000000000081525082600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610707565b6000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b6104a56040518060400160405280601181526020017f5374616b696e6720257320666f7220257300000000000000000000000000000081525034600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610707565b34600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104f49190610a2e565b92505081905550565b61053c6040518060400160405280600f81526020017f436c61696d696e6720666f722025730000000000000000000000000000000000815250336107a6565b565b60036020528060005260406000206000915090505481565b600080600090506105bf6040518060400160405280601081526020017f4561726e65642062792025733a20257300000000000000000000000000000000815250600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836105c6565b8091505090565b6106608383836040516024016105de93929190610b1b565b6040516020818303038152906040527f07c81217000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610842565b505050565b6107018484848460405160240161067f9493929190610b59565b6040516020818303038152906040527fed8f28f6000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610842565b50505050565b6107a183838360405160240161071f93929190610ba5565b6040516020818303038152906040527fe3849f79000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610842565b505050565b61083e82826040516024016107bc929190610be3565b6040516020818303038152906040527f319af333000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610842565b5050565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b6000819050919050565b61087e8161086b565b82525050565b60006020820190506108996000830184610875565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006108cf826108a4565b9050919050565b6108df816108c4565b81146108ea57600080fd5b50565b6000813590506108fc816108d6565b92915050565b60008060006060848603121561091b5761091a61089f565b5b6000610929868287016108ed565b935050602061093a868287016108ed565b925050604061094b868287016108ed565b9150509250925092565b60006020828403121561096b5761096a61089f565b5b6000610979848285016108ed565b91505092915050565b600082825260208201905092915050565b7f616c726561647920696e697469616c697a656400000000000000000000000000600082015250565b60006109c9601383610982565b91506109d482610993565b602082019050919050565b600060208201905081810360008301526109f8816109bc565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610a398261086b565b9150610a448361086b565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610a7957610a786109ff565b5b828201905092915050565b600081519050919050565b60005b83811015610aad578082015181840152602081019050610a92565b83811115610abc576000848401525b50505050565b6000601f19601f8301169050919050565b6000610ade82610a84565b610ae88185610982565b9350610af8818560208601610a8f565b610b0181610ac2565b840191505092915050565b610b15816108c4565b82525050565b60006060820190508181036000830152610b358186610ad3565b9050610b446020830185610b0c565b610b516040830184610875565b949350505050565b60006080820190508181036000830152610b738187610ad3565b9050610b826020830186610b0c565b610b8f6040830185610b0c565b610b9c6060830184610b0c565b95945050505050565b60006060820190508181036000830152610bbf8186610ad3565b9050610bce6020830185610875565b610bdb6040830184610b0c565b949350505050565b60006040820190508181036000830152610bfd8185610ad3565b9050610c0c6020830184610b0c565b939250505056fe4465706c6f79696e672042656e6566696369617279506f6f6c207769746820706f6f6c20257320616e6420746f6b656e20257320666f72202573a264697066735822122058aa55dda24c39450ccc003ef0d1100ee880f5bf87f501e35fd087267996c84064736f6c634300080a0033";

export class BeneficiaryPool__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BeneficiaryPool> {
    return super.deploy(overrides || {}) as Promise<BeneficiaryPool>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BeneficiaryPool {
    return super.attach(address) as BeneficiaryPool;
  }
  connect(signer: Signer): BeneficiaryPool__factory {
    return super.connect(signer) as BeneficiaryPool__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BeneficiaryPoolInterface {
    return new utils.Interface(_abi) as BeneficiaryPoolInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BeneficiaryPool {
    return new Contract(address, _abi, signerOrProvider) as BeneficiaryPool;
  }
}
