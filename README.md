# Yieldgateth

Based on [nextjs-ethereum-starter](https://github.com/ChangoMan/nextjs-ethereum-starter).

Very Cool project!

---

Stack:

- [Typescript](https://www.typescriptlang.org/)
- [Hardhat](https://hardhat.org/)
- [TypeChain](https://github.com/ethereum-ts/TypeChain)
- [Ethers.js](https://docs.ethers.io/v5/)
- [useDApp](https://usedapp.io/)
- [Chakra UI](https://chakra-ui.com/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, typechecking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)

## Getting Started

```bash
# Insatll Yarn (Classic)

# Install Dependencies
yarn install

# Copy & fill environments
cp packages/frontend/.env.local.example packages/frontend/.env.local && nano packages/frontend/.env.local
cp packages/hardhat/.env.example packages/hardhat/.env && nano packages/hardhat/.env

# NOTE: The following commands all have to be done in different terminals (in parallel)
# 1. Start up the Hardhat Network
yarn chain
# 2. Deploy the contracts
yarn deploy
# 3. Run the NextJs frontend
yarn deploy
```
