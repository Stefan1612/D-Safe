const hre = require("hardhat");
const addresses = require("../src/config/contracts/map.json");

const { ethers, network } = hre;

async function flipSaleState(contract) {
  const tx = await contract.flipSaleState();
  await tx.wait();

  return contract.saleIsActive();
}

async function main() {
  const { chainId } = network.config;
  const contractName = "DTweetNFT";
  const deployedContractAddress = addresses[chainId][contractName];
  const ttn = await ethers.getContractAt(contractName, deployedContractAddress);
  const isActive = await flipSaleState(ttn);
  console.log(
    `Contract ${deployedContractAddress} is now: ${
      isActive ? "active" : "paused"
    }`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
