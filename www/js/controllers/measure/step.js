Starter_Controller.controller("StepCtrl", ['$scope', '$location', '$rootScope','$timeout',
    function ($scope, $location, $rootScope,$timeout) {

        $scope.state = {
            sort: 0
        }
        $scope.count=0;
        $scope.timerRunning = false;
        $scope.watchInterId = null;


        //获取当前步数的Callback
        var getStepCallBack=function(stepCount){
            
            console.log(arguments);
            console.log(stepCount);

            $scope.count=  stepCount;
            
        }

        //获取步数
        var getStep = function(){

            window.plugins.StepListener.getCurrentStep(getStepCallBack);
            if($scope.state.sort==1){

                $timeout(function(){
                    getStep()
                },100);
            }
        }

        $scope.getActionName =function(){

            return $scope.state.sort ==0 ? "Start":"Stop";
        }

        //停止计步
        $scope.stop = function(){
            console.log("finished");
            $scope.state.sort = 0;
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;

            window.plugins.StepListener.stopWatch();

        }

        //开始计步
        $scope.train=function(){
            $scope.count=0;
            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;

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