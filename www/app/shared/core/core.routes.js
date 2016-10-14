(function () {
    "use strict";

    function configureRoutes($urlRouterProvider, $stateProvider) {

        $urlRouterProvider.when("/app/exit", function (FlowUtil) {
            FlowUtil.exitApp();
        });

        $stateProvider.state("app", {
            abstract: true,
            url     : "/app",
            template: "<ion-nav-view></ion-nav-view>"
        });

        //going to this state closes the app
        $stateProvider.state("app.exit", {
            url: "/exit"
        });
    }

    angular
        .module("app.shared.core")
        .config(configureRoutes);
})();
