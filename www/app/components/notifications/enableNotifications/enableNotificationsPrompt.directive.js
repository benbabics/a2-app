(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the LinkFn above the directive config

    /* @ngInject */
    function enableNotificationsPrompt($rootScope, $ionicModal, $timeout) {
        var TEMPLATE_URL = "app/components/notifications/enableNotifications/templates/enableNotificationsPrompt.directive.html";

        return {
            restrict:    "E",
            replace:     true,
            link:        linkFn,
            controller:  "EnableNotificationsController"
        };

        function linkFn(scope) {
            var flags = scope.notifications.flags;

            // determine show modal when notifications are ready
            scope.notifications.onReady.then(function() {
                var shouldShowModal = !flags.hasEnabled && !flags.hasRejectedPrompt;
                if ( shouldShowModal ) {
                    $ionicModal.fromTemplateUrl( TEMPLATE_URL, { scope: scope } )
                      .then(function(modal) {
                          scope.modal = modal;
                          $timeout(function() { scope.modal.show(); }, 300);
                      });
                }
            });

            // hide modal
            scope.closeModal = function() {
                scope.modal.hide();
            };

            // hide modal on idlestart event
            $rootScope.$on( "IdleStart", scope.closeModal );
        }
    }

    angular.module("app.components.notifications")
        .directive("enableNotificationsPrompt", enableNotificationsPrompt);
}());
