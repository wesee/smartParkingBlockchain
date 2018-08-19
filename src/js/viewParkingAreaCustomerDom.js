function printParkingArea(parkingArea){
    $("#contenutoTabella").empty();
    for(let i=0; i<parkingArea.length;i++){
        $("#contenutoTabella").append('<tr id='+i+'></tr>');
        parkingArea[i].then(pa => {
            $("#"+i).append(
                '<th scope="row">'+pa[0].toNumber()+'</th>'+
                '<td>'+pa[5]+'</td>'+
                '<td>'+pa[4]+'</td>');
            if(pa[2].toNumber() == 0)
                $("#"+i).append('<td>Nessun parcheggio disponibile</td>')
            else{
                $("#"+i).append('<td>'+pa[2].toNumber()+'</td>')
                $("#"+i).append('<td><button onclick="reserveSpot('+i+')" type="button" class="btn bg-red waves-effect"><i class="material-icons">plus_one</i></button></td>')
            }
        })
    }
}

function reserveSpot(id){
    $("#reserveSpot").empty();
    $("#reserveSpot").append(`
    <div class="row clearfix">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="card">
                <div class="header">
                    <h2>INSERIRE DATI PER PRENOTARE POSTO AL PARCHEGGIO `+id+`</h2>
                </div>
                <div class="body">
                    <form id="form_validation" method="POST">
                        <div class="form-group form-float">
                            <div class="form-line">
                                <input type="text" class="form-control" name="targa" id="plate" placeholder="Targa" required>
                            </div>
                        </div>
                        <div class="form-group form-float">
                            <div class="form-group">
                                <div class="form-line">
                                    <input onblur='$("#finishTime").prop("disabled",false);$("#finishTime").bootstrapMaterialDatePicker({ format : "DD/MM/YYYY HH:mm", minDate : new Date()})' type="text" id="startTime" class="datetimepicker form-control" placeholder="Tempo di inizio">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="form-line">
                                    <input type="text" id="finishTime" class="datetimepicker form-control" placeholder="Tempo di fine">
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix">
                            <div class="col-sm-6">
                                <select class="form-control show-tick" id="spotSelect">
                                    <option value="-1">-- Selezionare spot --</option>
                                </select>
                            </div>
                        </div>
                        <button onclick="App.reserveSpot(`+id+`)" class="btn bg-red waves-effect" type="button">Prenota</button>
                    </form>
                </div>
            </div>
        </div>
    </div>`);
    $('#startTime').bootstrapMaterialDatePicker({ format : 'DD/MM/YYYY HH:mm', minDate : new Date()  });
    $("#finishTime").prop('disabled', true);
    App.getSpots(id);
    
}

function addSpot(spotId){
    let spotSelect = $("#spotSelect");
    spotSelect.append('<option value="'+spotId+'">'+spotId+'</option>')
}