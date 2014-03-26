'use strict';

var HomeCtrl = require("./home-controller");

module.exports = angular.module('angularAcornApp.home', [
    'home/home.tpl.html',
    'ui.state',
    'ngTouch'
])
.config(function config($stateProvider) {

    $stateProvider.state('home', {
        url: '/home',
        views: {
            "main": {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.tpl.html'
            }
        },
        data: {
            pageTitle: 'Home'
        }
    });
    
})
.controller('HomeCtrl', HomeCtrl);
