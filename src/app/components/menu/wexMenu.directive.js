(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Directive that displays the navigation menu. */

    /* @ngInject */
    function wexMenu() {
        var directive = {
            restrict   : "A",
            controller : "MenuController as vm",
            templateUrl: "app/components/menu/templates/menu.html"
        };

        return directive;
    }

    angular
        .module("app.components.menu")
        .directive("wexMenu", wexMenu);
})();
