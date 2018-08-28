SmartParking = {
    web3Provider: null,
    contracts: {},
    account: null,
    isAdmin: false,

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            if (web3.currentProvider.isMetaMask === true) {
                SmartParking.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
                web3.currentProvider.publicConfigStore.on('update', SmartParking.reloadPage);
            } else {
                console.log("metamask is not available")
            }
        } else {
            const loader = $("#loader");
            const page = $("#pageLoaded");
            createMetamaskNotFound();
            loader.show();
            page.hide();
        }
        return SmartParking.initContract();
    },
    initContract: function () {
        $.getJSON("SmartParking.json", function (smartParking) {
            SmartParking.contracts.SmartParking = TruffleContract(smartParking);
            SmartParking.contracts.SmartParking.setProvider(SmartParking.web3Provider);
            return SmartParking.render();
        });
    },
    reloadPage: function (data, error) {
        web3.eth.getCoinbase(function (err, account) {
            if (account != SmartParking.account) {
                window.location.href = "index.html"
                SmartParking.render()
            }
        })
    },
    render: function () {
        const loader = $("#loader");
        const page = $("#pageLoaded");

        loader.show();
        page.hide();

        web3.eth.getCoinbase(function (err, account) {
            if (err == null)
                SmartParking.account = account;
            if (SmartParking.account != null) {
                writeAccountInDom(SmartParking.account);
                loader.hide();
                page.show();
            }
            else
                createMetamaskNoAccount();
        });
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            return instance.isOwner();
        }).then(function (isAdmin) {
            SmartParking.isAdmin = isAdmin;
            if (!isAdmin)
                createUserPage();
            else
                createAdminPage();
        })
    },
    getAllParkingArea: function () {
        return new Promise((res, rej) => {
            SmartParking.contracts.SmartParking.deployed().then(function (instance) {
                var allParkingArea = [];
                instance.getParkingAreaCount().then(count => {
                    for (let i = 0; i < count.toNumber(); i++) {
                        allParkingArea.push(instance.getParkingArea(i));
                    }
                    res(allParkingArea);
                })
            })
        })
    },
    getSpots: function (id) {
        return new Promise((res, rej) => {
            SmartParking.contracts.SmartParking.deployed().then(function (instance) {
                instance.getParkingArea(id).then(pa => {
                    let spotsId = [];
                    for (let i = 0; i < pa[1].toNumber(); i++)
                        spotsId.push(instance.isAvailable(id, i));

                    res(spotsId)
                })
            })
        })
    },
    createNewParkingArea: function () {
        const price = $("#priceOfParkingArea").val();
        const address = $("#addressOfParkingArea").val();
        const numberOfSpot = $("#numberOfSpot").val();
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            instance.addParkingArea(price, address, numberOfSpot, { from: SmartParking.account, gasPrice: 2000000000 });
        });
    },
    updateParkingArea: function (id) {
        const price = $("#priceOfParkingArea").val();
        const address = $("#addressOfParkingArea").val();
        const numberOfSpot = $("#numberOfSpot").val();
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            return instance.updateParkingArea(id, price, address, numberOfSpot, { from: SmartParking.account, gasPrice: 2000000000 });
        });
    },
    reserveSpot: function (idArea) {
        const plate = $("#plate").val();
        const start = moment($('#startTime').val(), "D/M/YYYY H:mm").unix()
        const finish = moment($('#finishTime').val(), "D/M/YYYY H:mm").unix()
        const spot = $("#spotSelect").val();
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            instance.reserveSpot(idArea, spot, start, finish, plate, { from: SmartParking.account, gasPrice: 2000000000 });
        })
    },
    getAllReservation: function () {
        return new Promise((res, rej) => {
            SmartParking.contracts.SmartParking.deployed().then(function (instance) {
                instance.getParkingAreaCount().then(count => {
                    let reservationPromise = [];
                    for (let i = 0; i < count.toNumber(); i++) {
                        reservationPromise.push(new Promise((res, rej) => {
                            instance.getParkingArea(i).then(pa => {
                                for (let j = 0; j < pa[1]; j++)
                                    instance.isReservedToMe(i, j).then(isReserved => {
                                        if (isReserved)
                                            res(instance.getReservation(i, j));
                                    })
                            })
                        }))
                    }
                    res(reservationPromise)
                })
            })
        })
    },
    paySpot: function (idParkingArea, idSpot, value) {
        console.log(value)
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            instance.paySpot(idParkingArea, idSpot, { from: SmartParking.account, gasPrice: 2000000000, value: Math.round(value) });
        })
    }
};
