var ERC721Impl = artifacts.require("ERC721Impl");

module.exports = function(deployer) { 
    deployer.deploy(ERC721Impl);
};