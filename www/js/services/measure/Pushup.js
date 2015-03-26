
Starter_Service
.factory('PushupMonitor', function ($rootScope, $timeout, SoundService) {


    var checkSensor = function () {
        if (navigator.proximity == null) {
            console.log("cannot find navigator.proximity");
            return false;
        } else {
            return true;
        }
    }

    var PushupMonitor = function () {
        var proximitysensor = {
        };

        var cfg = {
            frequency:100
        }


       

        this.WatchStart = function (on_approch_callback) {

            navigator.proximity.enableSensor();

          
            proximitysensor.id = window.setInterval(function () {

                navigator.proximity.getProximityState(function (val) { // on success
                    var timestamp = new Date().getTime();
                    if (timestamp - proximitysensor.lastemittedtimestamp > 1000) { // test on each 1 secs
                        if (proximitysensor.lastval == 1 && val == 0) { // far => near changed
                            proximitysensor.lastemittedtimestamp = timestamp;
                            proximitysensor.lastval = val;
                            on_approch_callback(timestamp);
                        }
                    }
                    proximitysensor.lastval = val;
                });
            }, cfg.frequency);
        }


        this.WatchStop = function () {
            window.clearInterval(proximitysensor.id);
            navigator.proximity.disableSensor();
        };

    }


    return {
        sensor: function () {

            if (checkSensor()) {
                return new PushupMonitor();
            } else {
                return null;
            }

            
        }
    }

})