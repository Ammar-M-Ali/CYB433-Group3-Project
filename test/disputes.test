const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployRegistry } = require("./helpers/registry");

describe("Deed disputes", function () {
  let registry, registrar, officer, owner, buyer, stranger;

  beforeEach(async function () {
    ({ registry, registrar, officer, owner, buyer, stranger } =
      await deployRegistry());
    await registry.connect(registrar).registerDeed(
      17, owner.address, ethers.id("fictional deed 17")
    );
  });

  it("lets the officer freeze and unfreeze a deed", async function () {
    await expect(registry.connect(officer).freezeDeed(17))
      .to.emit(registry, "DeedFrozen").withArgs(17, ethers.ZeroAddress);
    expect((await registry.getDeed(17)).frozen).to.equal(true);
    await expect(registry.connect(officer).unfreezeDeed(17))
      .to.emit(registry, "DeedUnfrozen").withArgs(17);
    expect((await registry.getDeed(17)).frozen).to.equal(false);
  });

  it("rejects freezing by an unrelated account", async function () {
    await expect(registry.connect(stranger).freezeDeed(17))
      .to.be.revertedWithCustomError(registry, "NotDisputeOfficer");
  });

  it("rejects unfreezing by the registrar", async function () {
    await registry.connect(officer).freezeDeed(17);
    await expect(registry.connect(registrar).unfreezeDeed(17))
      .to.be.revertedWithCustomError(registry, "NotDisputeOfficer");
  });

  it("rejects freezing a deed that is already frozen", async function () {
    await registry.connect(officer).freezeDeed(17);
    await expect(registry.connect(officer).freezeDeed(17))
      .to.be.revertedWithCustomError(registry, "FrozenDeed").withArgs(17);
  });

  it("rejects unfreezing a deed that is already active", async function () {
    await expect(registry.connect(officer).unfreezeDeed(17))
      .to.be.revertedWithCustomError(registry, "NotFrozen").withArgs(17);
  });

  it("rejects a transfer proposal while frozen", async function () {
    await registry.connect(officer).freezeDeed(17);
    await expect(registry.connect(owner).proposeTransfer(17, buyer.address))
      .to.be.revertedWithCustomError(registry, "FrozenDeed").withArgs(17);
  });

  it("cancels a pending sale on freeze and blocks acceptance", async function () {
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await expect(registry.connect(officer).freezeDeed(17))
      .to.emit(registry, "DeedFrozen").withArgs(17, buyer.address);
    await expect(registry.connect(buyer).acceptTransfer(17))
      .to.be.revertedWithCustomError(registry, "FrozenDeed").withArgs(17);
    const deed = await registry.getDeed(17);
    expect(deed.pendingBuyer).to.equal(ethers.ZeroAddress);
    expect(deed.owner).to.equal(owner.address);
  });

  it("keeps the cancelled sale unavailable after unfreezing", async function () {
    await registry.connect(owner).proposeTransfer(17, buyer.address);
    await registry.connect(officer).freezeDeed(17);
    await registry.connect(officer).unfreezeDeed(17);
    await expect(registry.connect(buyer).acceptTransfer(17))
      .to.be.revertedWithCustomError(registry, "NoPendingSale").withArgs(17);
  });
});
