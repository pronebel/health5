Starter_Controller.controller("PushCtrl", ['$scope', '$location', '$rootScope', 'PushUp',
    function ($scope, $location, $rootScope, pushup) {

        $scope.timerRunning = false;
        $scope.trakerId = null;


        $scope.state={
            count:0,
            sort:0
        }

        $scope.getActionName =function(){

            return $scope.state.sort ==0 ? "Start":"Stop";
        }
        $scope.stop = function(){
            console.log("finished");
            $scope.state.sort = 0;
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
            pushup.stop($scope.trackId);

        }

        $scope.train=function(){
            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;

            var trackId = pushup.start({
                goal: 12,
                change: function (event,args) {
                    $scope.state.count = args.current;
                },
                finish: function () {
                    $scope.stop();
                }
            });
            $scope.trackId = trackId;
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