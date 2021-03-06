Starter.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {







    var configProperties = {
        views: {
            maxCache: 5,
            forwardCache: true,
            transition: 'android'
        },

        backButton: {
            icon: 'ion-chevron-left',
            text: '返回',
            previousTitleText: false
        },

        tabs: {
            style: 'striped',
            position: 'bottom'
        },
        templates: {
            // maxPrefetch: 0
        }
    };
    $ionicConfigProvider.setPlatformConfig('android', configProperties);





    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })

        // Each tab has its own nav history stack:

        .state('tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'DashCtrl'
                }
            }
        })

        .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/tab-friends.html',
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('tab.friend-detail', {
            url: '/friend/:friendId',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/friend-detail.html',
                    controller: 'FriendDetailCtrl'
                }
            }
        })

        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        })
        /////////////////////////////////////////////////////////
        .state('pushup', {
            url: '/pushup',
            templateUrl: 'js/controllers/measure/pushup.html',
            controller: 'PushCtrl'
        })
         .state('pushup2', {
             url: '/pushup2',
             templateUrl: 'js/controllers/measure/pushup2.html',
             controller: 'Push2Ctrl'

         })
        .state('plank', {
            url: '/plank',
            templateUrl: 'js/controllers/measure/plank.html',
            controller: 'PlankCtrl'

        })
        .state('gym', {
            url: '/gym',
            templateUrl: 'js/controllers/measure/list.html',
            controller: 'GymCtrl'

        })

        .state('adjust', {
            url: '/adjust',
            templateUrl: 'js/controllers/measure/adjust.html',
            controller: 'AdjustCtrl'

        })

        .state('workout', {
            url: '/workout',
            templateUrl: 'js/controllers/workout/smart.html',
            controller: 'WorkoutCtrl'

        })
        .state('step', {
            url: '/step',
            templateUrl: 'js/controllers/measure/step.html',
            controller: 'StepCtrl'

        })










    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});
