SmartMap = {
        Map: null,
        Results: null,
        Coordinate: {},
        initMap: function (idMap, picker) {
                SmartMap.Coordinate = {};
                function geo_success(position) {
                        createMapInPosition(position.coords.latitude, position.coords.longitude);
                }
                function geo_error() {
                        createMapInPosition(3.10662, 101.449727);
                        //createMapInPosition(45.5384, -122.6695);
                }

                var geo_options = {
                        enableHighAccuracy: true,
                        maximumAge: 30000,
                        timeout: 27000
                };

                navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);

                function createMapInPosition(lat, lng) {
                        if(SmartMap.Map!=null){
                                SmartMap.Map.off();
                                SmartMap.Map.remove();
                        }
                        //SmartMap.Map = L.map(idMap).setView([lat, lng], 10);
                        SmartMap.Map = L.map(idMap).setView([lat, lng], 15);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(SmartMap.Map);
                        SmartMap.Results = L.layerGroup().addTo(SmartMap.Map);
                        L.esri.Geocoding.geosearch().addTo(SmartMap.Map);
                        if (picker) {
                                SmartMap.Map.on('click', function (e) {
                                        L.esri.Geocoding.geocodeService().reverse().latlng(e.latlng).run(function (error, result) {
                                                SmartMap.Results.clearLayers();
                                                SmartMap.Results.addLayer(L.marker(result.latlng).addTo(SmartMap.Map)
                                                        .bindPopup(result.address.Match_addr).openPopup());
                                                SmartMap.Coordinate = result.latlng;
                                        });
                                });
                        }
                }
        },
        getCoordinate: function () {
                return SmartMap.Coordinate;
        },
        getAddress: function (Coordinate) {
                return new Promise((res, rej) => {
                        L.esri.Geocoding.geocodeService().reverse().latlng(Coordinate).run(function (error, result) {
                                res(result.address.Match_addr);
                        });
                })

        },
        addMarker: function (loc, data, callback) {
                let markerText = $('<a></a>');
                markerText.css('cursor', 'pointer');
                if (callback && data.spotFree > 0) {
                        markerText.click(function (e) { e.preventDefault(); callback(); });
                }
                L.esri.Geocoding.geocodeService().reverse().latlng(loc).run(function (error, result) {
                        markerText.html(result.address.Match_addr +
                                "</br>price time: " + data.price + `</br>available lot: ` + data.spotFree + `</a>`);
                        SmartMap.Results.addLayer(L.marker(result.latlng).addTo(SmartMap.Map)
                                .bindPopup(markerText.get(0)));
                });
        }
};
