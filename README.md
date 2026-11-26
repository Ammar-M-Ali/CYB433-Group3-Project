# CYB433 – Group 3: Real Estate Deed Registry

## Project Overview

A blockchain-based Real Estate Deed Registry developed using Solidity and deployed on the Ethereum Sepolia test network. The system provides secure property registration, ownership verification, two-party ownership transfers, and dispute management through smart contracts.

## Group Members and Contributions

| Name | Academic ID | Contribution |
|---|---|---|
| Ammar Ali | 4420692 | Property deed registration, public deed verification, registrar authorization, input validation, registration tests, and shared test helper. |
| Amer Alqurashi | 4401105 | Two-party ownership transfer, transfer proposal and acceptance, owner and buyer authorization, transfer restrictions, and transfer tests. |
| Mohammad Kaki | 4400307 | Dispute management, property freezing and unfreezing, pending transfer cancellation, dispute tests, and initial Slither security analysis. |
| Yasir Alraddadi | 4400671 | Workflow testing, interface compatibility checks, gas optimization, before-and-after gas measurements, final Slither security analysis, code coverage, Sepolia deployment, Etherscan verification, and live transaction demonstration. |

## Main Features

- Property deed registration by an authorized registrar.
- Public verification of property ownership and document hashes.
- Two-party ownership transfers requiring seller and buyer approval.
- Property freezing and unfreezing by an authorized dispute officer.
- Role-based access control.
- Gas optimization through Solidity storage packing.
- Automated testing and static security analysis.

## Technologies Used

- Solidity 0.8.24
- Hardhat
- Ethers.js
- Node.js
- Mocha and Chai
- Slither
- MetaMask
- Alchemy
- Ethereum Sepolia
- Etherscan

## Smart Contract Functions

| Function | Description | Authorized Role |
|---|---|---|
| `registerDeed` | Registers a new property deed | Registrar |
| `getDeed` | Retrieves property information | Public |
| `proposeTransfer` | Proposes an ownership transfer | Property Owner |
| `acceptTransfer` | Accepts a proposed transfer | Pending Buyer |
| `freezeDeed` | Freezes a property and cancels pending transfers | Dispute Officer |
| `unfreezeDeed` | Removes the frozen status | Dispute Officer |

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/Ammar-M-Ali/CYB433-Group3-Project.git
cd CYB433-Group3-Project
npm install
```

Compile the smart contract:

```bash
npx hardhat compile
```

## Testing

Run the complete automated test suite:

```bash
npm test
```

The test suite covers registration, ownership transfers, dispute controls, access control, invalid operations, and the complete property transfer workflow.

Run code coverage:

```bash
npm run coverage
```

Run gas reporting:

```bash
REPORT_GAS=true npx hardhat test
```

## Security Analysis

Slither was used to perform static security analysis before and after optimization.

The security audit logs are available in:

- `audit/slither-initial.txt`
- `audit/slither-final.txt`

The contract implements authorization checks, input validation, duplicate registration prevention, and restrictions on transfers involving frozen properties.

## Gas Optimization

The contract was optimized by packing the `owner` and `frozen` fields into the same Solidity storage slot.

Gas consumption was measured before and after optimization using the same test suite and compiler settings.

The gas measurement logs are available in:

- `gas/gas-before.txt`
- `gas/gas-after.txt`

## Environment Configuration

Copy the environment template:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```dotenv
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
```

The `.env` file must remain private and must never be committed to the repository.

Configure the public Registrar and Dispute Officer addresses in `scripts/deploy-input.json`, respectively.

## Deployment

- **Network:** Ethereum Sepolia Testnet
- **Contract:** RealEstateDeedRegistry
- **Contract address:** `0x42493d360C7551a9F36afb3664e9e6aBD3A87F74`
- **Verified source:** [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x42493d360C7551a9F36afb3664e9e6aBD3A87F74#code)
- **Public repository:** [GitHub Repository](https://github.com/Ammar-M-Ali/CYB433-Group3-Project)

Local deployment:

```bash
npx hardhat run scripts/deploy.js
```

Sepolia deployment:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Contract verification:

```bash
npx hardhat verify --network sepolia --constructor-args scripts/verify-args.js 0x42493d360C7551a9F36afb3664e9e6aBD3A87F74
```

## Write Transactions

The following transactions demonstrate the property registration and ownership transfer workflow on Sepolia.

| Action | Sepolia Transaction |
|---|---|
| Register Deed | [View Transaction](https://sepolia.etherscan.io/tx/0x3f033e8b5cb06a542ada8c4d6dd28b060932382edd1ef00397f68eb2964cd405) |
| Propose Transfer | [View Transaction](https://sepolia.etherscan.io/tx/0x280f9e341c3ebf08c2068c75ec329ab5807dff1e931aeef872e09c59a42ea0a0) |
| Accept Transfer | [View Transaction](https://sepolia.etherscan.io/tx/0xab474d3dcb395f64742c13b7345c36d2dd8611f962090598e655d9b93dd17596) |

## Privacy and Limitations

The smart contract stores property identifiers, wallet addresses, document hashes, transfer information, and dispute status. Original property documents and personal information remain off-chain.

The system is an educational prototype deployed on a test network. It does not establish legally recognized property ownership or process real financial payments.

## AI Usage Disclosure

AI tools were used to assist with drafting, troubleshooting technical issues, and providing relevant sources and references. AI-generated suggestions and code were reviewed and tested by the group members

## Academic Information

- **University:** Taibah University
- **Course:** CYB433
- **Group:** 3
- **Project:** Real Estate Deed Registry
