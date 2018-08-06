pragma solidity ^0.4.24;

import "./ParkingArea.sol";
import "./Migrations.sol";


contract SmartParking is Migrations{
    ParkingArea[] private parkingArea;

    function getParkingAreaCount() public view returns (uint){
        return parkingArea.length;
    }

    function addParkingArea(uint8 _price, string _address, uint numberOfSpot) public {
        parkingArea.push(new ParkingArea(parkingArea.length, _price, _address, numberOfSpot));
    } 

    function getParkingArea(uint index) public view returns (ParkingArea){
        return parkingArea[index];
    }

    function getAllParkingArea() public view returns (ParkingArea[]){
        return parkingArea;
    }

    function isOwner() public view returns (bool){
        return owner == msg.sender;
    }
}

