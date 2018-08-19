function createUserPage(){
    const listaParcheggi = '<ul class="ml-menu"><li><a href="prenotaParcheggio.html">Parcheggi Disponibili</a></li><li><a href="visualizzaPrenotati.html">Parcheggi Prenotati</a></li></ul>'
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
