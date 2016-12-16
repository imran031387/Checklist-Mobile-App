'use strict';

gurdian.factory('emailService',function ($http, $q) {

    var emailServiceFactory = {};

    emailServiceFactory.send = function(name, email, title, description){
        $http({
            method: 'POST',
            url: 'http://mimemessage.cagaidea.com/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: { name: name, email: email, title:title, description:description }
        }).then(function successCallback(response) {
            console.log(JSON.stringify(response));
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error');
        });
        }

    return emailServiceFactory;
});