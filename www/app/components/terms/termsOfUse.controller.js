(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function TermsOfUseController($scope, globals) {

        var vm = this;
        vm.config = globals.TERMS_OF_USE.CONFIG;

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

    angular.module("app.components.terms")
        .controller("TermsOfUseController", TermsOfUseController);
})();