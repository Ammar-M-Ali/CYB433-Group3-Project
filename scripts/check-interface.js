const assert = require("node:assert/strict");
const { artifacts, ethers } = require("hardhat");

async function main() {
  const artifact = await artifacts.readArtifact("RealEstateDeedRegistry");
  const abi = new ethers.Interface(artifact.abi);
  assert.deepEqual(abi.deploy.inputs.map(x => x.type), ["address", "address"]);

  const names = [
    "registerDeed(uint256,address,bytes32)", "getDeed(uint256)",
    "proposeTransfer(uint256,address)", "acceptTransfer(uint256)",
    "freezeDeed(uint256)", "unfreezeDeed(uint256)"
  ];
  for (const name of names) {
    assert.ok(abi.hasFunction(name), "Missing: " + name);
  }
  const outputs = abi.getFunction("getDeed").outputs;
  const fields = outputs.length === 1 && outputs[0].baseType === "tuple"
    ? outputs[0].components : outputs;
  for (const [name, type] of Object.entries({
    owner: "address", docHash: "bytes32", pendingBuyer: "address", frozen: "bool"
  })) {
    assert.ok(fields.some(f => f.name === name && f.type === type), name);
  }
  console.log("Shared signatures and deed fields match.");
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
