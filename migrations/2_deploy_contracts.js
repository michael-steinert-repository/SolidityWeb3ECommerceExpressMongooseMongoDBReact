const MockDaiToken = artifacts.require("MockDaiToken");
const PaymentProcessor = artifacts.require("PaymentProcessor");

module.exports = async function (deployer, network, accounts) {
  /* Destructuring the first two Accounts from the Test Network to Variables */
  const [admin, payer] = accounts;

  if(network === "develop") {
    /* First sending a Transaction the Test Network */
    await deployer.deploy(MockDaiToken);
    /* Second waiting until the Transaction is mined from the Test Network */
    const mockDaiToken = await MockDaiToken.deployed();
    /* Creating some Coins for Test Purposes */
    await mockDaiToken.faucet(payer, web3.utils.toWei("42", "Ether"));

    /* Sending a Transaction the Test Network */
    /* Passing the Arguments for the Constructor */
    await deployer.deploy(PaymentProcessor, admin, mockDaiToken.address);
  }
};
