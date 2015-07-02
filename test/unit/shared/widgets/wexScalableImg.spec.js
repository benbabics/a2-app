(function () {
    "use strict";

    describe("A WEX Scalable Img directive", function () {

        var $scope,
            $rootScope,
            CommonService,
            directiveElem,
            mockSrc = "mockSrc";

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, $compile, _CommonService_) {
                $rootScope = _$rootScope_;

                CommonService = _CommonService_;

                $scope = $rootScope.$new();

                $scope.mockSrc = mockSrc;

                //Compile the angular markup to get an instance of the directive
                directiveElem = $compile("<wex-scalable-img src='{{mockSrc}}'></wex-scalable-img>")($scope);

                $rootScope.$digest();
            });
        });

        describe("should create an element that", function() {

            it("should have the img-scalable CSS class", function() {
                expect(directiveElem.hasClass("img-scalable")).toBeTruthy();
            });

            it("should have a background-image CSS style that points to the image source", function() {
                expect(directiveElem[0].style["background-image"]).toBeDefined();
                expect(directiveElem[0].style["background-image"]).toContain(mockSrc);
            });
        });
    });
}());