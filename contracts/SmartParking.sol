pragma solidity ^0.4.24;

import "./Migrations.sol";

contract SmartParking is Migrations{

    struct Spot{
        uint16 id;
        uint start;
        uint creation;
        uint finish;
        address customer;
        string plate;
        bool paid;
    }

    struct ParkingArea{
        uint8 id;
        uint price;
        string addrs;
        uint16 spotCount;
        int24 lastSpot;
        mapping(uint16 => Spot) spot;
    }

    function getParkingAreaCount() public view returns(uint){
        return parkingArea.length;
    }

    function isPaid(uint8 idParkingArea, uint16 idSpot) public view returns (bool){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return parkingArea[idParkingArea].spot[idSpot].paid;
    }

    function isReservedToMe(uint8 idParkingArea, uint16 idSpot) public view returns (bool){
        require(idParkingArea<getParkingAreaCount(),"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (parkingArea[idParkingArea].spot[idSpot].customer == msg.sender);
    }

    function isAvailable(uint8 idParkingArea, uint16 idSpot, uint _now) public view returns (bool){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (_now > parkingArea[idParkingArea].spot[idSpot].finish ||
                ((!isPaid(idParkingArea, idSpot)) && (_now > (parkingArea[idParkingArea].spot[idSpot].creation+(15*60))))
        );
    }

    function needToPay(uint8 idParkingArea, uint16 idSpot, uint _now) public view returns (bool){
        require(idParkingArea<getParkingAreaCount(),"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (
            parkingArea[idParkingArea].spot[idSpot].customer == msg.sender &&
            !parkingArea[idParkingArea].spot[idSpot].paid &&
            _now < (parkingArea[idParkingArea].spot[idSpot].creation+(15*60)) &&
            _now < parkingArea[idParkingArea].spot[idSpot].finish
            );
    }

    function getReservation(uint8 idParkingArea, uint16 idSpot,uint _now) public view returns (uint8, uint16, string, uint, uint, uint){
        require(needToPay(idParkingArea,idSpot,_now),"different customers address in the spot");
        return (
                parkingArea[idParkingArea].id, 
                parkingArea[idParkingArea].spot[idSpot].id,
                parkingArea[idParkingArea].addrs,
                parkingArea[idParkingArea].price,
                parkingArea[idParkingArea].spot[idSpot].start,
                parkingArea[idParkingArea].spot[idSpot].finish
            );
    }
    function getSpotPaid(uint8 idParkingArea, uint16 idSpot) public view returns (uint8, uint16, string, uint, uint, uint, string){
        require(isPaid(idParkingArea,idSpot),"This spot is unpaied");
        require(isReservedToMe(idParkingArea,idSpot),"different customers address in the spot");
        return(
                parkingArea[idParkingArea].id, 
                parkingArea[idParkingArea].spot[idSpot].id,
                parkingArea[idParkingArea].addrs,
                parkingArea[idParkingArea].price,
                parkingArea[idParkingArea].spot[idSpot].start,
                parkingArea[idParkingArea].spot[idSpot].finish,
                parkingArea[idParkingArea].spot[idSpot].plate
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

    function getSpotsAvitable(uint8 idParkingArea, uint _now) public view returns (uint16){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        uint16 spotCount = 0;
        for(uint16 i = 0;i<parkingArea[idParkingArea].spotCount;i++)
            if(isAvailable(idParkingArea,i,_now)){
                spotCount++;
            }
        return spotCount;
    }

    function getSpot(uint8 idParkingArea, uint16 idSpot) public view returns (uint16,uint,uint,string){
        require(idParkingArea<parkingArea.length,"Parking Area out of bound");
        require(idSpot<parkingArea[idParkingArea].spotCount,"Spot out of bound");
        return (
                parkingArea[idParkingArea].spot[idSpot].id,
                parkingArea[idParkingArea].spot[idSpot].start,
                parkingArea[idParkingArea].spot[idSpot].finish,
                parkingArea[idParkingArea].spot[idSpot].plate
            );
    }

    function reserveSpot(uint8 idParkingArea, uint16 idSpot, uint _start, uint _now,uint _finish, string _plate) public{
        require(isAvailable(idParkingArea,idSpot,_now),"Spot not available");
        require(_start<_finish,"Start time greater than finish time");
        parkingArea[idParkingArea].spot[idSpot].start = _start;
        parkingArea[idParkingArea].spot[idSpot].creation = _now; 
        parkingArea[idParkingArea].spot[idSpot].id = idSpot;
        parkingArea[idParkingArea].spot[idSpot].finish = _finish; 
        parkingArea[idParkingArea].spot[idSpot].plate = _plate; 
        parkingArea[idParkingArea].lastSpot = idSpot;
        parkingArea[idParkingArea].spot[idSpot].customer = msg.sender;
        parkingArea[idParkingArea].spot[idSpot].paid = false;
    }

    function getParkingArea(uint8 index, uint _now) public view returns (uint8, uint16, uint16, int,uint,string){
        require(index<parkingArea.length,"Parking Area out of bound");
        return (
                parkingArea[index].id,
                parkingArea[index].spotCount,
                getSpotsAvitable(index,_now),
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
        uint8 hour = uint8((((parkingArea[idParkingArea].spot[idSpot].finish-parkingArea[idParkingArea].spot[idSpot].start))/60/60));
        return (hour*(parkingArea[idParkingArea].price));
    }
    function paySpot(uint8 idParkingArea, uint16 idSpot, uint _now) public payable{
        require(needToPay(idParkingArea,idSpot,_now),"Spot payment error");
        uint8 hour = uint8((((parkingArea[idParkingArea].spot[idSpot].finish-parkingArea[idParkingArea].spot[idSpot].start))/60/60));
        require((hour*(parkingArea[idParkingArea].price)) == msg.value,"The amount send is incorrect");
        parkingArea[idParkingArea].spot[idSpot].paid = true;
        owner.transfer(msg.value);
    }
    
    function () public payable {

    }

    ParkingArea[] private parkingArea;
}