Starter_Controller.controller('DashCtrl', function ($scope) {

})

    .controller('ChatsCtrl', function ($scope, Chats, $cordovaNativeAudio, $timeout) {
        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        }


        $cordovaNativeAudio
            .preloadSimple('click', 'audio/di.mp3')
            .then(function (msg) {
                console.log(msg);
            }, function (error) {
                alert(error);
            });

        $cordovaNativeAudio
            .preloadComplex('music', 'audio/music.mp3', 1, 1)
            .then(function (msg) {
                console.log(msg);
            }, function (error) {
                console.error(error);
            });

        $scope.play = function () {
            $cordovaNativeAudio.play('click');
            $cordovaNativeAudio.loop('music');

            // stop 'music' loop and unload
            $timeout(function () {
                $cordovaNativeAudio.stop('music');

                $cordovaNativeAudio.unload('click');
                $cordovaNativeAudio.unload('music');
            }, 1000 * 60);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
