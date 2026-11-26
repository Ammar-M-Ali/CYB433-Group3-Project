const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployRegistry } = require("./helpers/registry");

describe("Real estate workflow", function () {
  it("preserves the deed hash through a sale and removes the old owner's powers", async function () {
    const { registry, registrar, owner, buyer, stranger } = await deployRegistry();
    const hash = ethers.id("fictional deed 17");
    await registry.connect(registrar).registerDeed(17, owner.address, hash);
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await registry.connect(buyer).acceptTransfer(17);
    const deed = await registry.getDeed(17);
    expect(deed.docHash).to.equal(hash);
    expect(deed.owner).to.equal(buyer.address);
    await expect(registry.connect(owner).proposeTransfer(17, stranger.address))
      .to.be.revertedWithCustomError(registry, "NotPlotOwner");
  });

  it("allows another plot to transfer during a dispute", async function () {
    const { registry, registrar, officer, owner, buyer } = await deployRegistry();
    await registry.connect(registrar).registerDeed(17, owner.address, ethers.id("deed 17"));
    await registry.connect(registrar).registerDeed(18, owner.address, ethers.id("deed 18"));
    await registry.connect(officer).freezeDeed(17);
    await registry.connect(owner).proposeTransfer(18, buyer.address);
    await registry.connect(buyer).acceptTransfer(18);
    expect((await registry.getDeed(17)).frozen).to.equal(true);
    expect((await registry.getDeed(17)).owner).to.equal(owner.address);
    expect((await registry.getDeed(18)).owner).to.equal(buyer.address);
  });

  it("permits a new sale after the officer resolves the dispute", async function () {
    const { registry, registrar, officer, owner, buyer, stranger } = await deployRegistry();
    await registry.connect(registrar).registerDeed(17, owner.address, ethers.id("deed 17"));
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await registry.connect(officer).freezeDeed(17);
    await registry.connect(officer).unfreezeDeed(17);
    await registry.connect(owner).proposeTransfer(17, stranger.address);
    await expect(registry.connect(buyer).acceptTransfer(17))
      .to.be.revertedWithCustomError(registry, "NotPendingBuyer");
    await registry.connect(stranger).acceptTransfer(17);
    expect((await registry.getDeed(17)).owner).to.equal(stranger.address);
  });
});
