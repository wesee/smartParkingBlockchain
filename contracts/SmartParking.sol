pragma solidity ^0.4.24;

import "./Migrations.sol";

contract SmartParking is Migrations { 

    struct Spot {
        uint16 id;
        mapping(uint16 => address[]) customersId;  
        mapping(address => Reservation[]) reservation;
    }

    struct ParkingArea {
        uint8 id;
        uint16 spotCount;
        int24 lastSpot;
        uint price;
        string addrs;
        mapping(address => uint16[]) spotReservation;  
        mapping(uint16 => Spot) spot;
    }

    struct Reservation {
        uint start;
        uint creation;
        uint finish;
        string plate;
        bool paid;
    }

    function getParkingAreaCount() public view returns(uint){
        return parkingArea.length;
    }

    function addParkingArea(uint _price, string _addrs, uint16 _spotCount) public restricted{
        ParkingArea memory pa;
        parkingArea.push(pa);
        parkingArea[parkingArea.length-1].id = uint8(parkingArea.length-1);
        parkingArea[parkingArea.length-1].price = _price; 
        parkingArea[parkingArea.length-1].addrs = _addrs; 
        parkingArea[parkingArea.length-1].spotCount = _spotCount;
        parkingArea[parkingArea.length-1].lastSpot = -1;
    }

    function updateParkingArea(uint8 id, uint _price, string _addrs, uint16 _spotCount) public restricted{
        parkingArea[id].price = _price;
        parkingArea[id].addrs = _addrs;
        parkingArea[id].spotCount = _spotCount;
    }

    function getParkingArea(uint8 index) public view returns (uint8, uint16, int, uint, string){
        require(index < parkingArea.length, "Parking Area out of bound");
        return (
                parkingArea[index].id,
                parkingArea[index].spotCount,
                parkingArea[index].lastSpot,
                parkingArea[index].price,
                parkingArea[index].addrs
            );
    }
    
    function isOwner() public view returns (bool){
        return owner == msg.sender;
    }

    function isSpotAvitableAt(uint8 idParkingArea, uint16 idSpot, uint start, uint finish) public view returns(bool){
        address[] memory customers = parkingArea[idParkingArea].spot[idSpot].customersId[idSpot];
        for(uint i = 0; i < customers.length; i++){
            Reservation[] memory reservations = parkingArea[idParkingArea].spot[idSpot].reservation[customers[i]];
            for(uint j = 0; j < reservations.length; j++)
                if(reservations[j].start < finish && reservations[j].finish < start){
                    return false;
                }
        }
        return true;
    }

    function reserveSpot(uint8 idParkingArea, uint16 idSpot,uint start,uint finish,string plate) public{
        parkingArea[idParkingArea].spot[idSpot].customersId[idSpot].push(msg.sender);
        parkingArea[idParkingArea].spot[idSpot].reservation[msg.sender].push(Reservation(start, now, finish, plate, false));
    }
    function getReservation(uint idParkingArea, uint index) public view returns(uint, uint, string){
        uint16[] memory idSpot = parkingArea[idParkingArea].spotReservation[msg.sender];
        return(
            parkingArea[idParkingArea].
            parkingArea[idParkingArea].
            parkingArea[idParkingArea].
        )
    }

    ParkingArea[] private parkingArea;
}
