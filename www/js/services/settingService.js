'use strict';

gurdian.factory('settingService',function ($http, $q, $window) {

    var settingServiceFactory = {};

    settingServiceFactory.setSettings = function(notificationStatus, contactNumber, rangeValueInterval, rangeValueDelay){
           var settings = {
               'notificationStatus': notificationStatus,
               'contactNumber': contactNumber,
               'rangeValueInterval': rangeValueInterval,
               'rangeValueDelay': rangeValueDelay
           }
           $window.localStorage.setItem('settings',JSON.stringify(settings))
        }

    settingServiceFactory.getSettings = function(){
           return $window.localStorage.getItem('settings')
    }

    settingServiceFactory.removeSettings = function(){
        $window.localStorage.removeItem('settings')

    }

    return settingServiceFactory;

});