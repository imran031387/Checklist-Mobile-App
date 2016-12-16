'use strict';

gurdian.factory('authToken',function ($window) {

        var authTokenFactory = {};

    authTokenFactory.getToken = function () {
        return $window.localStorage.getItem('firebase:authUser:AIzaSyBeCX6qUcZuMDfEy4sg7v1rTC4UID_s2Gk:[DEFAULT]')
    }

    authTokenFactory.removeToken = function () {
        $window.localStorage.removeItem('firebase:authUser:AIzaSyBeCX6qUcZuMDfEy4sg7v1rTC4UID_s2Gk:[DEFAULT]')
    }

    authTokenFactory.setPrimaryFlag = function (id , status) {
        $window.localStorage.setItem('local-notification-' + id , status)
    }

    authTokenFactory.getPrimaryFlag = function (id) {
        return $window.localStorage.getItem('local-notification-' + id )
    }

    return authTokenFactory;
});