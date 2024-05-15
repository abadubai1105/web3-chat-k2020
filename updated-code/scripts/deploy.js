const hre = require("hardhat");
const fs = require('fs');
const { error } = require("console");

async function main() {
  const ChatApp = await hre.ethers.getContractFactory("ChatApp");
  const chatApp = await ChatApp.deploy();

  await chatApp.deployed();

  console.log(` Contract Address: ${chatApp.address}`);
  let data = chatApp.address

  fs.writeFileSync('contract-address.txt', data, 'utf-8',(error) => {
    if (error) {
      throw error;
    }
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
