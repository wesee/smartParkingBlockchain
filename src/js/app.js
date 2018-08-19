App = {
    web3Provider: null,
    contracts: {},
    account: null,
    isAdmin: false,

    init: function() {
        return App.initWeb3();
    },
    
    initWeb3: function(callback) {
        if(typeof web3 !== 'undefined'){
            if(web3.currentProvider.isMetaMask === true){
                App.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
                web3.currentProvider.publicConfigStore.on('update', App.reloadPage);
                return App.initContract();
            }else{
                console.log("metamask is not available")
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
            return App.render();
        });
    },
    reloadPage: function(){
        web3.eth.getCoinbase(function(err,account){
            if(account != App.account){
                window.location.href = "index.html"
                App.render()
            }
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
            App.isAdmin = isAdmin;
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
                for(let i=0;i<count.toNumber();i++){
                    allParkingArea.push(instance.getParkingArea(i));
                }
                return allParkingArea;
            }).then(parkingArea =>{
                    printParkingArea(parkingArea);
            })
        })
    },
    getSpots: function(id){
        App.contracts.SmartParking.deployed().then(function(instance){
            instance.getParkingArea(id).then(pa => {
               for(let i=0; i < pa[1].toNumber(); i++)
                instance.isAvailable(id,i).then(available => {
                    if(available)
                        addSpot(i);
                })
            })
        })
    },
    createNewParkingArea: function(){
        const price = $("#priceOfParkingArea").val();
        const address = $("#addressOfParkingArea").val();
        const numberOfSpot = $("#numberOfSpot").val();
        App.contracts.SmartParking.deployed().then(function(instance){
            instance.addParkingArea(price,address,numberOfSpot,{from: App.account, gasPrice: 2000000000});
        });
    },
    updateParkingArea: function(id){
        var price = $("#priceOfParkingArea").val();
        var address = $("#addressOfParkingArea").val();
        var numberOfSpot = $("#numberOfSpot").val();
        App.contracts.SmartParking.deployed().then(function(instance){
            return instance.updateParkingArea(id,price,address,numberOfSpot,{from: App.account, gasPrice: 2000000000});
        });
    },
    reserveSpot: function(idArea){
        const plate = $("#plate").val();
        const start = moment($('#startTime').val(), "D/M/YYYY H:mm").unix() 
        const finish = moment($('#finishTime').val(), "D/M/YYYY H:mm").unix() 
        const spot = $("#spotSelect").val();
        App.contracts.SmartParking.deployed().then(function(instance){
            instance.reserveSpot(idArea,spot,start,finish,plate,{from: App.account, gasPrice: 2000000000});
        })
    },
    getAllReservation: function(){
        App.contracts.SmartParking.deployed().then(function(instance){
            instance.getParkingAreaCount().then(count =>{
                for(let i=0;i<count.toNumber();i++){
                    instance.getParkingArea(i).then(pa => {
                        for(let j = 0; j < pa[1]; j++)
                            instance.isReservedToMe(i,j).then(reservation => {
                                if(reservation)
                                    addSpot(instance.getReservation(i,j));
                            })
                    })
                }

            })
        })
    },
    paySpot: function(idParkingArea, idSpot, value){
        console.log(value)
        App.contracts.SmartParking.deployed().then(function(instance){
            instance.paySpot(idParkingArea,idSpot,{from: App.account, gasPrice: 2000000000,value: Math.round(value)});
        })
    }
};
