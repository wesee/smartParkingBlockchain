var idPrenotazione;
function printParkingArea(idMap) {
    const parkingAreaPromise = SmartParking.getAllParkingArea()
    const map = SmartMap;
    map.initMap(idMap)
    parkingAreaPromise.then(allParkingArea => {
        Promise.all(allParkingArea).then(parkingArea => {
            const exchange = new EtherExchange();
            for (let i = 0; i < parkingArea.length; i++) {
                exchange.etherToEuro(web3.fromWei(parkingArea[i][3], "ether")).then(euro => {
                    let rounded = euro.toFixed(2);
                    map.addMarker(JSON.parse(parkingArea[i][4]), { id: parkingArea[i][0], price: rounded },()=>{
                        SmartMap.Coordinate = JSON.parse(parkingArea[i][4]);
                        idPrenotazione = parkingArea[i][0];
                    })
                })
            }
        })
    })
}

function reserveSpot() {
    const plate = $("#plate").val();
    const start = moment($('#startTime').val(), "D/M/YYYY H:mm").unix()
    const finish = moment($('#finishTime').val(), "D/M/YYYY H:mm").unix()
    const id = idPrenotazione.toNumber();
    console.log(id) 
    swal({
        title: "Sei sicuro?",
        text: "Vuoi confermare la tua prenotazione",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("Prenotato!", "La tua prenotazione è andata a buon fine.", "success");
            SmartParking.reserveSpot(id, plate, start, finish, spot);
        } else {
            swal("Cancellata", "La prenotazione non è stata confermata", "error");
        }
    });
}