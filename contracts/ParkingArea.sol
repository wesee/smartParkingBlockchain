pragma solidity ^0.4.24;

import "./ParkingSpot.sol";

contract ParkingArea{

    constructor(uint _id,uint8 _price, string _address, uint numberOfSpot) public {
        id = _id;
        price = _price;
        addrs = _address;
        addSpot(numberOfSpot);
    }

    function getSpotCount() public view returns (uint){
        return spot.length;
    }

    function getAvitableSpotCount() public view returns (uint){
        uint spotAvitable;
        for(uint i=0; i< spot.length;i++)
            if(spot[i].isAvitable())
                spotAvitable++;
        return spotAvitable;
    }

    function getLastSpot() public view returns (ParkingSpot){
        ParkingSpot lastSpot;
        uint startTmp = 0;
        for(uint i=0;i<getSpotCount();i++)
            if((spot[i].getStartTime())>= startTmp && !spot[i].isAvitable()){
                lastSpot = spot[i];
                startTmp = spot[i].getStartTime();
            }
        return lastSpot;
    }

    function addSpot(uint number) public{
        for(uint i=0;i<number;i++)
            spot.push(new ParkingSpot(spot.length));
    }

    function getId() public view returns (uint){
        return id;
    }

    function getSpot(uint index) public view returns (ParkingSpot){
        require(index<=spot.length);
        return (spot[index]);
    }

    function getAllSpot() public view returns (ParkingSpot[]){
        return spot;
    }

    uint private id;
    uint8 public price;
    ParkingSpot[] private spot;
    string public addrs;
}

