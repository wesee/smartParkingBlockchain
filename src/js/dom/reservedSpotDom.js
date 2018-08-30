
function printReservedSpot() {
    SmartParking.getAllReservation().then(reservedPromise => {
        const table = $('#attachTable').DataTable();
        table.clear();
        const convert = new EtherExchange();
        Promise.all(reservedPromise).then(reservedArray => {
            for (let i = 0; i < reservedArray.length; i++) {
                Promise.all(reservedArray[i]).then(spots => {
                    spots = spots.filter(function (element) {
                        return element.length != 0;
                    });
                    for (let i = 0; i < spots.length; i++) {
                        s = spots[i];
                        let timestampDiff = s[5] - s[4];
                        let hours = timestampDiff / 3600;
                        convert.etherToEuro(web3.fromWei(s[3], "ether")).then(euro => {
                            let rounded = euro.toFixed(2);
                            table.row.add([s[0], s[1], s[2], rounded, moment.unix(s[4]).format('DD/MM/YYYY HH:mm'), moment.unix(s[5]).format('DD/MM/YYYY HH:mm'), (hours * rounded).toFixed(2)]).draw(false);
                        })
                        $('#attachTable tbody').on('click', 'tr', reserveClosures);
                        function reserveClosures() {
                            const spot = $('#attachTable').DataTable().row(this).data();
                            PaySelectSpot(spot[0], spot[1], web3.fromWei(s[3], "ether") * hours);
                        }
                    }
                })
            }
        })
    })
    $("#attachTable > tbody").css("cursor", "pointer")

}

function PaySelectSpot(parkingAreaId, spotId, price) {
    swal({
        title: "Sei sicuro?",
        text: "Vuoi confermare il pagamento",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("Pagato!", "Il pagamento è andato a buon fine.", "success");
            SmartParking.paySpot(parkingAreaId, spotId, price);
        } else {
            swal("Cancellata", "il pagamento è stato cancellato", "error");
        }
    });
}