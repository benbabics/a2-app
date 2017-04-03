(function() {
    "use strict";
    
    function wexApplicationFlag(_, UserManager) {
        var directive = {
            priority: 1,
            restrict: "A",
            link    : link
        };

        return directive;

        function link(scope, elem, attrs) {
            let userApplication = UserManager.getUser().onlineApplication;
            let includedApplications = scope.$eval(attrs.wexApplicationFlag) || [];

            if (!_.includes(includedApplications, userApplication)) {
                elem.remove();
            }
        }
    }

    angular
        .module("app.shared.widgets")
        .directive("wexApplicationFlag", wexApplicationFlag);
})();