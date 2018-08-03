pragma solidity ^0.4.24;

import "./ParkingSpot.sol";

contract ParkingArea{

    constructor(uint _id,uint8 _price, string _address) public {
        id = _id;
        price = _price;
        addrs = _address;
    }

    function getSpotCount() public view returns (uint){
        return spot.length;
    }

    function getLastSpot() public view returns (ParkingSpot){
        ParkingSpot lastSpot;
        uint startTmp = 0;
        for(uint i=0;i<getSpotCount();i++)
            if((spot[i].getStartTime())>= startTmp){
                lastSpot = spot[i];
                startTmp = spot[i].getStartTime();
            }
        return lastSpot;
    }

    function addSpot(uint _start, uint _finish, string _plate) public{
        spot[spot.length] = new ParkingSpot(spot.length, _start, _finish, _plate);
    }

    function getAllSpot() public view returns (ParkingSpot[]){
        return spot;
    }

    uint private id;
    uint8 public price;
    ParkingSpot[] private spot;
    string public addrs;
}

