function printParkingArea() {
    const parkingAreaPromise = SmartParking.getAllParkingArea()

    parkingAreaPromise.then(allParkingArea => {
        Promise.all(allParkingArea).then(parkingArea => {
            const table = $('#attachTable').DataTable();
            table.clear();
            const exchange = new EtherExchange();
            for (let i = 0; i < parkingArea.length; i++) {
                exchange.etherToEuro(web3.fromWei(parkingArea[i][4],"ether")).then(euro => {
                    let rounded = euro.toFixed(2);
                    table.row.add([parkingArea[i][0], parkingArea[i][5], rounded, (parkingArea[i][2] == 0 ? "Nessun parcheggio disponibile" : parkingArea[i][2])]).draw(false);
                })
            }
            $('#attachTable tbody').on('click', 'tr', function () {
                if ($('#attachTable').DataTable().row(this).data()[3] > 0)
                    reserveSpot($('#attachTable').DataTable().row(this).data()[0]);
            });
            $("#attachTable > tbody").css("cursor", "pointer")
        })
    })
}

function reserveSpot(id) {
    $("#reserveSpot").empty();
    $("#reserveSpot").load(`reserveSpotForm.html`, () => {
        $("#titleReservation").replaceWith('<h2 id="titleReservation">INSERIRE DATI PER PRENOTARE POSTO AL PARCHEGGIO ' + id + '</h2>');
        $("#buttonReservation").replaceWith('<button onclick="reserveSelectSpot(' + id + ')" class="btn bg-red waves-effect" type="button">Prenota</button>')
        $('#startTime').bootstrapMaterialDatePicker({
            format: 'DD/MM/YYYY HH:mm', 
            minDate: new Date(), 
            clearButton: true, 
            weekStart: 1
        });
        $("#finishTime").prop('disabled', true);

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

function reserveSelectSpot(id) {
    const plate = $("#plate").val();
    const start = moment($('#startTime').val(), "D/M/YYYY H:mm").unix()
    const finish = moment($('#finishTime').val(), "D/M/YYYY H:mm").unix()
    const spot = $("#spotSelect").val();
    reserveSelectSpotConfirm(id, plate, start, finish, spot)
}

function reserveSelectSpotConfirm(id, plate, start, finish, spot) {
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