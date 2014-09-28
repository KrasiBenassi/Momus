(function () {
    var app;
    var track_id = ''; // Name/ID of the exercise
    var watch_id = null; // ID of the geolocation
    var tracking_data = []; // Array containing GPS position objects

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: kendo.observable({
                title: 'Home',
                checkConnection: function () {
                    var eventHandler = new EventHandler();
                    eventHandler.run();
                    if (navigator.network.connection.type == Connection.NONE) {
                        $("#home_network_button").text('No Internet Access');
                    } else {
                        $("#home_network_button").text('Internet access enabled');
                    }
                },
                clearLocalStorage: function () {
                    window.localStorage.clear();
                },
                seedGpsData: function () {
                    window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');
                }
            }),
            track: kendo.observable({
                title: 'Track',
                startTracking: function () {
                    watch_id = navigator.geolocation.watchPosition(
                        function (position) {
                            tracking_data.push(position);
                            console.dir(tracking_data);
                        },
                        function (error) {
                            console.log(error);
                        }, {
                            frequency: 3000,
                            enableHighAccuracy: true
                        });

                    // Tidy up the UI
                    track_id = $("#track_id").val();

                    $("#track_id").hide();

                    $("#startTracking_status").html("Tracking workout: <strong>" + track_id + "</strong>");
                },
                stopTracking: function () {

                    navigator.geolocation.clearWatch(watch_id);

                    window.localStorage.setItem(track_id, JSON.stringify(tracking_data));

                    watch_id = null;
                    tracking_data = [];

                    // Tidy up the UI
                    $("#track_id").val("").show();

                    $("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id + "</strong>");
                }
            }),
            history: kendo.observable({
                title: 'History',
                showMap: function () {
                    var mapProp = {
                        center: new google.maps.LatLng(51.508742, -0.120850),
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
                    google.maps.event.addDomListener(window, 'load', initialize);
                },
                ds: new kendo.data.DataSource({
                    data: [{
                        id: 1,
                        name: 'Bob'
                    }, {
                        id: 2,
                        name: 'Mary'
                    }, {
                        id: 3,
                        name: 'John'
                    }]
                })
            })
        }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        app = new kendo.mobile.Application(document.body, {
            transition: 'slide',
            skin: 'flat',
            initial: 'views/home.html'
        });

    }, false);

    //Events API
    function EventHandler() {}

    EventHandler.prototype = {
        run: function () {
            var that = this;

            document.addEventListener("online",
                function () {
                    that._onOnline.apply(that, arguments);
                },
                false);

            document.addEventListener("offline",
                function () {
                    that._onOffline.apply(that, arguments);
                },
                false);
        },

        _onOnline: function () {
            $("#network-status").html('Online');
        },

        _onOffline: function () {
            $("#network-status").html('Offline');
        }
    }

}());