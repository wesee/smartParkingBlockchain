const contenuto = $("#contenuto")
function createUserPage() {
    const listaParcheggi = `
    <li>
        <a href='javascript:contenuto.load("prenotaParcheggio.html");'>
            <i class="material-icons">directions_car</i><span>Parcheggi Disponibili</span>
        </a>
    </li>
    <li>
        <a href='javascript:contenuto.load("visualizzaPrenotati.html");'>
            <i class="material-icons">present_to_all</i><span>Parcheggi Prenotati</span>
        </a>
    </li>`;
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createAdminPage() {
    const listaParcheggi = `
    <li>
        <a href='javascript:contenuto.load("visualizzaParcheggi.html");'>
            <i class="material-icons">directions_car</i><span>Parcheggi Creati</span>
        </a>
    </li>
    <li>
        <a href='javascript:contenuto.load("creaParcheggio.html");'>
            <i class="material-icons">add</i><span>Crea nuovo parcheggio</span>
        </a>
    </li>`;
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createMetamaskNoAccount() {
    const selezionareAccount = '<p>Selezionare un account valido su Metamask</p>'
    $("#errorType").html(selezionareAccount);
}

function createMetamaskNotFound() {
    const selezionareAccount = '<p><b>Metamask non rilevato</b></br>Seleziona il tuo browser e installa l \'estensione!</p><div><button onclick="window.location.href=\'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/\'" type="button" style="margin-right:20px" class="btn bg-orange btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-firefox"></i></button><button onclick="window.location.href=\'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn\'" type="button" class="btn bg-cyan btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-chrome"></i></button></div>'
    $("#errorType").html(selezionareAccount);
}

function writeAccountInDom(account) {
    $("#WalletAddress").html("Account: " + SmartParking.account);
    const data = new Identicon(SmartParking.account).toString();
    $("#imageUserIdenticon").attr("src", "data:image/png;base64," + data);
}

