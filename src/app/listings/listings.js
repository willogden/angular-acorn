'use strict';

var ListingsCtrl = require("./listings-controller");

module.exports = angular.module('app.listings', [
    'listings/listings.tpl.html',
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
            }
        },
        data: {
            pageTitle: 'Listings'
        }
    });
    
})
.controller('ListingsCtrl', ['$scope', 'listingsService', ListingsCtrl]);
