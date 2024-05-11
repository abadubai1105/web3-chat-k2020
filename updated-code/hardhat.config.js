require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const { PRIVATE_KEY } = process.env;

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
//   networks: {
//       url: `http://localhost:8545`,
//       accounts: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
//   },
// };

const { SEPOLIA_PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
    networks: {
    //   hardhat: {
    //    // Localhost with default Hardhat network settings
    //  },
     localhost: {
        url: "http://localhost:9545", // URL of your local chain
        accounts: [process.env.PRIVATE_KEY], // Private key for local deployment
     },
     localhost2: {
      url: "http://localhost:8545", // URL of your local chain
      accounts: [process.env.PRIVATE_KEY], // Private key for local deployment
   },
   },
};