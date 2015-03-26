
Starter_Service
.factory('PlankService', function ($rootScope,$timeout, SoundService, $cordovaDeviceOrientation) {
    //监控位置在手臂，左右都可以
    var type = 'plank';
    var _watch = null;


    var AbsYStop = 30;
    var basicX = 0,basicY = 0,basicZ = 0;

    var watching = function (finishedFunc) {
        basicY =0;
        _watch = $cordovaDeviceOrientation.watchHeading({frequency: 100});

        _watch.then(null, function (error) {

        }, function (result) {

            console.log( "============="+result.y);

            if(basicY==0){// 标准动作的检测，进入手臂的标准动作后，才开始计时。 ||basic|-90|> AbsYStop;
                basicY =   result.y ;

            }else{
                var tempY = Math.abs(basicY - result.y);
                if(tempY>AbsYStop){
                    testingEnd(finishedFunc);
                }
            }



        }, function (err) {

        });
    }


    var testingEnd = function (finishedFunc) {

        $cordovaDeviceOrientation.clearWatch(_watch.watchID);
        finishedFunc();
        SoundService.tip();

    }


    var testing = function (finishedFunc) {
        //10s后滴的一声开始

        SoundService.tip();
        watching(finishedFunc);


    }


    return {

        testing: testing

    }
})