(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    /* @ngInject */
    function VersionStatusController($scope, $state, globals) {

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            return $state.go(globals.LOGIN_STATE);
        }
    }

    angular.module("app.components.version")
        .controller("VersionStatusController", VersionStatusController);
}());
