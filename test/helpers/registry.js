const { ethers } = require("hardhat");

async function deployRegistry() {
  const [registrar, officer, owner, buyer, stranger] =
    await ethers.getSigners();
  const registry = await ethers.deployContract("RealEstateDeedRegistry", [
    registrar.address,
    officer.address
  ]);
  await registry.waitForDeployment();
  return { registry, registrar, officer, owner, buyer, stranger };
}

module.exports = { deployRegistry };
