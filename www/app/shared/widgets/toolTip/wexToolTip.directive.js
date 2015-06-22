(function () {
    "use strict";

    /* jshint -W003 */ /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexToolTip($ionicModal, CommonService) {
        // Constants
        var ICON_TEMPLATE = "app/shared/widgets/toolTip/tooltip.directive.html",
            MODAL_TEMPLATE = "app/shared/widgets/toolTip/tooltipModal.html";

        // Private members
        var _ = CommonService._;

        // Revealed Public members
        var directive = {
            restrict: "E",
            replace: true,
            link: link,
            scope: {
                options: "@",
                title: "@",
                body: "@",
                closeButton: "@",
                onShow: "&",
                onHide: "&",
                onClose: "&"
            },
            templateUrl: ICON_TEMPLATE
        };

        return directive;

        function link(scope, element, attrs) {

            // Set up the Tool Tip options
            if (!_.isEmpty(scope.options)) {
                angular.extend(scope, JSON.parse(scope.options));
            }

            // Create ToolTip as a modal
            $ionicModal.fromTemplateUrl(MODAL_TEMPLATE, {
                scope: scope,
                animation: "slide-in-up",
                backdropClickToClose: false
            }).then(function(toolTip) {
                scope.toolTip = toolTip;
            });

            scope.openToolTip = openToolTip;
            scope.closeToolTip = closeToolTip;

            // handle modal events
            scope.$on("modal.shown", scope.onShow);
            scope.$on("modal.hidden", scope.onHide);
            scope.$on("modal.removed", scope.onClose);

            // Cleanup the modal when we're done with it!
            scope.$on("$destroy", removeToolTip);

            function openToolTip($event) {
                scope.toolTip.show($event);
            }

            function closeToolTip() {
                scope.toolTip.hide();
            }

            function removeToolTip() {
                scope.toolTip.remove();
            }
        }

    }

    angular
        .module("app.widgets")
        .directive("wexToolTip", wexToolTip);
})();