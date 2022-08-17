/* eslint-disable */
// Disabling linting of this file since the test is just a placeholder and we
// need to change the test setup anyway
// https://hardhat.org/hardhat-runner/docs/guides/migrating-from-hardhat-waffle
const { expect } = require('chai')

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory('Greeter')
    const greeter = await Greeter.deploy('Hello, world!')

    await greeter.deployed()
    expect(await greeter.greet()).to.equal('Hello, world!')

    await greeter.setGreeting('Hola, mundo!')
    expect(await greeter.greet()).to.equal('Hola, mundo!')
  })
})
