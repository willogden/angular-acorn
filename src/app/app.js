'use strict';

require('../../vendor/angular/angular');
require('../../vendor/angular-touch/angular-touch');
require('../../vendor/angular-ui-router/release/angular-ui-router');
require('../../vendor/angular-ui-utils/modules/route/route');
require('../../build/templates');

var home = require('./home/home');
var about = require('./about/about');
var AppCtrl = require('./app-controller');

module.exports = angular.module('angularAcornApp', [
    home.name,
    about.name,
    'ui.state',
    'ui.route'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
})

.run(function run() {})
.controller('AppCtrl',AppCtrl);
