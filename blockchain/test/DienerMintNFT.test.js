const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const MINT_PRICE = ethers.parseEther("0.01");
const MAX_SUPPLY = 5;
const BASE_URI = "ipfs://contract-metadata-placeholder";
const ROYALTY_BPS = 500; // 5 percent expressed in basis points

describe("DienerMintNFT", function () {
  async function deployFixture() {
    const [owner, minter, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("DienerMintNFT");
    const contract = await Factory.deploy(
      MINT_PRICE,
      MAX_SUPPLY,
      BASE_URI,
      owner.address,
      ROYALTY_BPS
    );
    return { contract, owner, minter, other };
  }

  describe("Deployment", function () {
    it("sets the token name and symbol", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.name()).to.equal("DienerMintApp");
      expect(await contract.symbol()).to.equal("DMA");
    });

    it("sets the deployer as owner", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("stores the constructor parameters", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.getMintPrice()).to.equal(MINT_PRICE);
      expect(await contract.getMaxSupply()).to.equal(MAX_SUPPLY);
      expect(await contract.getBaseURI()).to.equal(BASE_URI);
      expect(await contract.contractURI()).to.equal(BASE_URI);
    });

    it("starts with zero tokens minted", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("mints token 0 to the caller when exact price is paid", async function () {
      const { contract, minter } = await loadFixture(deployFixture);
      await contract.connect(minter).mintTo("ipfs://token-0", {
        value: MINT_PRICE,
      });
      expect(await contract.ownerOf(0)).to.equal(minter.address);
      expect(await contract.tokenURI(0)).to.equal("ipfs://token-0");
    });

    it("emits MintCompleted and FundsDistributed", async function () {
      const { contract, owner, minter } = await loadFixture(deployFixture);
      await expect(
        contract.connect(minter).mintTo("ipfs://token-0", { value: MINT_PRICE })
      )
        .to.emit(contract, "MintCompleted")
        .withArgs(minter.address, 0, "ipfs://token-0")
        .and.to.emit(contract, "FundsDistributed")
        .withArgs(owner.address, MINT_PRICE);
    });

    it("forwards the mint payment to the payout address", async function () {
      const { contract, owner, minter } = await loadFixture(deployFixture);
      await expect(
        contract.connect(minter).mintTo("ipfs://token-0", { value: MINT_PRICE })
      ).to.changeEtherBalances([minter, owner], [-MINT_PRICE, MINT_PRICE]);
    });

    it("reverts when the payment is too low", async function () {
      const { contract, minter } = await loadFixture(deployFixture);
      await expect(
        contract.connect(minter).mintTo("ipfs://token-0", {
          value: ethers.parseEther("0.005"),
        })
      ).to.be.revertedWith("DienerMintNFT: send exact mint price");
    });

    it("reverts when the payment is too high", async function () {
      const { contract, minter } = await loadFixture(deployFixture);
      await expect(
        contract.connect(minter).mintTo("ipfs://token-0", {
          value: ethers.parseEther("0.02"),
        })
      ).to.be.revertedWith("DienerMintNFT: send exact mint price");
    });

    it("reverts once max supply is reached", async function () {
      const { contract, minter } = await loadFixture(deployFixture);
      for (let i = 0; i < MAX_SUPPLY; i++) {
        await contract
          .connect(minter)
          .mintTo(`ipfs://token-${i}`, { value: MINT_PRICE });
      }
      await expect(
        contract.connect(minter).mintTo("ipfs://token-overflow", {
          value: MINT_PRICE,
        })
      ).to.be.revertedWith("DienerMintNFT: max supply reached");
    });
  });

  describe("Enumeration", function () {
    it("tracks total supply as tokens are minted", async function () {
      const { contract, minter, other } = await loadFixture(deployFixture);
      await contract
        .connect(minter)
        .mintTo("ipfs://token-0", { value: MINT_PRICE });
      await contract
        .connect(other)
        .mintTo("ipfs://token-1", { value: MINT_PRICE });
      expect(await contract.totalSupply()).to.equal(2);
      expect(await contract.tokenOfOwnerByIndex(minter.address, 0)).to.equal(0);
      expect(await contract.tokenOfOwnerByIndex(other.address, 0)).to.equal(1);
    });
  });

  describe("Royalties", function () {
    it("reports ERC-2981 royalty info for a sale", async function () {
      const { contract, owner, minter } = await loadFixture(deployFixture);
      await contract
        .connect(minter)
        .mintTo("ipfs://token-0", { value: MINT_PRICE });
      const salePrice = ethers.parseEther("1");
      const [receiver, amount] = await contract.royaltyInfo(0, salePrice);
      expect(receiver).to.equal(owner.address);
      expect(amount).to.equal(ethers.parseEther("0.05"));
    });
  });
});
