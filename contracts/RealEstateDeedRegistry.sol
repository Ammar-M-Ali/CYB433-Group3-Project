// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract RealEstateDeedRegistry {
    struct Deed {
        address owner;
        address pendingBuyer;
        bytes32 docHash;
        bool frozen;
    }

    mapping(uint256 => Deed) private deeds;
    address public immutable registrar;
    address public immutable disputeOfficer;

    error InvalidRoles();
    error NotRegistrar();
    error UnknownPlot(uint256 plotId);
    error InvalidPlotId();
    error PlotAlreadyRegistered(uint256 plotId);
    error ZeroOwner();
    error EmptyDocumentHash();

    event RolesAssigned(address indexed registrar, address indexed disputeOfficer);
    event DeedRegistered(uint256 indexed plotId, address indexed owner, bytes32 docHash);

    constructor(address registrarAddress, address disputeOfficerAddress) {
        if (
            registrarAddress == address(0) ||
            disputeOfficerAddress == address(0) ||
            registrarAddress == disputeOfficerAddress
        ) revert InvalidRoles();

        registrar = registrarAddress;
        disputeOfficer = disputeOfficerAddress;
        emit RolesAssigned(registrarAddress, disputeOfficerAddress);
    }

    modifier onlyRegistrar() {
        if (msg.sender != registrar) revert NotRegistrar();
        _;
    }

    modifier knownPlot(uint256 plotId) {
        if (deeds[plotId].owner == address(0)) revert UnknownPlot(plotId);
        _;
    }

    function registerDeed(uint256 plotId, address owner, bytes32 docHash)
        external onlyRegistrar
    {
        if (plotId == 0) revert InvalidPlotId();
        if (owner == address(0)) revert ZeroOwner();
        if (docHash == bytes32(0)) revert EmptyDocumentHash();
        if (deeds[plotId].owner != address(0)) revert PlotAlreadyRegistered(plotId);

        Deed storage deed = deeds[plotId];
        deed.owner = owner;
        deed.docHash = docHash;
        emit DeedRegistered(plotId, owner, docHash);
    }

    function getDeed(uint256 plotId) external view knownPlot(plotId)
        returns (address owner, bytes32 docHash, address pendingBuyer, bool frozen)
    {
        Deed storage deed = deeds[plotId];
        return (deed.owner, deed.docHash, deed.pendingBuyer, deed.frozen);
    }
}
