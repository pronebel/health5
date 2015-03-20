Starter_Controller.controller("AdjustCtrl",['$scope','$location','$rootScope','adjustService','localStorageService',
    function($scope, $location,$rootScope,adjustService,localStorageService){

        $scope.maxY=0;
        $scope.minY=0;

        $scope.isStart = false;
        $scope.getActionName =function(){

            return $scope.isStart ==false ? "校准":"正在校准";
        }
        $scope.start=function(){

            if($scope.isStart==false){
                $scope.isStart=true;
                adjustService.testing(function(_max,_min){
                    $scope.maxY= parseInt(_max);
                    $scope.minY=parseInt(_min);
                    localStorageService.set("maxY",_max);
                    localStorageService.set("minY",_min);
                    /*localStorageService.set("maxY",-17);
                    localStorageService.set("minY",-85);*/
                    $scope.isStart=false;
                })
            }


        }


    }]);