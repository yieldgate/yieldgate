# Yieldgate

Yield Gate is a new monetisation tool for anyone to start receiving donations, or to support their favourite public goods projects, creators, and security researchers, with yield. No NFTs or tokens, just good old MATIC! Built with ❤️ on top of Aave, Polygon, and others.

![Yieldate](https://i.imgur.com/j316O86.png "Yieldgate")

---

## Getting Started

```bash
# IMPORTANT: When using Yarn there is a bug that prevents `ts-node` from
#            being installed even though it's in `./packages/hardhat/package.json`.
#            → Solution is to switch back to npm for now.

# Install Dependencies
npm install

# Copy & fill environments
cp packages/frontend/.env.local.example packages/frontend/.env.local && nano packages/frontend/.env.local
cp packages/hardhat/.env.example packages/hardhat/.env && nano packages/hardhat/.env

# Generate types, artifacts & start frontend
npm run dev

# Startup hardhat network and deploy contracts locally
# NOTE: Has to be done in different terminals
npm run chain
npm run deploy
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