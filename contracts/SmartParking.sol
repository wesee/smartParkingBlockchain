pragma solidity ^0.4.24;

import "./Migrations.sol";

contract SmartParking is Migrations{

    struct Spot{
        uint16 id;
        uint start;
        uint finish;
        address customer;
        string plate;
        bool paid;
    }

    struct ParkingArea{
        uint8 id;
        uint8 price;
        string addrs;
        uint16 spotCount;
        int24 lastSpot;
        mapping(uint16 => Spot) spot;
    }

    function getParkingAreaCount() public view returns(uint){
        return parkingArea.length;
    }

    function isReservedToMe(uint8 idParkingArea, uint16 idSpot) public view returns (bool){
        if(parkingArea[idParkingArea].spot[idSpot].customer == msg.sender && !parkingArea[idParkingArea].spot[idSpot].paid)
            return true;
        else
            return false;
    }

    function getReservation(uint8 idParkingArea, uint16 idSpot) public view returns (uint8, uint16,string,uint8,uint,uint){
        require(isReservedToMe(idParkingArea,idSpot),"different customers address in the spot");
        return (parkingArea[idParkingArea].id, parkingArea[idParkingArea].spot[idSpot].id,parkingArea[idParkingArea].addrs,parkingArea[idParkingArea].price,parkingArea[idParkingArea].spot[idSpot].start,parkingArea[idParkingArea].spot[idSpot].finish);
    }
    
    function addParkingArea(uint8 _price, string _addrs, uint16 _spotCount) public restricted{
        ParkingArea memory pa;
        parkingArea.push(pa);
        parkingArea[parkingArea.length-1].id = uint8(parkingArea.length-1);
        parkingArea[parkingArea.length-1].price = _price; 
        parkingArea[parkingArea.length-1].addrs = _addrs; 
        parkingArea[parkingArea.length-1].spotCount = _spotCount;
        parkingArea[parkingArea.length-1].lastSpot = -1;
    }

    function updateParkingArea(uint8 id, uint8 _price, string _addrs, uint16 _spotCount) public restricted{
        parkingArea[id].price = _price;
        parkingArea[id].addrs = _addrs;
        parkingArea[id].spotCount = _spotCount;
    }

    function isAvailable(uint8 idParkingArea, uint16 idSpot) public view returns (bool){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        if(now > parkingArea[idParkingArea].spot[idSpot].finish)
            return true;
        else
            return false;
    }

    function getSpotsAvitable(uint8 idParkingArea) public view returns (uint16){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        uint16 spotCount = 0;
        for(uint16 i = 0;i<parkingArea[idParkingArea].spotCount;i++)
            if(isAvailable(idParkingArea,i)){
                spotCount++;
            }
        return spotCount;
    }

    function getSpot(uint8 idParkingArea, uint16 idSpot) public view returns (uint16,uint,uint,string){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (parkingArea[idParkingArea].spot[idSpot].id,parkingArea[idParkingArea].spot[idSpot].start,parkingArea[idParkingArea].spot[idSpot].finish,parkingArea[idParkingArea].spot[idSpot].plate);
    }

    function reserveSpot(uint8 idParkingArea, uint16 idSpot, uint _start, uint _finish, string _plate) public{
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        require(isAvailable(idParkingArea,idSpot),"Spot not available");
        require(_start<_finish,"Start time greater than finish time");
        parkingArea[idParkingArea].spot[idSpot].start = _start; 
        parkingArea[idParkingArea].spot[idSpot].id = idSpot;
        parkingArea[idParkingArea].spot[idSpot].finish = _finish; 
        parkingArea[idParkingArea].spot[idSpot].plate = _plate; 
        parkingArea[idParkingArea].lastSpot = idSpot;
        parkingArea[idParkingArea].spot[idSpot].customer = msg.sender;
        parkingArea[idParkingArea].spot[idSpot].paid = false;
    }

    function getParkingArea(uint8 index) public view returns (uint8, uint16, uint16, int,uint8,string){
        require(index<parkingArea.length,"Parking Area out of bound");
        return (parkingArea[index].id,parkingArea[index].spotCount,getSpotsAvitable(index),parkingArea[index].lastSpot,parkingArea[index].price,parkingArea[index].addrs);
    }
    
    function isOwner() public view returns (bool){
        return owner == msg.sender;
    }

    function paySpot(uint8 idParkingArea, uint16 idSpot) public payable{
        uint8 hour = uint8((((parkingArea[idParkingArea].spot[idSpot].finish-parkingArea[idParkingArea].spot[idSpot].start))/60/60));
        require((hour*parkingArea[idParkingArea].price) == msg.value);
        require(!parkingArea[idParkingArea].spot[idSpot].paid);
        parkingArea[idParkingArea].spot[idSpot].paid = true;
        msg.sender.transfer(msg.value);

    }

    ParkingArea[] private parkingArea;
}

