angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, authToken) {
    // logout functionality for the app
  $scope.logout = function () {
      console.log('logout triggered baby');
      authToken.removeToken();
      $state.go('login');

  }
})

.controller('LoginCtrl', function($scope, $state, $cordovaSQLite, authToken, authService, $ionicPopup, $firebase, $firebaseAuth) {
    // check whether user is logged in or not.
    var sessionAlive = authToken.getToken();
    if(sessionAlive){
        $state.go('app.checklist');
    }

    $scope.error = [];


      // When button is clicked, the popup will be shown...
      $scope.showConfirm = function() {

        var confirmPopup = $ionicPopup.alert({
          title: 'Error Message',
          template: 'Incorrect Username or Password.'
        });

        // confirmPopup.then(function(res) {
        //   if(res) {
        //     console.log('Sure!');
        //   }
        // });

      };

    $scope.memberRegister = function () {
        $state.go('register');
    }

      $scope.loggedIn = function (username, password) {
        // $scope.errors = [];
        // var user = authToken.getUser();
        // if(user.username != username){
        //   $scope.errors.push('Incorrect Username.');
        // }
        // if(user.password != password){
        //   $scope.errors.push('Incorrect Password.');
        // }
        //
        // if($scope.errors.length == 0){
        //   $state.go('app.checklist');
        // }else{
        //   $scope.showConfirm();
        // }


          $scope.authObj = $firebaseAuth();
          $scope.authObj.$signInWithEmailAndPassword(username, password).then(function(firebaseUser) {
              // console.log("Signed in as:", firebaseUser.uid);
              // console.log(authToken.getToken());
              $state.go('app.checklist');
          }).catch(function(error) {
              // console.error("Authentication failed:", error);
              // $scope.errors.push(error.message)
              console.log(error.message);
          });
      };
})

.controller('RegisterCtrl', function($scope, $state, $cordovaSQLite, $firebase, $firebaseAuth) {
    // Check whether user is registered to the app
    $scope.authObj = $firebaseAuth();
    var firebaseUser = $scope.authObj.$getAuth();

    if (firebaseUser) {
        console.log("Signed in as:", firebaseUser.uid);
        $scope.isRegistered = true;
    } else {
        console.log("Signed out");
        $scope.isRegistered = false;
    }


    // Registering the user
    $scope.userRegister = function (regusername, regpassword) {
        $scope.authObj = $firebaseAuth();
        $scope.authObj.$createUserWithEmailAndPassword(regusername, regpassword)
            .then(function(firebaseUser) {
                console.log("User " + firebaseUser.uid + " created successfully!");
            }).catch(function(error) {
            console.error("Error: ", error);
        });
        $state.go('login');
    };
})

.controller('SettingsCtrl', function($scope, $stateParams, $state) {
  $state.go('app.settings');
});
