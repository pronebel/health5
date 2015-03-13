Starter_Controller.controller("PushCtrl", ['$scope', '$location', '$rootScope', 'PushUp',
    function ($scope, $location, $rootScope, pushup) {


        $scope.state={
            count:0,
            time:"00:00:00",
            sort:0
        }

        $scope.getActionName =function(){

            return $scope.state.sort ==0 ? "Start":"Stop";
        }
        $scope.stop = function(){
            console.log("finished");
            $scope.state.sort = 0;
        }

        $scope.train=function(){

            var trackId = pushup.start({
                target: 5,
                change: function (args) {
                    $scope.stat.count = args.current;
                },
                finish: function (args) {
                    pushup.end(trackId);
                    $scope.stop();
                }
            });
        }
        $scope.start = function () {
            if ($scope.state.sort == 1) {
                $scope.state.sort = 0;
            } else {
                $scope.state.sort = 1;
                $scope.train();
            }
        };

    }]);