(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* @ngInject */
    function wexAdvancedInput() {
        var directive = {
                restrict:   "E",
                replace:    true,
                transclude: true,
                link:       linkFn,
                templateUrl: "app/shared/widgets/templates/wexAdvancedInput.directive.html",
                scope: {
                    maskText: "="
                }
            };

        return directive;
        //////////////////////
    }

    function linkFn(scope, element) {
        // WHY AREN'T WE LOADING jQUERY?!?! ಠ_ಠ
        var field  = element.find( "input" ),
            button = angular.element( element[0].querySelector(".ion-close-circled") ),
            modelPath = field.attr( "ng-model" );

        scope.isEditable       = false;
        scope.maskedValue      = "";
        scope.isMaskVisible    = toggleIsMaskVisible();

        scope.handleClearValue       = handleClearValue;
        scope.handleToggleIsEditable = handleToggleIsEditable;

        // toggle reset value button button
        field.on("focus blur", function (evt) {
            var isEditable = evt.type === "focus";
            scope.$apply(function() { handleToggleIsEditable(isEditable); });
        });

        // set maskedValue property
        scope.$parent.$watch(modelPath, function (val) {
            if ( scope.maskText ) {
                scope.maskedValue = transformToMaskedValue( val );
                toggleIsMaskVisible();
            }
        });

        function handleClearValue(evt) {
            evt.preventDefault();
            field.val( "" ).triggerHandler( "change" );
            setTimeout(function() { field[0].focus(); });
        }

        function handleToggleIsEditable(isEditable) {
            scope.isEditable = isEditable;
            toggleIsMaskVisible();
        }

        function toggleIsMaskVisible() {
            if ( scope.maskText ) {
                var hasMaskedValue = scope.maskedValue.length > 0;
                scope.isMaskVisible = !scope.isEditable && hasMaskedValue;
                return scope.isMaskVisible;
            }

            return false;
        }

        function transformToMaskedValue(val) {
            val = val || "";

            if ( val.length > 3 ) {
                return val.slice( 0, -3 ) + "***";
            }

            return "*".repeat( val.length );
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexAdvancedInput", wexAdvancedInput);
})();
