Starter_Controller.controller("GymCtrl",['$scope','$location','$rootScope',
    function($scope, $location,$rootScope){

        $scope.count=0;

         window.plugins.StepListener.getCurrentStep(function(){
            console.log(arguments);
        });


    }]);