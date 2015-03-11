Starter_Controller.controller("PushCtrl",['$scope','$location','$rootScope',function($scope, $location,$rootScope){
    console.log("INTRO PAGE START");

    //ticketService.addTrackingItem();
    $scope.count=2;
    $scope.goToTest = function() {
     /*   var trackId = pushUp.add();
        pushUp.setChangedCallback(trackId, function(args){
            $scope.count=args.current;
        });
        pushUp.setFinishedCallback(trackId, function(args) {
            alert("lajdlksdf");
            $scope.count = "DONE";
            pushUp.del(trackId);

        });*/
    };

}]);