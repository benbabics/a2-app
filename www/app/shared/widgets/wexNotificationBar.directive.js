(function () {
    "use strict";

    function wexNotificationBar($compile, $window, $timeout) {
        var directive = {
            restrict   : "E",
            replace    : true,
            transclude : true,
            link : link,
            scope: {
                text     : '@',
                closeable: '='
            },
            templateUrl: "app/shared/widgets/notificationBar.directive.html"
        };

        function close(scope) {
            $timeout(function () {
                scope.$emit("bannerClosed");
            });
        }

        function link(scope, elem) {
            //get the default header bar title size for data-fittext-max
            scope.titleSize = $window.getComputedStyle(elem[0], null).getPropertyValue("font-size");

            scope.close = function () {
                close(scope);
            };

            var titleNode = $compile([
                '<h1 class="title">',
                '<span class="title-text" data-fittext data-fittext-max="{{titleSize}}">',
                '&nbsp;{{text}}',
                '</span>',
                '</h1>'
            ].join(""))(scope);

            elem.append(titleNode);
        }

        return directive;
    }

    angular.module("app.widgets")
        .directive("wexNotificationBar", wexNotificationBar);
}());