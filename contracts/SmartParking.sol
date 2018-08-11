pragma solidity ^0.4.24;

import "./Migrations.sol";

contract SmartParking is Migrations{

    struct Spot{
        uint16 id;
        uint start;
        uint finish;
        address customer;
        string plate;
    }

    struct ParkingArea{
        uint8 id;
        string price;
        string addrs;
        uint16 spotCount;
        int lastSpot;
        mapping(uint16 => Spot) spot;
    }

    event spotTaken(uint16 id, string palte, address user);
    event updateArea();

    function getParkingAreaCount() public view returns(uint){
        return parkingArea.length;
    }
    
    function addParkingArea(string _price, string _addrs, uint16 _spotCount) public restricted{
        ParkingArea memory pa;
        parkingArea.push(pa);
        parkingArea[parkingArea.length-1].id = uint8(parkingArea.length-1);
        parkingArea[parkingArea.length-1].price = _price; 
        parkingArea[parkingArea.length-1].addrs = _addrs; 
        parkingArea[parkingArea.length-1].spotCount = _spotCount;
        parkingArea[parkingArea.length-1].lastSpot = -1;
    }

    function updateParkingArea(uint8 id, string _price, string _addrs, uint16 _spotCount) public restricted{
        parkingArea[id].price = _price;
        parkingArea[id].addrs = _addrs;
        parkingArea[id].spotCount = _spotCount;
        emit updateArea();
    }

    function isAvitable(uint8 idParkingArea, uint16 idSpot) public view returns (bool){
        require(idParkingArea<parkingArea.length);
        require(idSpot<parkingArea[idParkingArea].spotCount);
        if(now > parkingArea[idParkingArea].spot[idSpot].finish)
            return true;
        else
            return false;
    }

    function getSpotsAvitable(uint8 idParkingArea) public view returns (uint16){
        require(idParkingArea<parkingArea.length);
        uint16 spotCount=0;
        for(uint16 i=0;i<parkingArea[idParkingArea].spotCount;i++)
            if(isAvitable(idParkingArea,i))
                spotCount++;
        return spotCount;
    }

    function getSpot(uint8 idParkingArea, uint16 idSpot) public view returns (uint16,uint,uint,string){
        require(idParkingArea<parkingArea.length);
        require(idSpot<parkingArea[idParkingArea].spotCount);
        return (parkingArea[idParkingArea].spot[idSpot].id,parkingArea[idParkingArea].spot[idSpot].start,parkingArea[idParkingArea].spot[idSpot].finish,parkingArea[idParkingArea].spot[idSpot].plate);
    }

    function reserveSpot(uint8 idParkingArea, uint16 idSpot, uint _start, uint _finish, string _plate) public{
        require(idParkingArea<parkingArea.length);
        require(idSpot<parkingArea[idParkingArea].spotCount);
        require(idSpot<parkingArea[idParkingArea].spotCount);
        require(isAvitable(idParkingArea,idSpot));
        require(_start<_finish);
        parkingArea[idParkingArea].spot[idSpot].start = _start; 
        parkingArea[idParkingArea].spot[idSpot].finish = _finish; 
        parkingArea[idParkingArea].spot[idSpot].plate = _plate; 
        parkingArea[idParkingArea].lastSpot = idSpot;
        parkingArea[idParkingArea].spot[idSpot].customer = msg.sender;
        emit spotTaken(idSpot,_plate,msg.sender);
    }

    function getParkingArea(uint8 index) public view returns (uint8, uint16, uint16, int,string,string){
        require(index<parkingArea.length);
        return (parkingArea[index].id,parkingArea[index].spotCount,getSpotsAvitable(index),parkingArea[index].lastSpot,parkingArea[index].price,parkingArea[index].addrs);
    }

    function isOwner() public view returns (bool){
        return owner == msg.sender;
    }


    ParkingArea[] private parkingArea;
}

