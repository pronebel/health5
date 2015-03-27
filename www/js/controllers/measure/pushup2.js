Starter_Controller.controller("Push2Ctrl", ['$scope', '$location', '$rootScope', 'PushupMonitor',
    function ($scope, $location, $rootScope, pushupMonitor) {

      

        $scope.state = {
            count: 0,
            sort: 0
        }

        $scope.timecounter = {
            days:"00",hours:"00",minutes:"00",seconds:"00"
        }


        $scope.pushup = pushupMonitor.sensor();

        if (!$scope.pushup) {
            return;
        }

        window.pushup = $scope.pushup;
      

        $scope.getActionName = function () {

            return $scope.state.sort == 0 ? "Start" : "Stop";
        }
        $scope.stop = function () {
            console.log("finished");
            $scope.state.sort = 0;
          
            $scope.pushup.WatchStop();

        }

        $scope.getDurationTime = function (timestamp) {
            var duration = moment.duration(timestamp);
            var days = duration.days();
            var hours = duration.hours();
            var minutes = duration.minutes();
            var seconds = duration.seconds();

            var times = {};
          
            times.days = days;
            times.hours = (hours < 10 ? "0" + hours : hours);
            times.minutes = (minutes < 10 ? "0" + minutes : minutes);
            times.seconds = (seconds < 10 ? "0" + seconds : seconds);

            console.log(times);
            return times;

        }

        $scope.train = function () {

            $scope.timecounter = {
                days: "00", hours: "00", minutes: "00", seconds: "00"
            }
            $scope.pushup.WatchStart(function (count,timestamp) {
                console.log(count + "--" + timestamp);
                $scope.state.count = count;
               
                $scope.timecounter = $scope.getDurationTime(timestamp);
                //console.log($scope.timecounter);
            });
            
        }
        $scope.start = function () {
            if ($scope.state.sort == 1) {
                $scope.state.sort = 0;
                $scope.stop();
            } else {
                $scope.state.sort = 1;
                $scope.train();
            }
        };

    }]);