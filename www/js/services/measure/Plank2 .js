
Starter_Service
.factory('PlankMonitor', function ($rootScope,$timeout, SoundService, $cordovaDeviceOrientation) {
   


    //监控位置在手臂，左右都可以
    var Plank = function () {

        var __this = this;
        var _watch;
        function init() {
            __this.cfg = {
                watch: null,
                AbsYStop: 30,
                basicY: 0,
                frequency:100
            }

            _watch = null;

        }

   

        var watching = function (finishedFunc) {
         
            _watch = $cordovaDeviceOrientation.watchHeading({ frequency: __this.cfg.frequency });

            _watch.then(null, function (error) {}, function (result) {

                console.log("=============" + result.y);

                if (__this.cfg.basicY == 0) {// 标准动作的检测，进入手臂的标准动作后，才开始计时。 ||basic|-90|> AbsYStop;
                    basicY = result.y;

                } else {
                    var tempY = Math.abs(basicY - result.y);
                    if (tempY > AbsYStop) {
                        testingEnd(finishedFunc);
                    }
                }



            }, function (err) {

            });
        }


        this.stop = function (finishedFunc) {

            $cordovaDeviceOrientation.clearWatch(_watch.watchID);
            finishedFunc();
            SoundService.tip();

        }


        this.start = function (finishedFunc) {
            //10s后滴的一声开始

            SoundService.tip();
            watching(finishedFunc);


        }


    }



    return {

        testing: testing

    }
})