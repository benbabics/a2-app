(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to show the definition of the Service above the scroll
    // jshint maxparams:6

    /* @ngInject */
    function VersionStatusController($scope, $state, globals, versionStatus, PlatformUtil, VersionStatusModel) {

        var vm = this;

        vm.skipUpdate = skipUpdate;
        vm.update = update;

        activate();

        /////////////////////
        // Controller initialization
        function activate() {
            // set event listeners
            $scope.$on("$ionicView.beforeEnter", beforeEnter);
        }

        function beforeEnter() {
            if (versionStatus instanceof VersionStatusModel) {
                if (versionStatus.status === globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.CAN_UPDATE) {
                    vm.config = angular.merge({}, globals.VERSION_STATUS.CONFIG, globals.VERSION_STATUS.WARN);
                }
                else if (versionStatus.status === globals.CONFIGURATION_API.VERSIONS.STATUS_VALUES.MUST_UPDATE) {
                    vm.config = angular.merge({}, globals.VERSION_STATUS.CONFIG, globals.VERSION_STATUS.FAIL);
                }
                else {
                    return goToLogin();
                }
            }
            else {
                return goToLogin();
            }
        }

        function goToLogin() {
            return $state.go(globals.LOGIN_STATE);
        }

        function skipUpdate() {
            return goToLogin();
        }

        function update() {
            var platform = PlatformUtil.getPlatform().toLowerCase(),
                url = globals.VERSION_STATUS.APP_STORES[platform];

            if (url) {
                PlatformUtil.waitForCordovaPlatform()
                    .then(() => window.cordova.plugins.market.open(url));
            }
        }
    }

    angular.module("app.components.version")
        .controller("VersionStatusController", VersionStatusController);
}());
