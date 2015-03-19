Starter_Controller.controller("PlankCtrl", ['$scope', '$location', '$rootScope', 'PlankService',
    function ($scope, $location, $rootScope, PlankService) {

        $scope.timerRunning = false;

        $scope.startTimer = function (){

            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;

        };

        $scope.stopTimer = function (){
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
        };




        $scope.trakerId = null;


        $scope.state={


            sort:0
        }

        $scope.getActionName =function(){

            return $scope.state.sort ==0 ? "Start":"Stop";
        }
        $scope.stop = function(){
            console.log("finished");
            $scope.state.sort = 0;
            $scope.stopTimer();

        }

        $scope.train=function(){
            $scope.startTimer();

            PlankService.testing(function(){
                $scope.stop();
            })

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