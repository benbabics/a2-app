(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Controller above the scroll

    /* @ngInject */
    function CardReissueController($scope, CardReissueManager) {

        var vm = this;

        activate();

        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$destroy", destroy);
        }

        function destroy() {
            CardReissueManager.clearCardReissueDetails();
        }
    }

    angular.module("app.components.card")
        .controller("CardReissueController", CardReissueController);
})();