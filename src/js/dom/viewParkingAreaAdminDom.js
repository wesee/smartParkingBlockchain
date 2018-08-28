function printParkingArea() {
    const parkingAreaPromise = SmartParking.getAllParkingArea()
    const noSpot = $("#noSpot");
    noSpot.empty();
    parkingAreaPromise.then(allParkingArea => {
        if (allParkingArea.length == 0) {
            parkingAreaHtml = '<div class="block-header"><h2>Non sono disponibili parcheggi, aggiungine uno!</h2></div>'
            $("#noSpot").html(parkingAreaHtml);
        }
        else
            Promise.all(allParkingArea).then(parkingArea => {
                const table = $('#attachTable').DataTable();
                table.clear();
                for(let i=0; i < parkingArea.length; i++)
                    table.row.add([parkingArea[i][0], parkingArea[i][5], parkingArea[i][1], parkingArea[i][2], (parkingArea[i][3] == -1 ? "Nessun parcheggio occupato" : parkingArea[i][3])]).draw(false);

                $('#attachTable tbody').on('click', 'tr', function () {
                    updateParkingArea($('#attachTable').DataTable().row(this).data()[0]);
                });
                $("#attachTable > tbody").css("cursor", "pointer")
            })
    })
}

function sendUpdate(id) {
    updateParkingAreaConfirm(id)
    $("#updateParkingArea").empty();
}

function updateParkingArea(id) {
    const updateArea = $("#updateParkingArea");
    updateArea.empty();
    updateArea.load(`updateParkingAreaForm.html`, () => {
        $("#titleParkingArea").replaceWith('<h2>Modifica il parcheggio ' + id + '</h2>');
        $("#buttonParkingArea").replaceWith('<button type="button" onclick="sendUpdate(' + id + ')" class="btn btn-primary btn-lg m-l-15 waves-effect">Modifica</button>')
    });
}

function updateParkingAreaConfirm(id) {
    swal({
        title: "Sei sicuro?",
        text: "Vuoi modificare i dati relativi al tuo parcheggio",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("Dati modificati!", "I dati sono stati modificati con successo.", "success");
            SmartParking.updateParkingArea(id);
        } else {
            swal("Cancellata", "Non sono stati modificati i tuoi dati", "error");
        }
    });
}


function addParkingArea(){
    addParkingAreaConfirm();
}

function addParkingAreaConfirm() {
    swal({
        title: "Sei sicuro?",
        text: "Vuoi aggiungere un nuovo parcheggio",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("Parcheggio aggiunto!", "Parcheggio aggiunto con succeesso.", "success");
            SmartParking.createNewParkingArea();
        } else {
            swal("Annullato", "Il parcheggio non è stato aggiunto", "error");
        }
    });
}