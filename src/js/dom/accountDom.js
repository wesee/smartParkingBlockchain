const contenuto = $("#contenuto")
function createUserPage() {
    const listaParcheggi = `
    <li>
        <a href='javascript:contenuto.load("prenotaParcheggio.html");'>
            <i class="material-icons">directions_car</i><span>parking space available</span>
        </a>
    </li>
    <li>
        <a href='javascript:contenuto.load("visualizzaPrenotati.html");'>
            <i class="material-icons">present_to_all</i><span>booked parking</span>
        </a>
    </li>`;
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createAdminPage() {
    const listaParcheggi = `
    <li>
        <a href='javascript:contenuto.load("visualizzaParcheggi.html");'>
            <i class="material-icons">directions_car</i><span>car parks created</span>
        </a>
    </li>
    <li>
        <a href='javascript:contenuto.load("creaParcheggio.html");'>
            <i class="material-icons">add</i><span>create new parking lot</span>
        </a>
    </li>`;
    $("#sectionParking > ul").remove();
    $("#sectionParking").append(listaParcheggi);
}

function createMetamaskNoAccount() {
    const selezionareAccount = '<p>select a valid account on metamask</p>'
    $("#errorType").html(selezionareAccount);
}

function createMetamaskNotFound() {
    const selezionareAccount = '<p><b>metamask not detected</b></br>select your browser and install the \'extension!</p><div><button onclick="window.location.href=\'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/\'" type="button" style="margin-right:20px" class="btn bg-orange btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-firefox"></i></button><button onclick="window.location.href=\'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn\'" type="button" class="btn bg-cyan btn-circle-lg waves-effect waves-circle waves-float"><i class="fa fa-chrome"></i></button></div>'
    $("#errorType").html(selezionareAccount);
}

function writeAccountInDom(account) {
    $("#WalletAddress").html("account: " + SmartParking.account);
    const data = new Identicon(SmartParking.account).toString();
    $("#imageUserIdenticon").attr("src", "data:image/png;base64," + data);
}

