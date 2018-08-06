function createUserPage(){
    const listaParcheggi = '<ul class="ml-menu"><li><a href="javascript:void(0);">Parcheggi Disponibili</a></li><li><a href="javascript:void(0);">Parcheggi Prenotati</a></li></ul>'
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
    const selezionareAccount = '<p><b>Metamask non rilevato</b></br>Seleziona il tuo browser e installa l\'estensione!</p><div><button onclick="window.location.href=\'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/\'" type="button" style="margin-right:20px" class="btn bg-orange btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-firefox"></i></button><button onclick="window.location.href=\'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn\'" type="button" class="btn bg-cyan btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-chrome"></i></button></div>'
    $("#errorType").html(selezionareAccount);
}

function writeAccountInDom(account){
    $("#WalletAddress").html("Account: " + App.account);
    const data = new Identicon(App.account).toString();
    $("#imageUserIdenticon").attr("src","data:image/png;base64,"+data);
}

function printParkingArea(parkingArea){
    $("#contenutoTabella").empty();
    let parkingAreaHtml;
    if(parkingArea.length == 0){
        parkingAreaHtml = '<div class="block-header"><h2>Non sono disponibili parcheggi, aggiungine uno!</h2></div>'
        $("#contenuto").html(parkingAreaHtml);
    }
    else{
        for(let i=0; i<parkingArea.length;i++){
            $("#contenutoTabella").append('<tr id='+i+'></tr>');
            parkingArea[i].getId().then(res =>{$("#"+i).append('<th scope="row">'+res.toNumber()+'</th>')})
            parkingArea[i].getSpotCount().then(res => $("#"+i).append('<td>'+res.toNumber()+'</td>'))
            parkingArea[i].getAvitableSpotCount().then(res => $("#"+i).append('<td>'+res.toNumber()+'</td>'))
            parkingArea[i].getLastSpot().then(res => {
                if(res == 0)
                    $("#"+i).append('<td>NAN</td>')
                else{
                    return App.contracts.ParkingSpot.at(res);
                }}).then(res => console.log(res));
        }
    }
}
