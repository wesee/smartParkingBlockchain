var ParkingSpot = artifacts.require("./ParkingSpot.sol");

module.exports = function(deployer) {
  deployer.deploy(ParkingSpot,0);
};
