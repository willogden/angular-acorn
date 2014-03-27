'use strict';

var HomeCtrl = require("./home-controller");

module.exports = angular.module('app.home', [
    'home/home.tpl.html',
    'ui.router',
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
.controller('HomeCtrl', ['$scope', '$http',HomeCtrl]);
