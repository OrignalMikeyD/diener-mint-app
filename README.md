# diener-mint-app

Personal NFT mint site with Express backend, MySQL data layer, 
Solidity smart contracts and IPFS storage.

## Context

Built for CRCP 6340 (Creative Coding for Application Development), 
SMU Meadows School of the Arts, Summer 2026.
Instructor: Brittni Watkins. Course developer: Dave Smith.

## Stack

- Node.js / Express / EJS
- MySQL
- Bootstrap
- Solidity (deployed to EVM testnet, blockchain TBD)
- IPFS for decentralized asset storage
- DigitalOcean for production deployment

## Roadmap

The 15-week semester is structured in four phases, each closing with a Functionality Presentation milestone.

### Phase 1: Web Application Scaffold (Modules 1-4)

- Module 1: Development environment, GitHub repository, Node.js and npm toolchain
- Module 2: Express application, EJS templating, HTML/CSS/Bootstrap integration
- Module 3: Routing, navigation, page structure
- Module 4: Contact form with server-side validation and NodeMailer email delivery

**Milestone 1 (May 26):** Working landing page with splash screen, navigation, and a functional contact form that delivers email via NodeMailer.

### Phase 2: Data Layer and Deployment (Modules 5-9)

- Modules 5-6: MySQL database backend, schema design, query integration
- Modules 7-8: DigitalOcean deployment, custom domain configuration
- Module 9: Database-driven project cards rendered on the live site

**Milestone 2 (June 30):** Live deployed site with MySQL-backed project listings.

### Phase 3: Smart Contract Development (Modules 10-11)

- Module 10: Solidity authoring, OpenZeppelin component integration, Hardhat testing framework
- Module 11: Smart contract deployment to an EVM testnet (Polygon, Base, Optimism, Avalanche, or Arbitrum)

**Milestone 3 (July 14):** Smart contract deployed and verified on the chosen testnet.

### Phase 4: Project Manager and End-to-End Integration (Modules 12-15)

- Modules 12-13: Project manager build, generative NFT sketch packaging, IPFS asset uploads
- Modules 14-15: Wallet connection flow, end-to-end mint integration, full system testing

**Milestone 4 (August 11):** Fully functional NFT mint site where visitors connect a crypto wallet and mint a token on the testnet.

## Status

Module 1 complete. Toolchain verified:
- Git 2.50.1 (Apple Git-155)
- Node.js v24.14.0
- npm 11.9.0