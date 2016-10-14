(function () {
    "use strict";

    var _,
        $rootScope,
        $compile,
        wexRefresher,
        mockGlobals = {
            PULL_TO_REFRESH: {
                pullingText: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                spinner: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                showSpinner: false //note: test will throw an error if this is true
            }
        };

    describe("A Wex Refresher Directive", function () {

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            module(function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));
            });

            inject(function (___, _$rootScope_, _$compile_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                _ = ___;
            });

            wexRefresher = createWexRefresher();
        });

        it("should add the expected attributes to the element's scope", function () {
            //TODO - Figure out how to test this
        });
    });

    function createWexRefresher() {
        var scope = $rootScope.$new(),
            element;

        element = $compile([
            "<ion-content>",
            "<ion-refresher class='wex-refresher'></ion-refresher>",
            "</ion-content>"
        ].join(""))(scope)
            .find("ion-refresher");

        $rootScope.$digest();

        return element;
    }
})();
