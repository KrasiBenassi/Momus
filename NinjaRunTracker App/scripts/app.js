(function () {
    var app;

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: kendo.observable({
                title: 'Home',
                checkConnection: function () {
                    if (navigator.network.connection.type == Connection.NONE) {
                        $("#home_network_button").text('No Internet Access');
                    } else {
                        $("#home_network_button").text('Internet access enabled');
                    }
                }
            }),
            track: kendo.observable({
                title: 'Track',
                startTracking: function () {
                    var mapProp = {
                        center: new google.maps.LatLng(51.508742, -0.120850),
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
                    google.maps.event.addDomListener(window, 'load', initialize);
                }
            }),
            history: {
                title: 'History',
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
                }),
                alert: function (e) {
                    alert(e.data.name);
                }
            }
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


}());