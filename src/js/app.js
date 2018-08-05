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
                web3.currentProvider.publicConfigStore.on('update', App.render);
                return App.initContract();
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
                writeAccountInDom(App.account);
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
    },
    getAllParkingArea: function(){
        App.contracts.SmartParking.deployed().then(function(instance){
            return instance.getAllParkingArea();
        }).then(function(parkingArea){
            printParkingArea(parkingArea);
        })
    },
    createNewParkingArea: function(){
        var price = $("priceOfParkingArea").val();
        var address = $("addressOfParkingArea").val();
        var numberOfSpot = $("numberOfSpot").val();
        App.contracts.SmartParking.deployed().then(function(instance){
            console.log(instance);
            return instance.addParkingArea(price,address,numberOfSpot,{from: App.account});
        });
    }
};

window.onload = App.init();

