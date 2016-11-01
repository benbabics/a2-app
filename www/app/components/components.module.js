(function () {
    "use strict";

    angular.module("app.components", [
        /* app component modules */
        "app.components.account",
        "app.components.bank",
        "app.components.brand",
        "app.components.card",
        "app.components.contactUs",
        "app.components.core",
        "app.components.driver",
        "app.components.landing",
        "app.components.invoice",
        "app.components.menu",
        "app.components.navBar",
        "app.components.navigation",
        "app.components.notifications",
        "app.components.payment",
        "app.components.privacyPolicy",
        "app.components.settings",
        "app.components.transaction",
        "app.components.terms",
        "app.components.user",
        "app.components.util",
        "app.components.version",
        "app.components.widgets"
    ])

    // expose $httpBackend as a service
    .config(function($provide) {
        $provide.decorator( "$httpBackend", angular.mock.e2e.$httpBackendDecorator );
    })

    // catch-all pass through for all other requests, not defined as mocks in other modules
    .run(function($httpBackend) {
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
    });
})();
