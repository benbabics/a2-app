(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function ContactUsController($scope, globals) {

        var vm = this;
        vm.config = globals.CONTACT_US.CONFIG;

        activate();

        //////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
        }

    }

    angular.module("app.components.contactUs")
        .controller("ContactUsController", ContactUsController);
})();
