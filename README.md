# Yieldgate

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
cp packages/frontend/.env.local.example packages/frontend/.env.local && nano packages/frontend/.env.local
cp packages/hardhat/.env.example packages/hardhat/.env && nano packages/hardhat/.env

# Generate types, artifacts & start frontend
pnpm run dev
# … or only start frontend if types are generated previously
pnpm run frontend:dev

# Optional: Start local hardhat network and deploy contracts
# NOTE: Execute those in different terminals
pnpm run hardhat:chain
pnpm run hardhat:deploy
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
