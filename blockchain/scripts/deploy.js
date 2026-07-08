const { ethers, network } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();

  const mintPrice = ethers.parseEther(process.env.MINT_PRICE_POL || "0.01");
  const maxSupply = parseInt(process.env.MAX_SUPPLY || "5", 10);
  const baseURI = process.env.BASE_URI || "ipfs://contract-metadata-placeholder";
  const royaltyArtist = process.env.ROYALTY_ARTIST_ADDRESS || deployer.address;
  const royaltyBps = parseInt(process.env.ROYALTY_BASIS_POINTS || "500", 10);

  console.log("Network:        ", network.name);
  console.log("Deployer:       ", deployer.address);
  console.log(
    "Deployer balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address))
  );

  const Factory = await ethers.getContractFactory("DienerMintNFT");
  const contract = await Factory.deploy(
    mintPrice,
    maxSupply,
    baseURI,
    royaltyArtist,
    royaltyBps
  );
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\nDienerMintNFT deployed to:", address);

  if (network.name === "amoy") {
    console.log("View on Amoy PolygonScan: https://amoy.polygonscan.com/address/" + address);
    console.log("\nSave this address. The front end and Module 11 work will need it.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
