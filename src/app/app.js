'use strict';

require('../../vendor/angular/angular');
require('../../vendor/angular-touch/angular-touch');
require('../../vendor/angular-ui-router/release/angular-ui-router');
require('../../build/templates');

// Import app controller
var AppCtrl = require('./app-controller');

// Import app services
var listingsService = require('./components/listings-service');

module.exports = angular.module('app', [
    'ui.router',
	
	// Add modules/sections as dependencies
    require('./home/home').name,
    require('./about/about').name,
    require('./listings/listings').name
    
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
})

.run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}])
.controller('AppCtrl',['$scope', '$http',AppCtrl])
.factory('listingsService',[listingsService]);
