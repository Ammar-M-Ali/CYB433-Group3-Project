const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployRegistry } = require("./helpers/registry");

describe("Registration", function () {
  let registry, registrar, officer, owner, buyer, stranger;
  const hash = ethers.id("fictional deed 17");

  beforeEach(async function () {
    ({ registry, registrar, officer, owner, buyer, stranger } =
      await deployRegistry());
  });

  it("assigns both administrative roles", async function () {
    expect(await registry.registrar()).to.equal(registrar.address);
    expect(await registry.disputeOfficer()).to.equal(officer.address);
    await expect(registry.deploymentTransaction()).to.emit(registry, "RolesAssigned")
      .withArgs(registrar.address, officer.address);
  });

  it("rejects a zero or repeated role address", async function () {
    const factory = await ethers.getContractFactory("RealEstateDeedRegistry");
    for (const [first, second] of [
      [ethers.ZeroAddress, officer.address],
      [registrar.address, ethers.ZeroAddress],
      [registrar.address, registrar.address],
    ]) {
      await expect(factory.deploy(first, second))
        .to.be.revertedWithCustomError(registry, "InvalidRoles");
    }
  });

  it("registers a new deed and lets the public verify it", async function () {
    await expect(registry.connect(registrar).registerDeed(17, owner.address, hash))
      .to.emit(registry, "DeedRegistered").withArgs(17, owner.address, hash);

    const deed = await registry.connect(stranger).getDeed(17);
    expect(deed.owner).to.equal(owner.address);
    expect(deed.docHash).to.equal(hash);
    expect(deed.pendingBuyer).to.equal(ethers.ZeroAddress);
    expect(deed.frozen).to.equal(false);
  });

  it("rejects registration by an unrelated account", async function () {
    await expect(registry.connect(stranger).registerDeed(17, owner.address, hash))
      .to.be.revertedWithCustomError(registry, "NotRegistrar");
  });

  it("rejects a duplicate plot and preserves its owner", async function () {
    await registry.connect(registrar).registerDeed(17, owner.address, hash);
    await expect(registry.connect(registrar).registerDeed(17, buyer.address, hash))
      .to.be.revertedWithCustomError(registry, "PlotAlreadyRegistered").withArgs(17);
    expect((await registry.getDeed(17)).owner).to.equal(owner.address);
  });

  it("rejects a zero plot ID", async function () {
    await expect(registry.connect(registrar).registerDeed(0, owner.address, hash))
      .to.be.revertedWithCustomError(registry, "InvalidPlotId");
  });

  it("rejects an owner with the zero address", async function () {
    await expect(registry.connect(registrar).registerDeed(17, ethers.ZeroAddress, hash))
      .to.be.revertedWithCustomError(registry, "ZeroOwner");
  });

  it("rejects an empty document hash", async function () {
    await expect(registry.connect(registrar).registerDeed(17, owner.address, ethers.ZeroHash))
      .to.be.revertedWithCustomError(registry, "EmptyDocumentHash");
  });

  it("rejects a lookup for an unregistered plot", async function () {
    await expect(registry.getDeed(99))
      .to.be.revertedWithCustomError(registry, "UnknownPlot").withArgs(99);
  });
});
