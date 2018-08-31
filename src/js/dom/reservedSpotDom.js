function printReservedSpot() {
    SmartParking.getAllReservation().then(reservedPromise => {
        const table = $('#attachTable').DataTable();
        table.clear();
        const convert = new EtherExchange();
        let promiseExchange = [];
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
                        promiseExchange.push(new Promise((res, rej) => {
                            convert.etherToEuro(web3.fromWei(s[3], 'ether')).then(euro => {
                                res(euro.toFixed(2))
                            })
                        }))
                        table.row.add([s[0], s[1], s[2], s[3], moment.unix(s[4]).format('DD/MM/YYYY HH:mm'), moment.unix(s[5]).format('DD/MM/YYYY HH:mm'), (hours * s[3])]).draw(false);
                        $('#attachTable tbody').on('click', 'tr', reserveClosures);
                        function reserveClosures() {
                            const spot = $('#attachTable').DataTable().row(this).data();
                            PaySelectSpot(spot[0], spot[1], web3.fromWei(s[3], "ether") * hours);
                        }
                    }
                    return promiseExchange;
                }))
            }
            euroPromise[euroPromise.length - 1].then(euroArray => {
                Promise.all(euroArray).then(euro => {
                    for (let i = 0; i < euro.length; i++) {
                        let data = table.row(i).data();
                        data[3] = euro[i];
                        let timestampDiff = moment(data[5], "D/M/YYYY H:mm").unix() - moment(data[4], "D/M/YYYY H:mm").unix();
                        let hours = timestampDiff / 3600;
                        data[6] = (euro[i] * hours).toFixed(2);
                        table.row(i).data(data).draw(false);
                    }
                })
            })
        })
    })
    $("#attachTable > tbody").css("cursor", "pointer")
}

function PaySelectSpot(parkingAreaId, spotId) {
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
            SmartParking.paySpot(parkingAreaId, spotId);
        } else {
            swal("Cancellata", "il pagamento è stato cancellato", "error");
        }
    });
}