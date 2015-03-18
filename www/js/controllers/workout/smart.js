Starter_Controller.controller("WorkoutCtrl",['$scope','$location','$rootScope','localStorageService','$ionicModal',
    function($scope, $location,$rootScope,localStorageService,$ionicModal){


        $ionicModal.fromTemplateUrl('js/controllers/workout/pushupModel.html',
            {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.exerciseModel = modal;
            });


        $scope.trainIndex = 0;

        $scope.groups= [
            {
                name:"俯卧撑",
                type:"FUWOCHENG",
                goal:5,
                unit:"个",
                count:3
            },
            {
                name:"俯卧撑",
                type:"FUWOCHENG",
                goal:10,
                unit:"个"
            },
            {
                name:"平板撑",
                type:"PINGBANCHENG",
                goal:3,
                unit:"分"
            },
            {
                name:"平板撑",
                type:"PINGBANCHENG",
                goal:5,
                unit:"分"
            }
        ];





        var startTrain = function(){

            var curTrainItem =$scope.groups[$scope.trainIndex];

        }


        $scope.openModal = function() {
            $scope.exerciseModel.show();



            $scope.group[0].count= 50;
        };
        $scope.closeModal = function() {
            $scope.exerciseModel.hide();
        };






    }]);