pragma solidity ^0.4.24;

import "./Migrations.sol";

contract SmartParking is Migrations { 

    struct Spot {
        uint16 id;
        uint reservationCount;
        mapping(uint => Reservation) reservation;
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

    function isPaid(uint8 idParkingArea, uint16 idSpot, uint idReservation) public view returns (bool){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].paid;
    }

    function isReservedToMe(uint8 idParkingArea, uint16 idSpot, uint idReservation) public view returns (bool){
        require(idParkingArea<getParkingAreaCount(),"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].customer == msg.sender);
    }

    function isAvailable(uint8 idParkingArea, uint16 idSpot, uint idReservation, uint _from, uint _to) public view returns (bool){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (_from > parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish ||
                _to < parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start ||
                ((!isPaid(idParkingArea, idSpot, idReservation)) && (_from > (parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].creation+(15*60))))
        );
    }

    function needToPay(uint8 idParkingArea, uint16 idSpot, uint idReservation, uint _now) public view returns (bool){
        require(idParkingArea<getParkingAreaCount(),"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (
            parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].customer == msg.sender && 
            !parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].paid &&
            _now < (parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].creation+(15*60)) &&
            _now < parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish
            );
    }

    function getReservation(uint8 idParkingArea, uint16 idSpot, uint idReservation, uint _now) 
    public view 
    returns (uint8, uint16, string, uint, uint, uint){
        require(needToPay(idParkingArea,idSpot,idReservation,_now),"different customers address in the spot");
        return (
                parkingArea[idParkingArea].id, 
                parkingArea[idParkingArea].spot[idSpot].id,
                parkingArea[idParkingArea].addrs,
                parkingArea[idParkingArea].price,
                parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start,
                parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish
            );
    }
    function getSpotPaid(uint8 idParkingArea, uint16 idSpot,uint idReservation) 
    public view 
    returns (uint8, uint16, string, uint, uint, uint){
        require(isPaid(idParkingArea,idSpot,idReservation),"This spot is unpaied");
        require(isReservedToMe(idParkingArea,idSpot,idReservation),"different customers address in the spot");
        return(
                parkingArea[idParkingArea].id, 
                parkingArea[idParkingArea].spot[idSpot].id,
                parkingArea[idParkingArea].addrs,
                parkingArea[idParkingArea].price,
                parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start,
                parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish
            );
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

    function getSpot(uint8 idParkingArea, uint16 idSpot, uint idReservation) public view returns (uint16,uint,uint,string){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (
                parkingArea[idParkingArea].spot[idSpot].id,
                parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start,
                parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish,
                parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].plate
            );
    }

    function reserveSpot(uint8 idParkingArea, uint16 idSpot,uint idReservation, uint _start, uint _now, uint _finish, string _plate) public{
        require(isAvailable(idParkingArea,idSpot,idReservation,_start,_finish),"Spot not available");
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

    function getReceipt(uint8 idParkingArea, uint16 idSpot,uint idReservation,uint _now) public view returns (uint){
        require(needToPay(idParkingArea, idSpot,idReservation,_now),"No receipt found");
        uint hour = ((((
            parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].finish-parkingArea[idParkingArea].spot[idSpot].reservation[idReservation].start))/60/60));
        return (hour*(parkingArea[idParkingArea].price));
    }
    function paySpot(uint8 idParkingArea, uint16 idSpot, uint idReservation,uint _now) public payable{
        require(needToPay(idParkingArea,idSpot,idReservation,_now),"Spot payment error");
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