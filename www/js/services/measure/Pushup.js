
Starter_Service
.factory('PushupMonitor', function ( $timeout, SoundService) {


    var checkSensor = function () {
        if (navigator.proximity == null) {
            console.log("cannot find navigator.proximity");
            return false;
        } else {
            return true;
        }
    }

    var PushupMonitor = function () {

        var timeBasic = 0;
        var count = 0;

        var __sensor;

        var cfg = {
            frequency: 100,
            enable: false
        }


        var init = reset = function () {
            __sensor = {
                lastStamp: null,
                lastVal: null
            };
            timeBasic = 0;
            count = 0;
        }



        var watchCheck = function () {
     
            navigator.proximity.getProximityState(function (val) { // on success
                var timestamp = new Date().getTime();
                //console.log(timestamp + "," + val);


                if (__sensor.lastStamp == null && __sensor.lastVal == null) {
                    __sensor = {
                        lastStamp: timestamp,
                        lastVal: val
                    };
                  
                } else {  //if (timestamp - __sensor.lastStamp > 500)  // test on each 1 secs 
                    //console.log(__sensor.lastVal+","+val);
                    
                    if (__sensor.lastVal == 1 && val == 0) { // far => near changed
                        console.log(count);
                        count++;
                        __sensor.lastStamp = timestamp;
                        __sensor.lastVal = val;
                 
                   
                       
                    } else {
                        __sensor.lastVal = val;
                    }
                  
                }
                console.log(timestamp + "," + timeBasic);
                cfg.callback(count, (timestamp - timeBasic));
               
            });

            if (cfg.enable == true) {
          
                $timeout(watchCheck, cfg.frequency);
            }
        }
       
        this.getConfig = function () {
            return cfg;
        }

        this.WatchStart = function (callback) {

            init();
            console.log("WatchStart");
            timeBasic = new Date().getTime();
            navigator.proximity.enableSensor();
            cfg.enable = true;
            cfg.callback = callback;


            watchCheck();
        }


        this.WatchStop = function () {
            console.log("WatchStop");
            navigator.proximity.disableSensor();
            cfg.enable = false;


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