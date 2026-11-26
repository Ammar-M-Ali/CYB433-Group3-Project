require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: SEPOLIA_RPC_URL ? {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  } : {},
  etherscan: { apiKey: ETHERSCAN_API_KEY || "" },
  gasReporter: { enabled: process.env.REPORT_GAS === "true" }
};
