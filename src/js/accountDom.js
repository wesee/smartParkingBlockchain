function createUserPage(){
    const listaParcheggi = '<ul class="ml-menu"><li><a href="javascript:void(0);">Parcheggi Disponibili</a></li><li><a href="javascript:void(0);">Parcheggi Prenotati</a></li></ul>'
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createAdminPage(){
    const listaParcheggi = '<ul class="ml-menu"><li><a href="javascript:void(0);" onclick="App.getAllParkingArea();">Parcheggi Creati</a></li><li><a href="javascript:void(0);" onclick="createFormNewParkingArea()">Crea nuovo parcheggio</a></li></ul>'
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createMetamaskNoAccount(){
    const selezionareAccount = '<p>Selezionare un account valido su Metamask</p>'
    $("#errorType").append(selezionareAccount);
}

function createMetamaskNotFound(){
    const selezionareAccount = '<p><b>Metamask non rilevato</b></br>Seleziona il tuo browser e installa l\'estensione!</p><div><button onclick="window.location.href=\'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/\'" type="button" style="margin-right:20px" class="btn bg-orange btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-firefox"></i></button><button onclick="window.location.href=\'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn\'" type="button" class="btn bg-cyan btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-chrome"></i></button></div>'
    $("#errorType").append(selezionareAccount);
}

function writeAccountInDom(account){
    $("#WalletAddress").html("Account: " + App.account);
    const data = new Identicon(App.account).toString();
    $("#imageUserIdenticon").attr("src","data:image/png;base64,"+data);
}

function printParkingArea(parkingArea){
    console.log("kek");
    let parkingAreaHtml;
    if(parkingArea.length == 0)
        parkingAreaHtml = '<div class="block-header"><h2>Non sono disponibili parcheggi, aggiungine uno!</h2></div>'
    $("#contenuto").html(parkingAreaHtml);
}

function createFormNewParkingArea(){
    var form = `<div class="row clearfix">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="card">
                            <div class="header">
                                <h2>AGGIUNGI AREA PARCHEGGIO</h2>
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
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <button type="button" onclick="App.createNewParkingArea()" class="btn btn-primary btn-lg m-l-15 waves-effect">Aggiungi</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>`;  
    $("#contenuto").html(form);
}
