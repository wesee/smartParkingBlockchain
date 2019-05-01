SmartParking = {
    web3Provider: null,
    contracts: {},
    account: null,
    isAdmin: false,

    initWeb3: async function () {
        if (typeof web3 !== 'undefined') {
            if (web3.currentProvider.isMetaMask === true) {
                SmartParking.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
                //web3.currentProvider.publicConfigStore.on('update', SmartParking.reloadPage);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    // web3.eth.sendTransaction({/* ... */});
                    web3.currentProvider.publicConfigStore.on('update', SmartParking.reloadPage);
                } catch (error) {
                    // User denied account access...
                }


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
            SmartParking.render();
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
            console.log('isadmin is ' + isAdmin);
            console.log(typeof isAdmin);

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
                        allParkingArea.push(instance.getParkingArea(i, moment(new Date(), "D/M/YYYY H:mm").unix()));
                    }
                    res(allParkingArea);
                })
            }).catch((err) => console.log(err))
        })
    },
    getSpots: function (id) {
        return new Promise((res, rej) => {
            SmartParking.contracts.SmartParking.deployed().then(function (instance) {
                instance.getParkingArea(id, moment(new Date(), "D/M/YYYY H:mm").unix()).then(pa => {
                    let spotsId = [];
                    for (let i = 0; i < pa[1].toNumber(); i++)
                        spotsId.push(instance.isAvailable(id, i, moment(new Date(), "D/M/YYYY H:mm").unix()));

                    res(spotsId)
                })
            }).catch((err) => console.log(err))
        })
    },
    createNewParkingArea: function (price, address, numberOfSpot) {
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            instance.addParkingArea(price, address, numberOfSpot, { from: SmartParking.account, gasPrice: 2000000000 });
        }).catch((err) => console.log(err));
    },
    updateParkingArea: function (id, price, address, numberOfSpot) {
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            instance.updateParkingArea(id, price, address, numberOfSpot, { from: SmartParking.account, gasPrice: 2000000000 });
        }).catch((err) => console.log(err));
    },
    reserveSpot: function (idArea, plate, start, finish, spot) {
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            instance.reserveSpot(idArea, spot, start, moment(new Date(), "D/M/YYYY H:mm").unix(), finish, plate, { from: SmartParking.account, gasPrice: 2000000000 });
        }).catch((err) => console.log(err))
    },
    getAllReservation: function () {
        return new Promise((res, rej) => {
            SmartParking.contracts.SmartParking.deployed().then(function (instance) {
                instance.getParkingAreaCount().then(count => {
                    let allParkingArea = [];
                    for (let i = 0; i < count.toNumber(); i++) {
                        allParkingArea.push(new Promise((res, rej) => {
                            instance.getParkingArea(i, moment(new Date(), "D/M/YYYY H:mm").unix()).then(pa => {
                                let spotPromise = []
                                for (let j = 0; j < pa[1]; j++) {
                                    spotPromise.push(new Promise((res, rej) => {
                                        instance.needToPay(i, j, moment(new Date(), "D/M/YYYY H:mm").unix()).then(isReserved => {
                                            if (isReserved)
                                                res(instance.getReservation(i, j, moment(new Date(), "D/M/YYYY H:mm").unix()));
                                            else
                                                res([])
                                        })
                                    }))
                                }
                                res(spotPromise);
                            })
                        }))
                    }
                    res(allParkingArea);
                })
            }).catch((err) => console.log(err))
        })
    },
    getReceipt: function (idParkingArea, idSpot) {
        return new Promise((res, rej) => {
            SmartParking.contracts.SmartParking.deployed().then(function (instance) {
                instance.getReceipt(idParkingArea, idSpot, moment(new Date(), "D/M/YYYY H:mm").unix()).then(cost => {
                    res(cost.toNumber())
                })
            })
        })
    },
    paySpot: function (idParkingArea, idSpot) {
        SmartParking.contracts.SmartParking.deployed().then(function (instance) {
            SmartParking.getReceipt(idParkingArea, idSpot).then(price => {
                instance.paySpot(idParkingArea, idSpot, moment(new Date(), "D/M/YYYY H:mm").unix(), {
                    from: SmartParking.account, gasPrice: 2000000000, value: price
                }).catch((err) => console.log(err));
            })
        })
    }
};
