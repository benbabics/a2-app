(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    /* jshint -W106 */ // Ignore variables with underscores that were not created by us

    /* @ngInject */
    function FlowUtil(_, $ionicSideMenuDelegate, $rootScope, $state, globals, ElementUtil, PlatformUtil) {
        // Private variables
        var transitionPending;
        var transitionPlugin;

        // Revealed Public members
        var service = {
            exitApp      : exitApp,
            goToBackState: goToBackState,
            onPageEnter  : onPageEnter,
            onPageLeave  : onPageLeave
        };

        PlatformUtil.waitForCordovaPlatform()
            .then(activate);

        return service;

        //////////////////////
        // Native transitions plugin fixes

        function activate() {
            $rootScope.$on("$stateChangeStart", onStateChangeStart);
            $rootScope.$on("$ionicView.afterEnter", onAfterEnter);

            transitionPending = false;
            transitionPlugin = window.plugins.nativepagetransitions;

            // Take manual control of the plugin grabbing screenshots and performing transitions.
            transitionPlugin.globalOptions.iosdelay = -1;
            transitionPlugin.globalOptions.androiddelay = -1;
        }

        function onStateChangeStart(event, toState, toParams, fromState, fromParams, options) {
            if(!transitionPending) {
                // Cancel the transition so Ionic doesn't update the view while the plugin is trying to get a screenshot.
                event.preventDefault();
                transitionPending = true;
                // Tell the plugin to grab a screenshot
                transitionPlugin.slide({ direction: "right" }, function() {
                    // When the screenshot is taken, close the menu and redo the transition.
                    $ionicSideMenuDelegate.toggleRight(false);
                    $state.go(toState.name, toParams, options);
                });
            }
        }

        function onAfterEnter() {
            // Perform the actual transition animation.
            transitionPlugin.executePendingTransition();
            transitionPending = false;
        }

        // End plugin fixes
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
                removeListeners.push(scope.$on("$ionicView.enter", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));

                removeListeners.push(scope.$on("$ionicView.afterEnter", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));
            }

            if (options.global) {
                removeListeners.push($rootScope.$on("$ionicView.enter", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));

                removeListeners.push($rootScope.$on("$ionicView.afterEnter", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));

                removeListeners.push($rootScope.$on("$stateChangeSuccess", function (event, toState) { // args: event, toState, toParams, fromState, fromParams
                    handler(toState.name);
                }));
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
                removeListeners.push(scope.$on("$ionicView.leave", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));

                removeListeners.push(scope.$on("$ionicView.beforeLeave", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));
            }

            if (options.global) {
                removeListeners.push($rootScope.$on("$ionicView.leave", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));

                removeListeners.push($rootScope.$on("$ionicView.beforeLeave", function (event, stateInfo) {
                    handler(stateInfo.stateName);
                }));

                removeListeners.push($rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState) { // args: event, toState, toParams, fromState, fromParams
                    handler(fromState.name);
                }));
            }

            return removeListeners;
        }
    }

    angular
        .module("app.shared.util")
        .factory("FlowUtil", FlowUtil)
})();