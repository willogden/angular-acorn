'use strict';

var ListingsCtrl = require("./listings-controller");
var ListingsSubNavCtrl = require("./listings-subnav/listings-subnav-controller");

module.exports = angular.module('app.listings', [
    'listings/listings.tpl.html',
    'listings/listings-subnav/listings-subnav.tpl.html',
    'ui.router',
    'ngTouch'
])
.config(function config($stateProvider) {

    $stateProvider.state('listings', {
        url: '/listings',
        views: {
            "main": {
                controller: 'ListingsCtrl',
                templateUrl: 'listings/listings.tpl.html'
            },
            "subNav": {
                controller: 'ListingsSubNavCtrl',
                templateUrl: 'listings/listings-subnav/listings-subnav.tpl.html'
            }
        },
        data: {
            pageTitle: 'Listings'
        }
    });
    
})
.controller('ListingsCtrl', ['$scope', 'listingsService', ListingsCtrl])
.controller('ListingsSubNavCtrl', ['$scope',ListingsSubNavCtrl]);
