const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployRegistry } = require("./helpers/registry");

describe("Deed transfers", function () {
  let registry, registrar, owner, buyer, stranger;

  beforeEach(async function () {
    ({ registry, registrar, owner, buyer, stranger } = await deployRegistry());
    const docHash = ethers.id("test deed for plot 17");
    await registry.connect(registrar).registerDeed(17, owner.address, docHash);
  });

  it("keeps the seller as owner until the buyer accepts", async function () {
    await expect(registry.connect(owner).proposeTransfer(17, buyer.address))
      .to.emit(registry, "TransferProposed").withArgs(17, owner.address, buyer.address);
    const deed = await registry.getDeed(17);
    expect(deed.owner).to.equal(owner.address);
    expect(deed.pendingBuyer).to.equal(buyer.address);
  });

  it("rejects a proposal from someone other than the owner", async function () {
    await expect(registry.connect(stranger).proposeTransfer(17, buyer.address))
      .to.be.revertedWithCustomError(registry, "NotPlotOwner");
  });

  it("rejects a second pending sale and preserves the first buyer", async function () {
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await expect(registry.connect(owner).proposeTransfer(17, stranger.address))
      .to.be.revertedWithCustomError(registry, "SalePending").withArgs(17);
    expect((await registry.getDeed(17)).pendingBuyer).to.equal(buyer.address);
  });

  it("rejects a zero buyer address", async function () {
    await expect(registry.connect(owner).proposeTransfer(17, ethers.ZeroAddress))
      .to.be.revertedWithCustomError(registry, "InvalidBuyer");
  });

  it("rejects a seller naming themselves as buyer", async function () {
    await expect(registry.connect(owner).proposeTransfer(17, owner.address))
      .to.be.revertedWithCustomError(registry, "InvalidBuyer");
  });

  it("rejects the seller attempting to accept", async function () {
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await expect(registry.connect(owner).acceptTransfer(17))
      .to.be.revertedWithCustomError(registry, "NotPendingBuyer");
  });

  it("rejects an unrelated account attempting to accept", async function () {
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await expect(registry.connect(stranger).acceptTransfer(17))
      .to.be.revertedWithCustomError(registry, "NotPendingBuyer");
  });

  it("transfers to the buyer and clears the proposal", async function () {
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await expect(registry.connect(buyer).acceptTransfer(17))
      .to.emit(registry, "TransferCompleted").withArgs(17, owner.address, buyer.address);
    const deed = await registry.getDeed(17);
    expect(deed.owner).to.equal(buyer.address);
    expect(deed.pendingBuyer).to.equal(ethers.ZeroAddress);
  });

  it("rejects accepting a completed sale a second time", async function () {
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await registry.connect(buyer).acceptTransfer(17);
    await expect(registry.connect(buyer).acceptTransfer(17))
      .to.be.revertedWithCustomError(registry, "NoPendingSale").withArgs(17);
  });

  it("rejects transfer proposals for an unregistered plot", async function () {
    await expect(registry.connect(owner).proposeTransfer(99, buyer.address))
      .to.be.revertedWithCustomError(registry, "UnknownPlot").withArgs(99);
  });
});
