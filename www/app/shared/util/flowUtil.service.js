(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function FlowUtil($rootScope, $state, globals, ElementUtil) {
        // Revealed Public members
        var service = {
            exitApp      : exitApp,
            goToBackState: goToBackState,
            onPageEnter  : onPageEnter,
            onPageLeave  : onPageLeave
        };

        return service;
        //////////////////////

        function exitApp() {
            //close the app (this does not work on iOS since it does not allow apps to close themselves)
            if (navigator.app) {
                navigator.app.exitApp();
            }

            //app couldn't be closed (i.e. on iOS or a browser, so just go back to the login page)
            $state.go(globals.LOGIN_STATE);
        }

        /**
         * Goes to the back state specified by a given back button.
         *
         * @param {jqLite} [backButton] The back button to use (default: the active back button)
         * @return {Boolean} True if the call is successful or false if the back button couldn't be found
         */
        function goToBackState(backButton) {
            var backButtonScope;

            backButton = backButton || ElementUtil.findActiveBackButton();

            //if there is a back button, call its goBack function
            if (backButton) {
                backButtonScope = backButton.isolateScope();
                if (backButtonScope) {
                    backButtonScope.goBack();
                    return true;
                }
            }

            return false;
        }

        function onPageEnter(callback, scope, options) {
            var removeListeners = [],
                handler = function (toState) {
                    if (options.once) {
                        //remove all listeners
                        _.invokeMap(removeListeners, _.call);
                    }

                    //invoke the callback with the to state
                    return callback(toState);
                };

            options = options || {};

            if (!_.has(options, "global")) {
                options.global = true;
            }

            if (!_.has(options, "once")) {
                options.once = true;
            }

            if (options.once) {
                handler = _.once(handler);
            }

            //Note: $ionicView.enter, ionicView.afterEnter, and $stateChangeSuccess all have issues where they don't get fired under certain conditions.
            //We need to listen to a combination of all of them to capture every possible scenario for a page being transitioned away from.

            if (scope) {
                removeListeners.push(scope.$on("$ionicView.enter", (event, stateInfo) => handler(stateInfo.stateName)));

                removeListeners.push(scope.$on("$ionicView.afterEnter", (event, stateInfo) => handler(stateInfo.stateName)));
            }

            if (options.global) {
                removeListeners.push($rootScope.$on("$ionicView.enter", (event, stateInfo) => handler(stateInfo.stateName)));

                removeListeners.push($rootScope.$on("$ionicView.afterEnter", (event, stateInfo) => handler(stateInfo.stateName)));

                removeListeners.push($rootScope.$on("$stateChangeSuccess", (event, toState) => handler(toState.name)));
            }

            return removeListeners;
        }

        function onPageLeave(callback, scope, options) {
            var removeListeners = [],
                handler = function (fromState) {
                    if (options.once) {
                        //remove all listeners
                        _.invokeMap(removeListeners, _.call);
                    }

                    //invoke the callback with the from state
                    return callback(fromState);
                };

            options = options || {};

            if (!_.has(options, "global")) {
                options.global = true;
            }

            if (!_.has(options, "once")) {
                options.once = true;
            }

            if (options.once) {
                handler = _.once(handler);
            }

            //Note: $ionicView.leave, ionicView.beforeLeave, and $stateChangeSuccess all have issues where they don't get fired under certain conditions.
            //We need to listen to a combination of all of them to capture every possible scenario for a page being transitioned away from.

            if (scope) {
                removeListeners.push(scope.$on("$ionicView.leave", (event, stateInfo) => handler(stateInfo.stateName)));

                removeListeners.push(scope.$on("$ionicView.beforeLeave", (event, stateInfo) => handler(stateInfo.stateName)));
            }

            if (options.global) {
                removeListeners.push($rootScope.$on("$ionicView.leave", (event, stateInfo) => handler(stateInfo.stateName)));

                removeListeners.push($rootScope.$on("$ionicView.beforeLeave", (event, stateInfo) => handler(stateInfo.stateName)));

                removeListeners.push($rootScope.$on("$stateChangeSuccess", (event, toState, toParams, fromState) => handler(fromState.name)));
            }

            return removeListeners;
        }
    }

    angular
        .module("app.shared.util")
        .factory("FlowUtil", FlowUtil);
})();