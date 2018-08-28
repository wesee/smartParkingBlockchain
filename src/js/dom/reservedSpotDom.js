function printSpot() {
    SmartParking.getAllReservation().then(reservedSpot =>{
        const table = $('#attachTable').DataTable();
        table.clear();
        for(let i=0; i<reservedSpot.length;i++)
            reservedSpot[i].then(s =>{
                let timestampDiff = s[5] - s[4];
                let hours = timestampDiff / 3600;
                table.row.add([s[0], s[1], s[2], s[3], moment.unix(s[4]).format('DD/MM/YYYY HH:mm'), moment.unix(s[5]).format('DD/MM/YYYY HH:mm'),Math.round(hours * s[3])]).draw(false);
            })
    })
    $('#attachTable tbody').on('click', 'tr', reserveClosures);
    function reserveClosures(){
        const spot = $('#attachTable').DataTable().row(this).data();
        if(spot!= undefined)
        PaySelectSpot(spot[0],spot[1],spot[6]);
    }
    $("#attachTable > tbody").css("cursor", "pointer")
}

function PaySelectSpot(parkingAreaId,spotId,price) {
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
            SmartParking.paySpot(parkingAreaId,spotId,price);
        } else {
            swal("Cancellata", "La prenotazione non è stata confermata", "error");
        }
    });
}