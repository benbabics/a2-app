(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexUiGreeking($ionicGesture, $ionicScrollDelegate) {
        var directive = {
            restrict:   "E",
            replace:    true,
            transclude: true,
            scope: {
                itemHeight: "@"
            },
            templateUrl: "app/shared/widgets/templates/wexUiGreeking.directive.html",
            link: linkFn
        };

        return directive;

        function linkFn(scope, element) {
            var gestureDrag, gestureRelease,
                $item = angular.element( element[0].closest(".item") );

            scope.itemHeight = scope.itemHeight || "15px";

            // event handlers
            scope.handleDrag = function(evt) {
                var isVisible = !element[0].closest( ".ng-hide" ),
                    isDragUp  = evt.gesture.direction === "up";

                if ( isVisible && isDragUp ) {
                    $ionicScrollDelegate.freezeAllScrolls( true );
                }
            };
            scope.handleRelease = function() {
                $ionicScrollDelegate.freezeAllScrolls( true );
            };

            // bind for drag & release on `.item`
            gestureDrag    = $ionicGesture.on( "drag",    scope.handleDrag,    $item );
            gestureRelease = $ionicGesture.on( "release", scope.handleRelease, $item );

            // unbind for drag & release, on destroyed directive
            element.on("$destroy", function() {
                $ionicGesture.off( gestureDrag, "drag", scope.handleDrag );
                $ionicGesture.off( gestureRelease, "release", scope.handleRelease );
            });
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexUiGreeking", wexUiGreeking);
}());
