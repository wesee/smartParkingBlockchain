pragma solidity ^0.4.24;

import "./ParkingArea.sol";
import "./Migrations.sol";


contract SmartParking is Migrations{
    ParkingArea[] private parkingArea;

    function addParkingArea(uint8 _price, string _address) public restricted{
        parkingArea[parkingArea.length] = new ParkingArea(parkingArea.length, _price, _address);
    } 

    function getAllParkingArea() public view returns (ParkingArea[]){
        return parkingArea;
    }

    function isOwner() public view returns (bool){
        return owner == msg.sender;
    }

}

