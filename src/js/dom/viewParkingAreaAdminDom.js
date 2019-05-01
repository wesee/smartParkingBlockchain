function printParkingArea() {
    const parkingAreaPromise = SmartParking.getAllParkingArea()
    parkingAreaPromise.then(allParkingArea => {
        Promise.all(allParkingArea).then(parkingArea => {
            const table = $('#attachTable').DataTable();
            table.clear();
            for (let i = 0; i < parkingArea.length; i++){
                SmartMap.getAddress(JSON.parse(parkingArea[i][5])).then(address=>{
                    table.row.add([parkingArea[i][0], address, parkingArea[i][1], parkingArea[i][2], (parkingArea[i][3] == -1 ? "no busy parking" : parkingArea[i][3])]).draw(false);
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
        title: "are you sure?",
        text: "you want to change the data related to your parking",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "yes",
        cancelButtonText: "no",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("modified data!", "the data has been changed successfully", "success");
            SmartParking.updateParkingArea(id, price, address, numberOfSpot);
        } else {
            swal("deleted", "your data has not been changed", "error");
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
        title: "are you sure?",
        text: "do you want to add a new parking space",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("added parking!", "parking added with success", "success");
            SmartParking.createNewParkingArea(price, address, numberOfSpot);
        } else {
            swal("canceled", "parking has not been added", "error");
        }
    });
}

function printMap(idMap) {
    SmartMap.initMap(idMap,true);
}
