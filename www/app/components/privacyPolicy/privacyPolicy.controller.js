(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function PrivacyPolicyController($scope, globals) {

        var vm = this;
        vm.config = globals.PRIVACY_POLICY.CONFIG;

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

    angular.module("app.components.privacyPolicy")
        .controller("PrivacyPolicyController", PrivacyPolicyController);
})();
