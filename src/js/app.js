App = {
    web3Provider: null,
    contracts: {},
    account: null,

    init: function() {
        return App.initWeb3();
    },
    
    initWeb3: function(callback) {
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
            const loader = $("#loader");
            const page = $("#pageLoaded");
            createMetamaskNotFound();
            loader.show();
            page.hide();
        }
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
        App.contracts.SmartParking.deployed().then(function(instance){
            instance.spotTaken({},{
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error,event){
                App.getAllParkingArea()
            })
        })
    },
    
    render: function() {
        const loader = $("#loader");
        const page = $("#pageLoaded");
        
        loader.show();
        page.hide();
        
        web3.eth.getCoinbase(function(err,account){
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
            var allParkingArea = [];
            instance.getParkingAreaCount().then(count =>{
                for(var i=0;i<count.toNumber();i++){
                    allParkingArea.push(instance.getParkingArea(i));
                }
                return allParkingArea;
            }).then(function(parkingArea){
                printParkingArea(parkingArea);
            })
        })
    },
    createNewParkingArea: function(){
        var price = $("#priceOfParkingArea").val();
        var address = $("#addressOfParkingArea").val();
        var numberOfSpot = $("#numberOfSpot").val();
        console.log(price,address,numberOfSpot)
        App.contracts.SmartParking.deployed().then(function(instance){
            console.log(instance);
            return instance.addParkingArea(price,address,numberOfSpot,{from: App.account, gasPrice: 2000000000});
        });
    }
};
