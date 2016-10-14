(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexActiveElement() {
        var directive = {
                restrict: "A",
                link:     linkFn
            };

        return directive;
        //////////////////////

        function linkFn(scope, element) {
            scope.isActive = false;

            // assign listener
            document.body.addEventListener( "click", handleToggleIsActive );

            // remove listener
            element.on("$destroy", function() {
                document.body.removeEventListener( "click", handleToggleIsActive );
            });

            function handleToggleIsActive(evt) {
                var isActive = checkIsActiveElement( evt.target );
                scope.$apply(function() { scope.isActive = isActive; });
            }

            function checkIsActiveElement(el) {
                if ( element[0] === el ) { return true; }
                return element[0].contains( el );
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexActiveElement", wexActiveElement);
})();
