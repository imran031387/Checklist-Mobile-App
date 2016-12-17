angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, authToken, settingService) {
    // logout functionality for the app
  $scope.logout = function () {
      authToken.removeToken();
      settingService.removeSettings();
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

.controller('SettingsCtrl', function($scope, $stateParams, $state, settingService, $cordovaToast) {

  var settings = JSON.parse(settingService.getSettings());
    if(settings){
        $scope.notificationStatus = settings.notificationStatus;
        $scope.contactNumber = settings.contactNumber;
        $scope.rangeValueInterval = settings.rangeValueInterval;
        $scope.rangeValueDelay = settings.rangeValueDelay;
    }

    $scope.saveSettings = function (notificationStatus, contactNumber, rangeValueInterval, rangeValueDelay) {
      settingService.setSettings(notificationStatus, contactNumber, rangeValueInterval, rangeValueDelay);
        $cordovaToast.show('Settings Saved!', 'short', 'bottom').then(function(success) {
            // console.log("The toast was shown");
        }, function (error) {
            // console.log("The toast was not shown due to " + error);
        });
        //$state.go('app.settings');
  }


})
.controller('ChecklistCtrl', function($scope, $rootScope, $stateParams, $state, $cordovaGeolocation, $cordovaLocalNotification, $ionicModal, $ionicPopup, $timeout, authToken, settingService, emailService) {

    $rootScope.$on('$cordovaLocalNotification:trigger',
        function (event, notification, state) {
            var delay = JSON.parse(settingService.getSettings()).rangeValueDelay;
            var email = JSON.parse(settingService.getSettings()).contactNumber;
            var name = 'User';
            var title = notification.title;
            var description = notification.text;


            // Getting the current location.
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.lat  = position.coords.latitude
                $scope.long = position.coords.longitude
                }, function(err) {
                    // error
                });

            $timeout(function() {
                $scope.email(name, email, title, description, $scope.lat, $scope.long)
                // alert("Email Send Successfully:"+$scope.lat+" "+$scope.long);
            },delay*60*1000);// (1*60*1000) 1min delay.
        });

    $rootScope.$on('$cordovaLocalNotification:click',
        function (event, notification, state) {
            $scope.ok(notification)
        });

    $scope.email = function(name, email, title, description, lat, long){
        emailService.send(name, email, title, description, lat, long);
    }


    $scope.add = function(title,description) {
        var interval = JSON.parse(settingService.getSettings()).rangeValueInterval;
        var id = Math.floor(Math.random() * (10000-1000+1)) + 1000;
        var now = new Date().getTime();
        var alarmTime = new Date(now + interval * 60 * 1000);
        $cordovaLocalNotification.schedule({
            id: id,
            at: alarmTime,
            text: description,
            title: title,
        }).then(function () {
            console.log("The notification has been set:ID" + id);
            authToken.setPrimaryFlag(id,'false')
            $scope.getAllScheduled()
            $scope.closeModal()
        });
    };

    $scope.getAllScheduled = function () {
        $cordovaLocalNotification.getAllScheduled().then(function(data) {
            $scope.tasks = data;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.cancelSchedule = function (id) {
        var confirmPopup = $ionicPopup.alert({
            title: 'Are you Sure!',
            template: 'Do you want to cancel the Task?',
            buttons: [
                { text: 'No', onTap: function(e) { return false; } },
                { text: 'Yes', type: 'button-positive',onTap: function(e) { return  true; }},
            ]
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log(res);
                $cordovaLocalNotification.cancel(id).then(function(data) {
                    console.log('deleted');
                    $scope.getAllScheduled()
                });
            }
        });

    }
    // Trigger this function when user clicks the local notification.
    $scope.ok = function (notification) {
        var confirmPopup = $ionicPopup.alert({
            title: 'Are you OK?',
            template: 'Please ensure that you are OK by clicking this popup.',
            buttons: [
                { text: 'Yes', type: 'button-positive',onTap: function(e) { return  true; }},
            ]
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log(res);
                authToken.setPrimaryFlag(notification.id,'true');
                $scope.getAllScheduled()
                console.log("notification clicked so it's broadcast.");
            }
        });

    }


    $ionicModal.fromTemplateUrl('modal-task.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });




});
