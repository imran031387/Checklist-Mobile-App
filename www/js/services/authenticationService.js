'use strict';

gurdian.factory('authService',function ($http, $q, $window, authToken) {

    var authServiceFactory = {};

    authServiceFactory.logout = function(){
           authToken.removeToken();
           authToken.removeUser();
        $window.location='#/login';
        $window.location.reload();
        }

    authServiceFactory.isLoggedIn = function () {
            if(authToken.getToken()){
                return true;
                console.log('true');
            }else{
                return false
                console.log('false');
            }
        }


    return authServiceFactory;

});