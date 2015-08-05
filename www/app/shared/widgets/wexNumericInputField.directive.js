(function () {
    "use strict";

    /* jshint -W003 */
    /* jshint -W026 */ // These allow us to show the definition of the Directive above the scroll

    /* Directive that binds a numeric keyboard to a model and updates the model and its display element with user input.
     * Example of creating an input that's styled like a field on the login page:
     *
     * <div class="padding">
     *     <span class="item item-input" ng-model="model" wex-numeric-input-field allow-decimal="false">
     *         <div class="numeric-input-field" data-display-model></div>
     *     </span>
     * </div>
     */

    /* @ngInject */
    function wexNumericInputField(CommonService, $compile) {
        var KEY_NUMERIC = "numeric",
            KEY_DECIMAL = "decimal",
            KEY_DELETE = "delete",
            MODEL_DISPLAY_ELEMENT_SELECTOR = "[data-display-model]",
            directive = {
                restrict: "A",
                link: link,
                scope: {
                    allowDecimal: "&?",
                    model: "=ngModel"
                }
            },
            _ = CommonService._,
            keyMap = [
                [numericKey(1), numericKey(2), numericKey(3)],
                [numericKey(4), numericKey(5), numericKey(6)],
                [numericKey(7), numericKey(8), numericKey(9)],
                [decimalKey(), numericKey(0), deleteKey()]
            ],
            directiveElem,
            keypadElem,
            modelDisplayElem,
            modelElem;


        return directive;

        function keyType(key, type) {
            return {key: key, type: type};
        }

        function numericKey(key) {
            return keyType(key, KEY_NUMERIC);
        }

        function decimalKey() {
            return keyType(".", KEY_DECIMAL);
        }

        function deleteKey() {
            return keyType("\b", KEY_DELETE);
        }

        function keyIsDisabled(keyType) {
            switch (keyType.type) {
                case KEY_DECIMAL:
                    return !this.allowDecimal();
                default:
                    return false;
            }
        }

        function showKeypad(show) {
            var self = this;

            self.$apply(function () {
                self.keypadVisible = show;
            });
        }

        function toggleKeypad() {
            this.showKeypad(!this.keypadVisible);
        }

        function onKeyPress(value) {
            switch (value) {
                //backspace
                case "\b":
                {
                    this.model = this.model.slice(0, -1);
                    break;
                }
                default:
                {
                    this.model = this.model + String(value);
                    break;
                }
            }

            //TODO limit decimal entry to a single decimal
        }

        /* Returns the element where the model should be displayed. By default it will be shown in the directive's
         * element, or in a child element of the directive's element that has the attribute 'data-display-model' set.
         */
        function getModelDisplayElement() {
            var overrideDisplayElem = directiveElem[0].querySelector(MODEL_DISPLAY_ELEMENT_SELECTOR);
            return overrideDisplayElem ? angular.element(overrideDisplayElem) : directiveElem;
        }

        function removeEventListeners() {
            directiveElem.off("click", this.toggleKeypad);
            window.removeEventListener("native.keyboardshow", this.closeKeypad);
        }

        function link(scope, elem, attrs) {
            var activeViewContent = CommonService.getViewContent();

            //private members:
            //the directive's element
            directiveElem = elem;
            //the element that contains the keypad
            keypadElem = $compile(
                "<div ng-include=\"'app/shared/widgets/templates/numericInputField/numericKeypad.html'\"></div>"
            )(scope);
            //the element where the model is displayed
            modelDisplayElem = getModelDisplayElement();
            //the model element
            modelElem = $compile("<span>{{model}}</span>")(scope);

            //public members:
            scope.keyMap = keyMap;
            scope.keypadVisible = false;
            //whether decimals are allowed (defaults to true)
            scope.allowDecimal = _.isUndefined(scope.allowDecimal()) ? _.constant(true) : scope.allowDecimal;
            scope.keyIsDisabled = _.bind(keyIsDisabled, scope, _);
            scope.showKeypad = _.bind(showKeypad, scope, _);
            scope.toggleKeypad = _.bind(toggleKeypad, scope);
            scope.onKeyPress = _.bind(onKeyPress, scope, _);
            scope.removeEventListeners = _.bind(removeEventListeners, scope);
            scope.closeKeypad = _.partial(scope.showKeypad, false);


            //event listeners:
            directiveElem.on("click", scope.toggleKeypad);
            //hides the keypad if a native keyboard is shown
            window.addEventListener("native.keyboardshow", scope.closeKeypad);
            scope.$on("$destroy", _.bind(keypadElem.remove, keypadElem));
            scope.$on("$destroy", scope.removeEventListeners);

            //add the keypad element to the active view content
            if (activeViewContent) {
                activeViewContent.append(keypadElem);
            }

            //add the model element to the model display element
            modelDisplayElem.append(modelElem);
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexNumericInputField", wexNumericInputField);
}());