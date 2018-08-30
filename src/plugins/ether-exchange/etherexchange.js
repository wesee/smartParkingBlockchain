class EtherExchange {
        constructor() {
                this.EtherPromise = new Promise((resolve, reject) => {
                        $.ajax({
                                url: 'https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH',
                                type: 'GET',
                                success: function (response) {
                                        resolve(response.ETH);
                                },
                                error: function (error) {
                                        reject(error);
                                }
                        })
                })
        }

        etherToEuro(ether){
                return this.EtherPromise.then(exchenge=>{
                        return (ether)/exchenge
                })
        }
        euroToEther(euro){
                return this.EtherPromise.then(exchenge=>{
                        return euro*exchenge;
                })
        }
}