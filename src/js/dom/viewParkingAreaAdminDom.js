function printParkingArea() {
    const parkingAreaPromise = SmartParking.getAllParkingArea()
    parkingAreaPromise.then(allParkingArea => {
        Promise.all(allParkingArea).then(parkingArea => {
            const table = $('#attachTable').DataTable();
            table.clear();
            for (let i = 0; i < parkingArea.length; i++){
                SmartMap.getAddress(JSON.parse(parkingArea[i][5])).then(address=>{
                    table.row.add([parkingArea[i][0], address, parkingArea[i][1], parkingArea[i][2], (parkingArea[i][3] == -1 ? "Nessun parcheggio occupato" : parkingArea[i][3])]).draw(false);
                })
            }

            $('#attachTable tbody').on('click', 'tr', function () {
                updateParkingArea($('#attachTable').DataTable().row(this).data()[0]);
            });
            $("#attachTable > tbody").css("cursor", "pointer")
        })
    })
}

function sendUpdate(id) {
    const price = ($("#euroPrezzo").inputmask('unmaskedvalue')) / 100;
    const address = JSON.stringify(SmartMap.getCoordinate());
    const numberOfSpot = $("#numberOfSpot").val();
    const convert = new EtherExchange();
    convert.euroToEther(price).then(ether => {
        updateParkingAreaConfirm(id, web3.toWei(ether, "ether"), address, numberOfSpot);
        $("#updateParkingArea").empty();
        $("#showParkingAreaTable").show();
    })
}

function updateParkingArea(id) {
    $("#showParkingAreaTable").hide();
    const updateArea = $("#updateParkingArea");
    updateArea.empty();
    updateArea.load(`updateParkingAreaForm.html`, () => {
        $("#titleParkingArea").replaceWith('<h2>Modifica il parcheggio ' + id + '</h2>');
        $("#buttonParkingArea").replaceWith('<button type="button" onclick="sendUpdate(' + id + ')" class="btn btn-primary btn-lg m-l-15 waves-effect">Modifica</button>')
    });
}

function updateParkingAreaConfirm(id, price, address, numberOfSpot) {
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
            SmartParking.updateParkingArea(id, price, address, numberOfSpot);
        } else {
            swal("Cancellata", "Non sono stati modificati i tuoi dati", "error");
        }
    });
}


function addParkingArea() {
    const price = ($("#euroPrezzo").inputmask('unmaskedvalue')) / 100;
    const address = JSON.stringify(SmartMap.getCoordinate());
    const numberOfSpot = $("#numberOfSpot").val();
    const convert = new EtherExchange();
    convert.euroToEther(price).then(ether => {
        addParkingAreaConfirm(web3.toWei(ether, "ether"), address, numberOfSpot);
    })
}

function addParkingAreaConfirm(price, address, numberOfSpot) {
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
            SmartParking.createNewParkingArea(price, address, numberOfSpot);
        } else {
            swal("Annullato", "Il parcheggio non è stato aggiunto", "error");
        }
    });
}

function printMap(idMap) {
    SmartMap.initMap(idMap,true);
}