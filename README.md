# Yieldgate

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://yieldgate.mit-license.org/)
[![codecov](https://codecov.io/gh/yieldgate/yieldgate/branch/develop/graph/badge.svg?token=Y1BVBCAJK5)](https://codecov.io/gh/yieldgate/yieldgate)(Contracts)

Yieldgate is a protocol that allows anyone to start earning and building products with programmable yield.

Built with ❤️ on top of Aave, Polygon, and others.

![Yieldate](https://i.imgur.com/j316O86.png "Yieldgate")

---

## Getting Started

```bash
# Install (or update) pnpm
npm i -g pnpm

# Install project dependencies
pnpm install

# Copy & fill environments
cp packages/frontend-sfe/.env.local.example packages/frontend-sfe/.env.local && nano packages/frontend-sfe/.env.local
cp packages/frontend-yg/.env.local.example packages/frontend-yg/.env.local && nano packages/frontend-yg/.env.local
cp packages/contracts/.env.example packages/contracts/.env && nano packages/contracts/.env

# Generate types, artifacts & start frontend
pnpm run dev-yg
# … or only start frontend if types are generated previously
pnpm run dev:frontend-yg

# Start local hardhat network & deploy contracts
pnpm run deploy:contracts
```

## Stack

Based on [nextjs-ethereum-starter](https://github.com/ChangoMan/nextjs-ethereum-starter).

- [Typescript](https://www.typescriptlang.org/)
- [Hardhat](https://hardhat.org/)
- [TypeChain](https://github.com/ethereum-ts/TypeChain)
- [Wagmi.sh](https://wagmi.sh/)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Chakra UI](https://chakra-ui.com/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)
