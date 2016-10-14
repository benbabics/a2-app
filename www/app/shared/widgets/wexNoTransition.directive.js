(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll

    //Using the Ionic directive nav-transition set to "none" causes a bug with the header title
    //(see https://github.com/driftyco/ionic/issues/2966).
    //TODO remove and replace uses of this directive with nav-transition="none" once the above bug is fixed in Ionic
    function wexNoTransition(_, $rootScope, $document) {
        var directive = {
            restrict: "A",
            link    : link
        };

        function disablePageTransitions() {
            //only fire this listener once
            this.removeBeforeListener();

            var navViewElem = $document.find("ion-nav-view");

            if (navViewElem && !navViewElem.attr("last-transition")) {
                //override the current global transition type to "none"
                navViewElem.attr("last-transition", navViewElem.attr("nav-view-transition"));
                navViewElem.attr("nav-view-transition", "none");
            }
        }

        function enablePageTransitions() {
            //only fire this listener once
            this.removeAfterListener();

            var navViewElem = $document.find("ion-nav-view");

            if (navViewElem && navViewElem.attr("last-transition")) {
                //restore the previous global transition type
                navViewElem.attr("nav-view-transition", navViewElem.attr("last-transition"));
                navViewElem.removeAttr("last-transition");
            }
        }

        function registerListeners() {
            this.removeBeforeListener = $rootScope.$on("$ionicView.beforeLeave", _.bind(disablePageTransitions, this));
            this.removeAfterListener = $rootScope.$on("$ionicView.afterEnter", _.bind(enablePageTransitions, this));
        }

        function link(scope, elem) {
            elem.bind("click", _.bind(registerListeners, scope));
        }

        return directive;
    }

    angular.module("app.shared.widgets")
        .directive("wexNoTransition", wexNoTransition);
}());
