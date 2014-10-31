var app = require("./app");
var AppCtrl = require('./app-controller');

describe('AppCtrl', function() {

    describe('isCurrentUrl', function() {
        var $scope,$location,ctrl;

        beforeEach(inject(function($controller, _$location_, $rootScope) {
          $location = _$location_;
          $scope = $rootScope.$new();
          ctrl = new AppCtrl($scope,$location);
        }));

        it('should pass a dummy test', inject(function() {
            expect(ctrl).toBeTruthy();
        }));
    });
});
