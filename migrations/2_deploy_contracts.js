var ContractSystem = artifacts.require("./ContractSystem.sol");
//var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  //deployer.deploy(Election);
  deployer.deploy(ContractSystem);
};