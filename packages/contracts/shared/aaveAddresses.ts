export const AaveAddresses: Record<
  string,
  {
    pool: string
    wETHGateway: string
    nativeAToken: string
    usdc: string
  }
> = {
  hardhat: {
    pool: '0x0000000000000000000000000000000000000000',
    wETHGateway: '0x0000000000000000000000000000000000000000',
    nativeAToken: '0x0000000000000000000000000000000000000000',
    usdc: '0x0000000000000000000000000000000000000000',
  },
  // Goerli
  goerli: {
    pool: '0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6',
    wETHGateway: '0xd5B55D3Ed89FDa19124ceB5baB620328287b915d',
    nativeAToken: '0x27B4692C93959048833f40702b22FE3578E77759',
    usdc: '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',
  },
  // Polygon Mumbai
  mumbai: {
    pool: '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B',
    wETHGateway: '0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17',
    nativeAToken: '0x89a6AE840b3F8f489418933A220315eeA36d11fF',
    usdc: '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2',
  },
  // Arbitrum Rinkeby
  // arbrinkeby: {
  //   pool: '0x9C55a3C34de5fd46004Fa44a55490108f7cE388F',
  //   wETHGateway: '0xF1C72f4e230289970d60046915c79c4A7A94aae5',
  //   nativeAToken: '0xD7a3657B2B395a166cD068269B4a3f42Fd2ef5D8',
  // },
  // Optimism Kovan
  // opkovan: {
  //   pool: '0x139d8F557f70D1903787e929D7C42165c4667229',
  //   wETHGateway: '0x698851Fc324Ff9572289Dd72dfC102DB778b52f1',
  //   nativeAToken: '0xCb5Df0b49BCa05B2478a606074ec39e3fa181a6f',
  // },
  // Rinkeby
  // rinkeby: {
  //   pool: '0xE039BdF1d874d27338e09B55CB09879Dedca52D8',
  //   wETHGateway: '0xD1DECc6502cc690Bc85fAf618Da487d886E54Abe',
  //   nativeAToken: '0x608D11E704baFb68CfEB154bF7Fd641120e33aD4',
  // },
  // Kovan
  // kovan: {
  //   pool: '0x329462f8ed05E5FfBF6dfB84106e76B69e6B1F94',
  //   wETHGateway: '0x509B2506FbA1BD41765F6A82C7B0Dd4229191768',
  //   nativeAToken: '0xec6E5B3Bd3e8CC74756Af812994361d8D1EF30F8',
  // },
}
