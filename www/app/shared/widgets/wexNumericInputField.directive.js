(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Directive above the scroll

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
    function wexNumericInputField(_, $compile, $ionicScrollDelegate, ElementUtil) {
        //Private members
        var KEY_NUMERIC = "numeric",
            KEY_DECIMAL = "decimal",
            KEY_DELETE = "delete",
            MODEL_DISPLAY_ELEMENT_SELECTOR = "[data-display-model]",
            vm,
            keyMap = [
                [numericKey(1), numericKey(2), numericKey(3)],
                [numericKey(4), numericKey(5), numericKey(6)],
                [numericKey(7), numericKey(8), numericKey(9)],
                [decimalKey(), numericKey(0), deleteKey()]
            ],
            directiveElem,
            keypadElem,
            modelDisplayElem,
            modelElem,
            view,
            viewContent;

        //Public members
        var directive = {
            restrict: "A",
            link    : link,
            scope   : {
                allowDecimal     : "&?",
                allowKeypadToggle: "&?",
                formatters       : "=?",
                model            : "=ngModel",
                onInput          : "=?" //callback: function(input, newValue, oldValue)
            }
        };

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
                    return !vm.allowDecimal();
                default:
                    return false;
            }
        }

        function showKeypad(show, apply) {
            apply = _.isUndefined(apply) ? true : apply;

            var showFunc = function () {
                vm.keypadVisible = show;

                if (show) {
                    viewContent.addClass("has-numeric-keypad");
                }
                else {
                    viewContent.removeClass("has-numeric-keypad");
                }

                //recalculate the scroll content area
                $ionicScrollDelegate.resize();
            };

            if (apply) {
                vm.$apply(showFunc);
            }
            else {
                showFunc();
            }
        }

        function toggleKeypad() {
            if (vm.allowKeypadToggle()) {
                vm.showKeypad(!vm.keypadVisible);
            }
        }

        function onKeyPress(value) {
            var oldValue = vm.model;

            switch (value) {
                //backspace
                case "\b":
                {
                    vm.model = String(vm.model).slice(0, -1);
                    break;
                }
                default:
                {
                    vm.model = vm.model + String(value);
                    break;
                }
            }

            //TODO limit decimal entry to a single decimal

            if (vm.onInput) {
                vm.onInput(value, vm.model, oldValue);
            }
        }

        /* Returns the element where the model should be displayed. By default it will be shown in the directive's
         * element, or in a child element of the directive's element that has the attribute 'data-display-model' set.
         */
        function getModelDisplayElement() {
            var overrideDisplayElem = directiveElem[0].querySelector(MODEL_DISPLAY_ELEMENT_SELECTOR);
            return overrideDisplayElem ? angular.element(overrideDisplayElem) : directiveElem;
        }

        function removeEventListeners() {
            directiveElem.off("click", vm.toggleKeypad);
            window.removeEventListener("native.keyboardshow", vm.closeKeypad);
        }

        function getFilteredModelTemplate() {
            var markup = [],
                addFilter = function (filter) {
                    markup.push(" | " + filter);
                };

            markup.push("{{");
            markup.push("model");

            if (vm.formatters) {
                if (_.isArray(vm.formatters)) {
                    _.each(vm.formatters, function (filter) {
                        addFilter(filter);
                    });
                }
                else {
                    addFilter(vm.formatters);
                }
            }

            markup.push("}}");
            return markup.join("");
        }

        function link(scope, elem) { // args: scope, elem, attrs
            vm = scope;

            //private members:
            //the directive's element
            directiveElem = elem;
            //the active view element
            view = ElementUtil.getFocusedView();
            //the active content element
            viewContent = ElementUtil.getViewContent(view);
            //the element that contains the keypad
            keypadElem = $compile(
                "<div ng-include=\"'app/shared/widgets/templates/numericInputField/numericKeypad.html'\"></div>"
            )(scope);
            //the element where the model is displayed
            modelDisplayElem = getModelDisplayElement();
            //the model element
            modelElem = $compile("<span>" + getFilteredModelTemplate() + "</span>")(scope);

            //public members:
            vm.keyMap = keyMap;
            vm.keypadVisible = false;
            //whether decimals are allowed (defaults to true)
            vm.allowDecimal = _.isUndefined(vm.allowDecimal()) ?
                _.constant(true) :
                vm.allowDecimal;
            //whether the keypad can be toggled (or conversely is always shown) (defaults to true)
            vm.allowKeypadToggle = _.isUndefined(vm.allowKeypadToggle()) ?
                _.constant(true) :
                vm.allowKeypadToggle;
            vm.keyIsDisabled = keyIsDisabled;
            vm.showKeypad = showKeypad;
            vm.toggleKeypad = toggleKeypad;
            vm.onKeyPress = onKeyPress;
            vm.removeEventListeners = removeEventListeners;
            vm.closeKeypad = _.partial(vm.showKeypad, false);

            //event listeners:
            directiveElem.on("click", vm.toggleKeypad);
            //hides the keypad if a native keyboard is shown
            window.addEventListener("native.keyboardshow", vm.closeKeypad);
            scope.$on("$destroy", _.bind(keypadElem.remove, keypadElem));
            scope.$on("$destroy", vm.removeEventListeners);

            //add the keypad element to the active view
            if (view) {
                view.append(keypadElem);
            }

            //add the model element to the model display element
            modelDisplayElem.append(modelElem);

            //set the default keypad visibility state (based on whether or not keypad toggling is enabled)
            vm.showKeypad(!vm.allowKeypadToggle(), false);
        }
    }

    angular.module("app.shared.widgets")
        .directive("wexNumericInputField", wexNumericInputField);
}());
