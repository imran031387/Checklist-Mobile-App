angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, authToken) {
    // logout functionality for the app
  $scope.logout = function () {
      console.log('logout triggered baby');
      authToken.removeToken();
      $state.go('login');

  }
})

.controller('LoginCtrl', function($scope, $state, $cordovaSQLite, authToken, authService, $ionicPopup, $firebase, $firebaseAuth, $ionicLoading) {
    // check whether user is logged in or not.
    var sessionAlive = authToken.getToken();
    if(sessionAlive){
        $state.go('app.checklist');
    }

    $scope.error = [];
    // Check for username & password empty value
    $scope.isNullOrEmptyOrUndefined = function (value) {
        return !value;
    }
      // When button is clicked, the popup will be shown...
      $scope.showConfirm = function(message) {
        var confirmPopup = $ionicPopup.alert({
          title: 'Error Message',
          template: message
        });
        // confirmPopup.then(function(res) {
        //   if(res) {
        //     console.log('Sure!');
        //   }
        // });
      };
    // Register callback function
    $scope.memberRegister = function () {
        $state.go('register');
    }

      $scope.loggedIn = function (username, password) {
          $scope.errors = [];
          $scope.loading = true;
          // Check for the empty value
          if( $scope.isNullOrEmptyOrUndefined(username) || $scope.isNullOrEmptyOrUndefined(password) ){
              $scope.loading = false;
              $scope.showConfirm('Username & Password Cannot be empty.');
          }
          // User login functionality and error check.
          $scope.authObj = $firebaseAuth();
          $scope.authObj.$signInWithEmailAndPassword(username, password).then(function(firebaseUser) {
              // console.log("Signed in as:", firebaseUser.uid);
              // console.log(authToken.getToken());
              $state.go('app.checklist');
              $scope.loading = false;
          }).catch(function(error) {
              $scope.errors.push(error.message)
              if($scope.errors.length == 0){
                  $state.go('app.checklist');
                  $scope.loading = false;
              }else{
                  $scope.showConfirm(error.message);
                  $scope.loading = false;
              }
          });

      };
})

.controller('RegisterCtrl', function($scope, $state, $cordovaSQLite, $ionicPopup, $firebase, $firebaseAuth) {

    // When button is clicked, the popup will be shown...
    $scope.showConfirm = function(message) {
        var confirmPopup = $ionicPopup.alert({
            title: 'Error Message',
            template: message
        });
        // confirmPopup.then(function(res) {
        //   if(res) {
        //     console.log('Sure!');
        //   }
        // });
    };

    // Check for username & password empty value
    $scope.isNullOrEmptyOrUndefined = function (value) {
        return !value;
    }

    // // Check whether user is registered to the app
    // $scope.authObj = $firebaseAuth();
    // var firebaseUser = $scope.authObj.$getAuth();
    // if (firebaseUser) {
    //     // console.log("Signed in as:", firebaseUser.uid);
    //     $scope.isRegistered = true;
    // } else {
    //     // console.log("Signed out");
    //     $scope.isRegistered = false;
    // }

    // Registering the user function
    $scope.userRegister = function (regusername, regpassword) {
        $scope.loading = true;
        if( $scope.isNullOrEmptyOrUndefined(regusername) || $scope.isNullOrEmptyOrUndefined(regpassword) ){
            $scope.loading = false;
            $scope.showConfirm('Username & Password Cannot be empty.');
        }
        // Register the user on firbase.
        $scope.authObj = $firebaseAuth();
        $scope.authObj.$createUserWithEmailAndPassword(regusername, regpassword).then(function(firebaseUser) {
                console.log("User " + firebaseUser.uid + " created successfully!");
                $scope.loading = false;
                $state.go('login');
            }).catch(function(error) {
            console.error("Error: ", error);
            $scope.showConfirm(error.message);
            $scope.loading = false;
        });

    };
})

.controller('SettingsCtrl', function($scope, $stateParams, $state) {
  $state.go('app.settings');
});
