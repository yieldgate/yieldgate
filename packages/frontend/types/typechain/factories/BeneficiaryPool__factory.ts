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
    inputs: [
      {
        internalType: "address",
        name: "supporter",
        type: "address",
      },
    ],
    name: "checkStaked",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimable",
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
        name: "_wethgw",
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
    inputs: [
      {
        internalType: "address",
        name: "supporter",
        type: "address",
      },
    ],
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
    inputs: [
      {
        internalType: "address payable",
        name: "supporter",
        type: "address",
      },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611238806100206000396000f3fe60806040526004361061007b5760003560e01c80634e71d92d1161004e5780634e71d92d14610119578063647c75e214610130578063af38d7571461016d578063f2888dbb146101985761007b565b806306552ff3146100805780630b76619b146100a9578063247f8e14146100d457806326476204146100fd575b600080fd5b34801561008c57600080fd5b506100a760048036038101906100a29190610ba5565b6101c1565b005b3480156100b557600080fd5b506100be61037f565b6040516100cb9190610c25565b60405180910390f35b3480156100e057600080fd5b506100fb60048036038101906100f69190610c40565b610422565b005b61011760048036038101906101129190610c40565b6104b9565b005b34801561012557600080fd5b5061012e610627565b005b34801561013c57600080fd5b5061015760048036038101906101529190610c40565b61065c565b6040516101649190610c25565b60405180910390f35b34801561017957600080fd5b50610182610674565b60405161018f9190610c25565b60405180910390f35b3480156101a457600080fd5b506101bf60048036038101906101ba9190610cab565b610729565b005b600073ffffffffffffffffffffffffffffffffffffffff16600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610252576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161024990610d35565b60405180910390fd5b6102766040518060600160405280603881526020016111cb60389139858584610822565b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16631da24f3e306040518263ffffffff1660e01b81526004016103dc9190610d64565b602060405180830381865afa1580156103f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061041d9190610dab565b905090565b600061042c61037f565b90506000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508082146104b4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ab90610e24565b60405180910390fd5b505050565b61051b6040518060400160405280601181526020017f5374616b696e6720257320666f7220257300000000000000000000000000000081525034600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166108c4565b34600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461056a9190610e73565b92505081905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663474cf53d3460008054906101000a900473ffffffffffffffffffffffffffffffffffffffff163060006040518563ffffffff1660e01b81526004016105f293929190610f1c565b6000604051808303818588803b15801561060b57600080fd5b505af115801561061f573d6000803e3d6000fd5b505050505050565b61065a610632610674565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610963565b565b60046020528060005260406000206000915090505481565b600061067e61037f565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016106d99190610d64565b602060405180830381865afa1580156106f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061071a9190610dab565b6107249190610f53565b905090565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506107cf6040518060400160405280601381526020017f556e7374616b696e6720257320666f722025730000000000000000000000000081525082600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166108c4565b6000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061081e8183610963565b5050565b6108be8484848460405160240161083c949392919061100f565b6040516020818303038152906040527fed8f28f6000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610b19565b50505050565b61095e8383836040516024016108dc9392919061105b565b6040516020818303038152906040527fe3849f79000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610b19565b505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846040518363ffffffff1660e01b81526004016109e2929190611099565b6020604051808303816000875af1158015610a01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a2591906110fa565b610a64576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5b90611173565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166380500d2060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684846040518463ffffffff1660e01b8152600401610ae393929190611193565b600060405180830381600087803b158015610afd57600080fd5b505af1158015610b11573d6000803e3d6000fd5b505050505050565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610b7282610b47565b9050919050565b610b8281610b67565b8114610b8d57600080fd5b50565b600081359050610b9f81610b79565b92915050565b60008060008060808587031215610bbf57610bbe610b42565b5b6000610bcd87828801610b90565b9450506020610bde87828801610b90565b9350506040610bef87828801610b90565b9250506060610c0087828801610b90565b91505092959194509250565b6000819050919050565b610c1f81610c0c565b82525050565b6000602082019050610c3a6000830184610c16565b92915050565b600060208284031215610c5657610c55610b42565b5b6000610c6484828501610b90565b91505092915050565b6000610c7882610b47565b9050919050565b610c8881610c6d565b8114610c9357600080fd5b50565b600081359050610ca581610c7f565b92915050565b600060208284031215610cc157610cc0610b42565b5b6000610ccf84828501610c96565b91505092915050565b600082825260208201905092915050565b7f616c726561647920696e697469616c697a656400000000000000000000000000600082015250565b6000610d1f601383610cd8565b9150610d2a82610ce9565b602082019050919050565b60006020820190508181036000830152610d4e81610d12565b9050919050565b610d5e81610b67565b82525050565b6000602082019050610d796000830184610d55565b92915050565b610d8881610c0c565b8114610d9357600080fd5b50565b600081519050610da581610d7f565b92915050565b600060208284031215610dc157610dc0610b42565b5b6000610dcf84828501610d96565b91505092915050565b7f7374616b65206d69736d61746368000000000000000000000000000000000000600082015250565b6000610e0e600e83610cd8565b9150610e1982610dd8565b602082019050919050565b60006020820190508181036000830152610e3d81610e01565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610e7e82610c0c565b9150610e8983610c0c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610ebe57610ebd610e44565b5b828201905092915050565b6000819050919050565b600061ffff82169050919050565b6000819050919050565b6000610f06610f01610efc84610ec9565b610ee1565b610ed3565b9050919050565b610f1681610eeb565b82525050565b6000606082019050610f316000830186610d55565b610f3e6020830185610d55565b610f4b6040830184610f0d565b949350505050565b6000610f5e82610c0c565b9150610f6983610c0c565b925082821015610f7c57610f7b610e44565b5b828203905092915050565b600081519050919050565b60005b83811015610fb0578082015181840152602081019050610f95565b83811115610fbf576000848401525b50505050565b6000601f19601f8301169050919050565b6000610fe182610f87565b610feb8185610cd8565b9350610ffb818560208601610f92565b61100481610fc5565b840191505092915050565b600060808201905081810360008301526110298187610fd6565b90506110386020830186610d55565b6110456040830185610d55565b6110526060830184610d55565b95945050505050565b600060608201905081810360008301526110758186610fd6565b90506110846020830185610c16565b6110916040830184610d55565b949350505050565b60006040820190506110ae6000830185610d55565b6110bb6020830184610c16565b9392505050565b60008115159050919050565b6110d7816110c2565b81146110e257600080fd5b50565b6000815190506110f4816110ce565b92915050565b6000602082840312156111105761110f610b42565b5b600061111e848285016110e5565b91505092915050565b7f657468677720617070726f76616c206661696c65640000000000000000000000600082015250565b600061115d601583610cd8565b915061116882611127565b602082019050919050565b6000602082019050818103600083015261118c81611150565b9050919050565b60006060820190506111a86000830186610d55565b6111b56020830185610c16565b6111c26040830184610d55565b94935050505056fe4465706c6f79696e672042656e6566696369617279506f6f6c207769746820706f6f6c2025732c2077455448677720257320666f72202573a2646970667358221220bdd02d4f9883363e3373ec85321842e85657ab32b664e7f57ef4a868e8458f1464736f6c634300080a0033";

export class BeneficiaryPool__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
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
