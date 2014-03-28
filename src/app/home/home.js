'use strict';

var HomeCtrl = require("./home-controller");
var HomeSubNavCtrl = require("./home-subnav/home-subnav-controller");

module.exports = angular.module('app.home', [
    'home/home.tpl.html',
    'home/home-subnav/home-subnav.tpl.html',
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
            },
            "subNav": {
                controller: 'HomeSubNavCtrl',
                templateUrl: 'home/home-subnav/home-subnav.tpl.html'
            }
        },
        data: {
            pageTitle: 'Home'
        }
    });
    
})
.controller('HomeCtrl', ['$scope',HomeCtrl])
.controller('HomeSubNavCtrl', ['$scope',HomeSubNavCtrl]);
