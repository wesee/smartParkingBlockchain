function createUserPage(){
    const listaParcheggi = '<ul class="ml-menu"><li><a href="prenotaParcheggio.html">Parcheggi Disponibili</a></li><li><a href="javascript:void(0);">Parcheggi Prenotati</a></li></ul>'
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createAdminPage(){
    const listaParcheggi = '<ul class="ml-menu"><li><a href="visualizzaParcheggi.html">Parcheggi Creati</a></li><li><a href="creaParcheggio.html">Crea nuovo parcheggio</a></li></ul>'
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createMetamaskNoAccount(){
    const selezionareAccount = '<p>Selezionare un account valido su Metamask</p>'
    $("#errorType").html(selezionareAccount);
}

function createMetamaskNotFound(){
    const selezionareAccount = '<p><b>Metamask non rilevato</b></br>Seleziona il tuo browser e installa l \'estensione!</p><div><button onclick="window.location.href=\'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/\'" type="button" style="margin-right:20px" class="btn bg-orange btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-firefox"></i></button><button onclick="window.location.href=\'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn\'" type="button" class="btn bg-cyan btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-chrome"></i></button></div>'
    $("#errorType").html(selezionareAccount);
}

function writeAccountInDom(account){
    $("#WalletAddress").html("Account: " + App.account);
    const data = new Identicon(App.account).toString();
    $("#imageUserIdenticon").attr("src","data:image/png;base64,"+data);
}

function printParkingAreaAdmin(parkingArea){
    $("#contenutoTabella").empty();
    $("#noSpot").empty();
    let parkingAreaHtml;
    if(parkingArea.lenght == 0){
        parkingAreaHtml = '<div class="block-header"><h2>Non sono disponibili parcheggi, aggiungine uno!</h2></div>'
        $("#noSpot").html(parkingAreaHtml);
    }
    else{
        for(let i=0; i<parkingArea.length;i++){
            $("#contenutoTabella").append('<tr id='+i+'></tr>');
            parkingArea[i].then(pa => {
                $("#"+i).append(
                    '<th scope="row">'+pa[0].toNumber()+'</th>'+
                    '<td>'+pa[1].toNumber()+'</td>'+
                    '<td>'+pa[2].toNumber()+'</td>');
                if(pa[3] == -1)
                    $("#"+i).append('<td>Nessun parcheggio Occupato</td>')
                else{
                    $("#"+i).append('<td>'+pa[3].toNumber()+'</td>')
                }
            }).then(()=>$("#"+i).append('<td><button onclick="updateParkingArea('+i+')" type="button" class="btn bg-red waves-effect"><i class="material-icons">create</i></button></td>'))
        }
    }
}

function sendUpdate(id){
    App.updateParkingArea(id);
    $("#updateParkingArea").empty();
}

function updateParkingArea(id){
    $("#updateParkingArea").empty();
    $("#updateParkingArea").append(`<div class="row clearfix">
                                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div class="card">
                                                <div class="header">
                                                    <h2>Modifica il parcheggio `+id+`</h2>
                                            </div>
                                            <div class="body">
                                                <form>
                                                    <div class="row clearfix">
                                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                                            <div class="form-group">
                                                                <div class="form-line">
                                                                    <input type="number" min="0" class="form-control" id="priceOfParkingArea" placeholder="Prezzo Orario Parcheggio" required>
                                                                    <div class="help-info">Inserire il prezzo orario del parcheggio</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                                            <div class="form-group">
                                                                <div class="form-line">
                                                                    <input type="text" class="form-control" id="addressOfParkingArea" placeholder="Indirizzo Parcheggio" required>
                                                                    <div class="help-info">Inserire l\'indirizzo del parcheggio </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                                                            <div class="form-group">
                                                                <div class="form-line">
                                                                    <input type="number" min="0" class="form-control" id="numberOfSpot" name="number" placeholder="Numero di posti auto" required>
                                                                    <div class="help-info">Inserire il numero di posti disponibili</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                            <div class="form-group">
                                                                    <button type="button" onclick="sendUpdate(`+id+`)" class="btn btn-primary btn-lg m-l-15 waves-effect">Modifica</button>
                                                            </div>
                                                        </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`);
}


function printParkingAreaCustomer(parkingArea){
    $("#contenutoTabella").empty();
    for(let i=0; i<parkingArea.length;i++){
        $("#contenutoTabella").append('<tr id='+i+'></tr>');
        $("#"+i).append(
                '<th scope="row">'+parkingArea[i][0].toNumber()+'</th>'+
                '<td>'+parkingArea[i][5]+'</td>'+
                '<td>'+parkingArea[i][4]+'</td>');
            if(parkingArea[i][2].toNumber() == 0)
                $("#"+i).append('<td>Nessun parcheggio disponibile</td>')
            else{
                $("#"+i).append('<td>'+parkingArea[i][2].toNumber()+'</td>')
                $("#"+i).append('<td><button onclick="reserveSpot('+i+')" type="button" class="btn bg-red waves-effect"><i class="material-icons">plus_one</i></button></td>')
            }
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
                                    <option value="`+spot[Math.floor(Math.random() * spot.length)]+`">-- Selezionare spot --</option>
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
    let spotSelect = $("#spotSelect");
    for(let s in spot)
        spotSelect.append('<option value="'+s+'">'+s+'</option>')
}

