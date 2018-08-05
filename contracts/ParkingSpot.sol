pragma solidity ^0.4.24;


contract ParkingSpot{

    constructor(uint _id) public {
        id = _id;
    }

    function occupySpot(uint _start, uint _finish, string _plate) public {
        require(_start<=_finish);
        startDate = _start;
        finishDate = _finish;
        plate = _plate;
    }

    function isAvitable() public view returns (bool){
        if(now >= finishDate)
            return true;
        if(now <= finishDate)
            return false;
    }

    function getStartTime() public view returns (uint){
        return startDate;
        //aggiungi libreria
    }

    function getFinishTime() public view returns (uint){
        return finishDate;
        //aggiungi libreria
    }

    function getPlate() public view returns (string){
        return plate;
    } 
    
    function getId() public view returns (uint){
        return id;
    }

    uint private id;
    uint private startDate;
    uint private finishDate;
    string private plate;
}

