require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.15",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: 'enable rate same bicycle author enable door baby gown wrist alien bracket'
      }
    }/*,
    mumbai: {
      url: "",
      accounts: [ 'key' ],
      gasPrice: 800000000
    },
    polygon: {
      url: "",
      accounts: [ 'key' ],
      gasPrice: 800000000
    },
    avalanche: {
      url: "",
      accounts: [ 'key' ],
      gasPrice: 2600000000
    }*/
  }

};
