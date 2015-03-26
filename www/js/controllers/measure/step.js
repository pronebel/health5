Starter_Controller.controller("StepCtrl", ['$scope', '$location', '$rootScope','$timeout',
    function ($scope, $location, $rootScope,$timeout) {


        $scope.count=0;

        $scope.watchInterId = null;


        var getStepCallBack=function(stepCount){


            console.log(arguments);
            console.log(stepCount);


            $scope.count=  stepCount;





        }

        var getStep = function(){

            window.plugins.StepListener.getCurrentStep(getStepCallBack);
            if($scope.state.sort==1){

                $timeout(function(){
                    getStep()
                },100);
            }
        }


        $scope.state={


            sort:0
        }



        $scope.timerRunning = false;

        $scope.startTimer = function (){

            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;

        };

        $scope.stopTimer = function (){
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
        };








        $scope.getActionName =function(){

            return $scope.state.sort ==0 ? "Start":"Stop";
        }
        $scope.stop = function(){
            console.log("finished");
            $scope.state.sort = 0;
            $scope.stopTimer();
            window.plugins.StepListener.stopWatch();

        }

        $scope.train=function(){
            $scope.count=0;
            $scope.startTimer();
            window.plugins.StepListener.startWatch();



            getStep();


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