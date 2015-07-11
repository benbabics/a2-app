(function () {
    "use strict";

    describe("A Core Module config", function () {

        var $urlRouterProvider,
            appGlobals;

        beforeEach(function () {

            module(function (_$urlRouterProvider_) {
                $urlRouterProvider = _$urlRouterProvider_;

                $urlRouterProvider.otherwise = jasmine.createSpy("otherwise").and.callThrough();
            });

            module("app.components.core");
            module("app.shared");
            module("app.components.user");

            inject(function(_appGlobals_) {
                appGlobals = _appGlobals_;
            });
        });

        it("should set the default route to the expected value", function () {
            expect($urlRouterProvider.otherwise).toHaveBeenCalledWith(appGlobals.DEFAULT_ROUTE);
        });
    });
})();