require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

const {
  ETHER_SCAN_API_KEY,
  REPORT_GAS,
  PRIMARY_PRIVATE_KEY,
  COINMARKETCAP_API_KEY,
  REACT_APP_ALCHEMY_API_KEY_RINKEBY,
} = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  accounts.forEach((account) => console.log(account));
});

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 1337, // default is 31337: https://hardhat.org/metamask-issue.html
    },
    localhost: {
      // used for stand-alone hardhat network
      chainId: 1337,
    },
    rinkeby: {
      chainId: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${REACT_APP_ALCHEMY_API_KEY_RINKEBY}`,
      accounts: [PRIMARY_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: REPORT_GAS || false,
    currency: "ETH",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
};
