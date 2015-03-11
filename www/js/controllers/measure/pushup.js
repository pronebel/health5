Starter_Controller.controller("PushCtrl",['$scope','$location','$rootScope','PushUp',function($scope, $location,$rootScope,pushup){
    console.log("INTRO PAGE START");

    //ticketService.addTrackingItem();
    $scope.count=2;
    $scope.goToTest = function() {
        var trackId = pushup.add();
        pushup.setChangedCallback(trackId, function(args){
            $scope.count=args.current;
        });
        pushup.setFinishedCallback(trackId, function(args) {
            console.log("lajdlksdf");
            $scope.count = "DONE";
            pushup.del(trackId);

        });
    };

}]);