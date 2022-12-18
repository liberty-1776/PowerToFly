// https://eth-goerli.g.alchemy.com/v2/SlCl9_v5Qz7YfxEanvN4GXzBe8WOSbpF

require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/SlCl9_v5Qz7YfxEanvN4GXzBe8WOSbpF",
      accounts: ["6768b52c8cbd26df03b4378e149c076f4cad61e3334f2ca8abebdd0ab9a9083f"]
    }
  }
};
