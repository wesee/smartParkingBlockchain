App = {
    web3Provider: null,
    contracts: {},
    account: null,

    init: function() {
        return App.initWeb3();
    },
    
    initWeb3: function() {
        if(typeof web3 !== 'undefined'){
            if(web3.currentProvider.isMetaMask === true){
                App.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
            }else{
                console.log("metamask is not avitable")
            }
        }else{
            const loader = $("#loaderMetamask");
            const page = $("#pageLoaded");
            const metamask = $("#installMetamask");
            createMetamaskNotFound();
            loader.hide();
            page.hide();
            metamask.show();
        }
        web3.currentProvider.publicConfigStore.on('update', App.render);
        return App.initContract();
    },
    
    initContract: function() {
        $.getJSON("SmartParking.json", function(smartParking) {
            App.contracts.SmartParking = TruffleContract(smartParking);
            App.contracts.SmartParking.setProvider(App.web3Provider);
            App.listenForEvents();
            return App.render();
        });
    },
    listenForEvents: function() {
        
    },
    
    render: function() {
        console.log("render");
        const loader = $("#loader");
        const page = $("#pageLoaded");
        const metamask = $("#installMetamask");
        
        loader.show();
        metamask.hide();
        page.hide();
        
        web3.eth.getCoinbase(function(err,account){
            console.log("error: ", err);
            if(err == null)
                App.account = account;
            if(App.account!=null){
                $("#WalletAddress").html("Account: " + App.account);
                const data = new Identicon(App.account).toString();
                $("#imageUserIdenticon").attr("src","data:image/png;base64,"+data);
                loader.hide();
                page.show();
            }
            else
                createMetamaskNoAccount();
        });
        
        App.contracts.SmartParking.deployed().then(function(instance){ 
            return instance.isOwner(); 
        }).then(function(isAdmin){
            console.log(isAdmin);
            if(!isAdmin)
                createUserPage();
            else
                createAdminPage();
        })
    }
};

window.onload = App.init();

