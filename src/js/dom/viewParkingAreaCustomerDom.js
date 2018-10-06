function printParkingArea(idMap) {
    const parkingAreaPromise = SmartParking.getAllParkingArea()
    const map = SmartMap;
    map.initMap(idMap);
    parkingAreaPromise.then(allParkingArea => {
        Promise.all(allParkingArea).then(parkingArea => {
            const exchange = new EtherExchange();
            for (let i = 0; i < parkingArea.length; i++) {
                exchange.etherToEuro(web3.fromWei(parkingArea[i][3],"ether")).then(euro => {
                    let rounded = euro.toFixed(2);
                    map.addMarker(JSON.parse(parkingArea[i][4]),{id:parkingArea[i][0],price:rounded})
                })
            }
        })
    })
}

function reserveSpot(id) {
    console.log("kek")
    $("#reserveSpot").empty();
    $("#reserveSpot").load(`reserveSpotForm.html`, () => {
        $("#titleReservation").replaceWith('<h2 id="titleReservation">INSERIRE DATI PER PRENOTARE POSTO AL PARCHEGGIO ' + id + '</h2>');
        $("#buttonReservation").replaceWith('<button onclick="reserveSelectSpot(' + id + ')" class="btn bg-red waves-effect" type="button">Prenota</button>')
       

        SmartParking.getSpots(id).then(spotPromise => {
            Promise.all(spotPromise).then(spots => {
                for (let i = 0; i < spots.length; i++)
                    if (spots[i]) {
                        let spotSelect = $("#spotSelect");
                        spotSelect.append('<option value="' + i + '">' + i + '</option>')
                        $("#spotSelect").selectpicker("refresh");
                    }
            })
        })
    });

}

function reserveSpot() {
    const plate = $("#plate").val();
    const start = moment($('#startTime').val(), "D/M/YYYY H:mm").unix()
    const finish = moment($('#finishTime').val(), "D/M/YYYY H:mm").unix()
    const spot = $("#spotSelect").val();
    reserveSelectSpotConfirm(plate, start, finish, spot)
}

function reserveSelectSpotConfirm(plate, start, finish, spot) {
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