# diener-mint-app

Personal NFT mint site with Express backend, MySQL data layer,
Solidity smart contracts and IPFS storage.

## Context

Built for CRCP 6340 (Creative Coding for Application Development),
SMU Meadows School of the Arts, Summer 2026.
Instructor: Brittni Watkins. Course developer: Dave Smith.

## Stack

- Node.js / Express / EJS
- MySQL (DigitalOcean managed)
- Bootstrap
- Solidity 0.8.28 / OpenZeppelin v5 / Hardhat
- Polygon Amoy testnet (chain ID 80002)
- IPFS via Pinata for decentralized asset storage
- DigitalOcean for production deployment

## Repository Layout

```
/                   Express web app (live site)
/src                Server, views, database and mailer utilities
/public             Static assets and client JS
/blockchain         Hardhat workspace: contract, tests, deploy scripts
```

The smart contract lives in its own workspace with its own
`package.json`. Run blockchain commands from `/blockchain`, not
the repo root.

## Smart Contract

`DienerMintNFT` is an ERC-721 assembled from the OpenZeppelin
wizard and extended by hand. It inherits ERC721, ERC721Enumerable,
ERC721URIStorage, ERC2981 (royalties), Ownable, and ReentrancyGuard.

The contract enforces:

- Exact-price public minting through a payable `mintTo` function
- A hard max supply set at deployment
- Immediate payout forwarding to the deployer address on every mint
- A 5 percent default royalty (500 basis points) via ERC-2981
- Reentrancy protection on the mint path

Custom events `MintCompleted` and `FundsDistributed` fire on each
successful mint so the front end can react to on-chain activity.

## Running the Contract Demo

From `/blockchain`:

```bash
npm install
npx hardhat compile
npx hardhat test          # 14 tests across deployment, minting,
                          # supply limits, payouts, and royalties
npm run deploy:local      # deploys to the in-process Hardhat network
```

The deploy script reads constructor parameters (mint price, max
supply, base URI, royalty recipient, royalty basis points) from
`.env`. Copy `.env.example` to `.env` and fill in values. The
private key field is for a stunt wallet only.

### Testnet Deployment (Polygon Amoy)

The Hardhat config includes an `amoy` network target backed by an
Alchemy RPC endpoint:

```bash
npm run deploy:amoy
```

Status: configured, deployment pending testnet POL funding.
<!-- After Amoy deploy, replace the line above with:
Deployed to Amoy at `0x...`
View on PolygonScan: https://amoy.polygonscan.com/address/0x...
-->

## Roadmap

The 15-week semester is structured in four phases, each closing
with a Functionality Presentation milestone.

### Phase 1: Web Application Scaffold (Modules 1-4)

- Module 1: Development environment, GitHub repository, Node.js and npm toolchain
- Module 2: Express application, EJS templating, HTML/CSS/Bootstrap integration
- Module 3: Routing, navigation, page structure
- Module 4: Contact form with server-side validation and NodeMailer email delivery

**Milestone 1 (May 26): Complete.** Working landing page with splash
screen, navigation, and a functional contact form delivering email
via NodeMailer.

### Phase 2: Data Layer and Deployment (Modules 5-9)

- Modules 5-6: MySQL database backend, schema design, query integration
- Modules 7-8: DigitalOcean deployment, custom domain configuration
- Module 9: Database-driven project cards rendered on the live site

**Milestone 2 (June 30): Complete.** Live deployed site with
MySQL-backed project listings.

### Phase 3: Smart Contract Development (Modules 10-11)

- Module 10: Solidity authoring, OpenZeppelin component integration, Hardhat testing framework
- Module 11: Deployment demonstration in the Hardhat environment; Polygon Amoy testnet deployment

**Milestone 3 (July 14): This submission.** ERC-721 contract with
full Hardhat test suite, demonstrated deploying and testing live
in the Hardhat environment.

### Phase 4: Project Manager and End-to-End Integration (Modules 12-15)

- Modules 12-13: Standalone project manager app (separate repository) for generative art bundling, deterministic randomness seeding, Pinata/IPFS pinning, and token metadata generation
- Modules 14-15: Wallet connection flow, end-to-end mint integration, full system testing

**Milestone 4 (August 11):** Fully functional NFT mint site where
visitors connect a crypto wallet and mint a token on the testnet.

## Status

Modules 1 through 10 complete. Module 11 in progress.

- Web app live on DigitalOcean with MySQL-backed project cards
- ERC-721 contract compiled, tested (14 passing tests), and deployable locally
- Amoy testnet target configured in Hardhat
- Next: Amoy deployment, then the standalone project manager app
  (Pinata pinning, deterministic randomness via seeded hash, IPFS
  metadata pipeline)
