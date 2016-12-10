angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('LoginCtrl', function($scope, $state, $cordovaSQLite, authToken, authService, $ionicPopup, $firebase, $firebaseAuth) {


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
              console.log(authToken.getToken());
              $state.go('app.checklist');
          }).catch(function(error) {
              console.error("Authentication failed:", error);
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
