// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var Starter = angular.module('starter', [
    'ionic', 'starter.controllers', 'starter.services','ngCordova','timer','LocalStorageModule'
]);//


Starter.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //  $rootScope.MAIN_BODY_HEIGHT = MAIN_BODY_HEIGHT;

  });
})


var Starter_Controller = angular.module('starter.controllers', []);
var Starter_Service = angular.module('starter.services', ['ngResource'])
