(function () {
    var app;

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

            }),
            track: kendo.observable({
                title: 'Track'
            }),
            history:  kendo.observable({
                title: 'History',
                showMap: function () {
                    var mapProp = {
                        center: new google.maps.LatLng(51.508742, -0.120850),
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    console.dir(document.getElementById("googleMap"));
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