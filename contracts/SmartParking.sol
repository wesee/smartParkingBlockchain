pragma solidity ^0.4.24;

import "./Migrations.sol";

contract SmartParking is Migrations { 

    struct Spot {
        uint16 id;
        uint reservationCount;
        mapping(address => Reservation[]) reservation;
    }

    struct ParkingArea {
        uint8 id;
        uint16 spotCount;
        int24 lastSpot;
        uint price;
        string addrs;
        mapping(uint16 => Spot) spot;
    }

    struct Reservation {
        uint start;
        uint creation;
        uint finish;
        string plate;
        bool paid;
        address customer;
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

    function isAvailable(uint8 idParkingArea, uint16 idSpot, uint _start, uint _now, uint _finish) public view returns(bool){

    }

    function reserveSpot(uint8 idParkingArea, uint16 idSpot, uint _start, uint _now, uint _finish, string _plate) public{
        require(isAvailable(idParkingArea, idSpot, _start, _finish),"Spot not available");
        require(_start<_finish,"Start time greater than finish time");
        parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start = _start;
        parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].creation = _now; 
        parkingArea[idParkingArea].spot[idSpot].id = idSpot;
        parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish = _finish; 
        parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].plate = _plate; 
        parkingArea[idParkingArea].lastSpot = idSpot;
        parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].customer = msg.sender;
        parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].paid = false;
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

    function getReceipt(uint8 idParkingArea, uint16 idSpot,uint _now) public view returns (uint){
        require(needToPay(idParkingArea, idSpot,_now),"No receipt found");
        uint hour = ((((
            parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish-parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start))/60/60));
        return (hour*(parkingArea[idParkingArea].price));
    }

    function paySpot(uint8 idParkingArea, uint16 idSpot, uint idReservation,uint _now) public payable{
        require(needToPay(idParkingArea,idSpot,_now),"Spot payment error");
        uint hour = ((((
            parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish-parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start))/60/60));
        require((hour*(parkingArea[idParkingArea].price)) == msg.value,"The amount send is incorrect");
        parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].paid = true;
        owner.transfer(msg.value);
    }
    
    function () public payable {
    }

    ParkingArea[] private parkingArea;
}