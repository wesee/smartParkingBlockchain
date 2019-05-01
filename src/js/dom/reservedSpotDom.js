function printReservedSpot() {
    SmartParking.getAllReservation().then(reservedPromise => {
        const table = $('#attachTable').DataTable();
        table.clear();
        const convert = new EtherExchange();
        Promise.all(reservedPromise).then(reservedArray => {
            let euroPromise = [];
            for (let i = 0; i < reservedArray.length; i++) {
                euroPromise.push(Promise.all(reservedArray[i]).then(spots => {
                    spots = spots.filter(function (element) {
                        return element.length != 0;
                    });
                    for (let i = 0; i < spots.length; i++) {
                        s = spots[i];
                        let timestampDiff = s[5] - s[4];
                        let hours = timestampDiff / 3600;
                        convert.etherToEuro(web3.fromWei(s[3], 'ether')).then(euro => {
                            SmartMap.getAddress(JSON.parse(s[2])).then(address => {
                                table.row.add([s[0], s[1], address, euro.toFixed(2), moment.unix(s[4]).format('DD/MM/YYYY HH:mm'), moment.unix(s[5]).format('DD/MM/YYYY HH:mm'), (hours * euro).toFixed(2)]).draw(false);
                            });
                        })
                        $('#attachTable tbody').on('click', 'tr', reserveClosures);
                        function reserveClosures() {
                            const spot = $('#attachTable').DataTable().row(this).data();
                            PaySelectSpot(spot[0], spot[1], web3.fromWei(s[3], "ether") * hours);
                        }
                    }
                }))
            }
        })
    })
    $("#attachTable > tbody").css("cursor", "pointer")
}

function PaySelectSpot(parkingAreaId, spotId) {
    swal({
        title: "are you sure?",
        text: "do you want to confirm payment",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal("paid!", "the payment has been successful", "success");
            SmartParking.paySpot(parkingAreaId, spotId);
        } else {
            swal("canceled", "the payment has been canceled", "error");
        }
    });
}
