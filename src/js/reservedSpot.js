function printSpot(){
    $("#contenutoTabella").empty();
    App.getAllReservation();
}

function addSpot(spot){
    spot.then(s => {
        let timestampDiff = s[5]-s[4];
        let hours = timestampDiff / 3600;
        console.log(hours)
        $("#contenutoTabella").append('<tr id='+s[1].toNumber()+'></tr>');
        $("#"+s[1].toNumber()).append(
            '<th scope="row">'+s[0].toNumber()+'</th>'+
            '<td>'+s[1]+'</td>'+
            '<td>'+s[2]+'</td>'+
            '<td>'+s[3]+'</td>'+
            '<td>'+moment.unix(s[4]).format('DD/MM/YYYY HH:mm')+'</td>'+
            '<td>'+moment.unix(s[5]).format('DD/MM/YYYY HH:mm')+'</td>'+
            '<td><button onclick="App.paySpot('+s[0]+','+s[1]+','+(hours)*s[3]+')" type="button" class="btn bg-red waves-effect"><i class="material-icons">payment</i></button></td>');

    })
}
