const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployRegistry } = require("./helpers/registry");

describe("Deed transfers", function () {
  it("keeps the seller as owner until the buyer accepts", async function () {
    const { registry, registrar, owner, buyer } = await deployRegistry();

    // Give plot 17 to the seller.
    const docHash = ethers.id("test deed for plot 17");
    await registry.connect(registrar).registerDeed(17, owner.address, docHash);

    // The seller names a buyer.
    await registry.connect(owner).proposeTransfer(17, buyer.address);

    // A proposal alone must leave ownership unchanged.
    const deed = await registry.getDeed(17);
    expect(deed.owner).to.equal(owner.address);
    expect(deed.pendingBuyer).to.equal(buyer.address);
  });
});