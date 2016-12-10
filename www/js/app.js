
// var db = null;
var gurdian = angular.module('gurdian', ['ionic', 'ionic-material', 'ionMdInput', 'firebase', 'ngCordova', 'starter.controllers']);

gurdian.run(function($ionicPlatform, $cordovaSQLite, $rootScope, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


      // db = $cordovaSQLite.openDB({name:"gurdian.db", location:'default'});
      // $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT)');
  });
})




.config(function() {
    var config = {
        apiKey: "AIzaSyBeCX6qUcZuMDfEy4sg7v1rTC4UID_s2Gk",
        authDomain: "checklist-1e869.firebaseapp.com",
        databaseURL: "https://checklist-1e869.firebaseio.com",
        storageBucket: "checklist-1e869.appspot.com",
        messagingSenderId: "383983457787"
    };
    firebase.initializeApp(config);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

       .state('login', {
         url: '/login',
         templateUrl: 'templates/login.html',
         controller: 'LoginCtrl'

       })
      .state('app', {
        url: '/app',
        abstract: false,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('register', {
          url: '/register',
          abstract: false,
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl'
      })
      .state('app.settings', {
          url: '/settings',
          views: {
              'menuContent': {
                  templateUrl: 'templates/settings.html'
              }
          }
      })
      .state('app.checklist', {
        url: '/checklist',
        views: {
          'menuContent': {
            templateUrl: 'templates/checklist.html'
          }
        }
      })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
