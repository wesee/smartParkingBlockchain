function printParkingArea() {
    const parkingAreaPromise = SmartParking.getAllParkingArea()
    const noSpot = $("#noSpot");
    noSpot.empty();
    parkingAreaPromise.then(allParkingArea => {
        if (allParkingArea.length == 0) {
            parkingAreaHtml = '<div class="block-header"><h2>Non sono disponibili parcheggi</h2></div>'
            $("#noSpot").html(parkingAreaHtml);
        }
        else
            Promise.all(allParkingArea).then(parkingArea => {
                const table = $('#attachTable').DataTable();
                table.clear();
                for (let i = 0; i < parkingArea.length; i++)
                    table.row.add([parkingArea[i][0], parkingArea[i][5], parkingArea[i][4], (parkingArea[i][2] == 0 ? "Nessun parcheggio occupato" : parkingArea[i][2])]).draw(false);

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
        $('#startTime').bootstrapMaterialDatePicker({ format: 'DD/MM/YYYY HH:mm', minDate: new Date() });
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
            SmartParking.reserveSpot(id);
        } else {
            swal("Cancellata", "La prenotazione non è stata confermata", "error");
        }
    });
}