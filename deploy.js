const { ethers, network } = require("hardhat");
const { contractName, constructorArgs } = require("./deploy-input.json");

async function main() {
  if (!contractName) {
    throw new Error("Set the Solidity contract name in scripts/deploy-input.json first.");
  }
  if (!["hardhat", "localhost", "sepolia"].includes(network.name)) {
    throw new Error("Choose a local Hardhat network or Sepolia.");
  }
  if (network.name === "sepolia" && !process.env.PRIVATE_KEY) {
    throw new Error("Set the course wallet PRIVATE_KEY in your local .env file.");
  }

  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy(...constructorArgs);
  const tx = contract.deploymentTransaction();
  await contract.waitForDeployment();
  console.log("Network:", network.name);
  console.log("Contract:", contractName);
  console.log("Address:", await contract.getAddress());
  console.log("Deployment transaction:", tx.hash);
}

main().catch((error) => {
  console.error(error.shortMessage || error.reason || "Deployment failed. Check compilation, constructor arguments, network and wallet balance.");
  process.exitCode = 1;
});
