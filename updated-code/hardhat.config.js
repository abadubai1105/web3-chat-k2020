require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

module.exports = {
  solidity: "0.8.17",
    networks: {
     localhost: {
        url: "http://localhost:9545", // URL of your local chain
        accounts: [process.env.PRIVATE_KEY], // Private key for local deployment
     },
   },
};