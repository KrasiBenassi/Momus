(function () {
    var app;
    var track_id = null; // Name/ID of the exercise
    var watch_id = null; // ID of the geolocation
    var tracking_data = []; // Array containing GPS position objects
    var tracks_recorded = 0;
    var currentData;

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: kendo.observable({
                                       title: 'Home',
                                       checkConnection: function () {
                                           var eventHandler = new EventHandler();
                                           eventHandler.run();
                                           if (navigator.network.connection.type == Connection.NONE) {
                                               $("#home-network-button").text('No Internet Access');
                                           } else {
                                               $("#home-network-button").text('Internet access enabled');
                                           }
                                       },
                                       clearLocalStorage: function () {
                                           window.localStorage.clear();
                                       },
                                       seedGpsData: function () {
                                           window.localStorage.setItem('Sample track', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');
                                       }
                                   }),
            track: kendo.observable({
                                        title: 'Track',
                                        startTracking: function () {
                                            watch_id = navigator.geolocation.watchPosition(
                                                function (position) {
                                                    tracking_data.push(position);
                                                },
                                                function (error) {
                                                    console.log(error);
                                                }, {
                                                    frequency: 3000,
                                                    enableHighAccuracy: true
                                                });

                                            // Tidy up the UI
                                            track_id = $("#track-id").val();
                    
                                            if (track_id) {
                                                $("#track-id").hide();

                                                $("#start-tracking-status").html("Tracking workout: <strong>" + track_id + "</strong>");
                                            } else {
                                                $("#start-tracking-status").html("You must enter some ID or name") 
                                            }
                                        },
                                        stopTracking: function () {
                                            navigator.geolocation.clearWatch(watch_id);

                                            window.localStorage.setItem(track_id, JSON.stringify(tracking_data));

                                            watch_id = null;
                                            tracking_data = [];

                                            // Tidy up the UI
                                            $("#track-id").val("").show();

                                            $("#start-tracking-status").html("Stopped tracking workout: <strong>" + track_id + "</strong>");
                                            navigator.notification.vibrate(500);
                                        }
                                    }),
            history: kendo.observable({
                                          title: 'History',
                                          showMap: function () {
                                              var myCoords = new google.maps.LatLng(currentData[0].coords.latitude, currentData[0].coords.longitude);

                                              var myOptions = {
                                                  zoom: 15,
                                                  center: myCoords,
                                                  mapTypeId: google.maps.MapTypeId.ROADMAP
                                              };

                                              var map = new google.maps.Map(document.getElementById("google-map"), myOptions);
                    
                                              var trackCoords = [];

                                              // Add each GPS entry to an array
                                              for (i = 0; i < currentData.length; i++) {
                                                  trackCoords.push(new google.maps.LatLng(currentData[i].coords.latitude, currentData[i].coords.longitude));
                                              }
                    
                                              // Plot the GPS entries as a line on the Google Map
                                              var trackPath = new google.maps.Polyline({
                                                                                           path: trackCoords,
                                                                                           strokeColor: "#FF0000",
                                                                                           strokeOpacity: 1.0,
                                                                                           strokeWeight: 2
                                                                                       });

                                              // Apply the line to the map
                                              trackPath.setMap(map);
                                          },
                                          loadHistory: function () {
                                              tracks_recorded = window.localStorage.length;

                                              $("#tracks-recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");

                                              $("#history-tracklist").empty();

                                              for (i = 0; i < tracks_recorded; i++) {
                                                  var key = window.localStorage.key(i);
                                                  var data = window.localStorage.getItem(key);
                                                  currentData = JSON.parse(data);
                                                  data = JSON.parse(data);

                                                  //calculate duration
                                                  var final_time_m = calculateDuration(data).finalMinutes;
                                                  var final_time_s = calculateDuration(data).finalSeconds;

                                                  //calculate distance
                                                  var total_km = calculateDistance(data);

                                                  total_km_rounded = total_km.toFixed(2);

                                                  $("#history-tracklist")
                                                      .append("<li><strong>" + (i + 1) + "." + key +
                                                              "</strong>:<br/>Duration=" + final_time_m + " min and " + final_time_s + " sec" + "<br/>Distance: " + total_km_rounded + " km</li>");
                                              }
                                          }
                                      })
        }
    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        var eventHandler = new EventHandler();
        eventHandler.run();
        app = new kendo.mobile.Application(document.body, {
                                               transition: 'slide',
                                               skin: 'flat',
                                               initial: 'views/home.html'
                                           });
    }, false);
    
    
    function calculateDuration(data) {
        start_time = new Date(data[0].timestamp).getTime();
        end_time = new Date(data[data.length - 1].timestamp).getTime();

        total_time_ms = end_time - start_time;
        total_time_s = total_time_ms / 1000;

        final_time_m = Math.floor(total_time_s / 60);
        final_time_s = total_time_s - (final_time_m * 60);
        final_time_s = final_time_s.toFixed(0);
        return{
            finalMinutes: final_time_m,
            finalSeconds: final_time_s
        }
    };
    
    function calculateDistance(data) {
        total_km = 0;

        for (j = 0; j < data.length; j++) {
            if (j == (data.length - 1)) {
                break;
            }

            total_km += gps_distance(data[j].coords.latitude, data[j].coords.longitude, data[j + 1].coords.latitude, data[j + 1].coords.longitude);
        }
        return total_km;
    };
}());