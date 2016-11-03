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
        var field  = element.find( "input" ),
            modelPath = field.attr( "ng-model" );

        scope.isEditable    = false;
        scope.maskedValue   = "";
        scope.isMaskVisible = toggleIsMaskVisible();

        scope.handleClearValue      = handleClearValue;
        scope.handleClickMask       = handleClickMask;
        scope.handleCheckIsEditable = handleCheckIsEditable;

        // toggle reset value button
        field.on("blur", function (evt) {
            scope.$apply(function() { toggleIsEditable(evt.type === "focus"); });
        });

        // toggle isMaskVisible
        scope.$watchCollection( "[maskedValue, isEditable]", toggleIsMaskVisible );

        // set maskedValue property from input ng-model
        scope.$parent.$watch(modelPath, function (val) {
            if ( scope.maskText ) {
                scope.maskedValue = val;
            }
        });

        // handlers
        function handleClearValue(evt) {
            evt.preventDefault();
            field.val( "" ).triggerHandler( "change" );
            setTimeout(function() { field[0].focus(); });
        }

        function handleClickMask() {
            setTimeout(function() { field[0].focus(); });
        }

        function handleCheckIsEditable() {
            toggleIsEditable( field.attr("disabled") !== "disabled" );
        }

        // update properties
        function toggleIsEditable(isEditable) {
            scope.isEditable = isEditable;
        }

        function toggleIsMaskVisible() {
            if ( scope.maskText ) {
                var hasMaskedValue = (scope.maskedValue || "").length > 0;
                scope.isMaskVisible = !scope.isEditable && hasMaskedValue;
                return scope.isMaskVisible;
            }
            return false;
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexAdvancedInput", wexAdvancedInput);
})();
