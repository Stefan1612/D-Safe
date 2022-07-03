const hre = require("hardhat");
const addresses = require("../src/config/contracts/map.json");

const { ethers, network } = hre;

async function addMinter(contract) {
  const role = "MINTER_ROLE";
  const { address } = (await ethers.getSigners())[1];
  const tx = await contract.grantRole(ethers.utils.id(role), address);
  await tx.wait();
  console.log(`${address} has now the role "${role}"`);
}

async function main() {
  const { chainId } = network.config;
  const contractName = "DTweetNFT";
  const deployedContractAddress = addresses[chainId][contractName];
  const ttn = await ethers.getContractAt(contractName, deployedContractAddress);
  await addMinter(ttn);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
