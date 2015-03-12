Starter_Controller.controller("PushCtrl",['$scope','$location','$rootScope','PushUp','$cordovaNativeAudio',
    function($scope, $location,$rootScope,pushup,$cordovaNativeAudio){



    $cordovaNativeAudio
        .preloadSimple('getOne', 'audio/di.mp3')
        .then(function (msg) {
            console.log(msg);
        }, function (error) {
            alert(error);
        });

    //ticketService.addTrackingItem();
    $scope.count=0;
    $scope.goToTest = function() {
        $cordovaNativeAudio.play('getOne');
         pushup.start({
            target:5,
            change:function(args){
                $cordovaNativeAudio.play('getOne');
                $scope.count=args.current;
            },
            finish: function(args) {
                console.log("finished");
                $scope.count = "~";
                pushup.end(trackId);

            }
        });


    };

}]);