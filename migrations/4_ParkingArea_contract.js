var ParkingArea = artifacts.require("./ParkingArea.sol");

module.exports = function(deployer) {
  deployer.deploy(ParkingArea,0,0,"",0);
};
