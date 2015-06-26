(function () {
    "use strict";

    describe("A WEX Placeholder directive", function () {

        var $scope,
            $rootScope,
            CommonService,
            directiveFormInput,
            targetInput,
            mockPlaceholder = "Lorem ipsum dolor";

        beforeEach(function () {
            module("app.shared");

            inject(function (_$rootScope_, $compile, _CommonService_) {
                $rootScope = _$rootScope_;

                CommonService = _CommonService_;

                $scope = $rootScope.$new();

                $scope.mockPlaceholder = mockPlaceholder;

                //Compile the angular markup to get an instance of the directive
                directiveFormInput = $compile([
                    '<form novalidate name="formModel">',
                    '<input type="text" name="mockInput" wex-placeholder="{{mockPlaceholder}}">',
                    '</form>'
                ].join(""))($scope);

                $rootScope.$digest();

                //get the form input element
                _.each(directiveFormInput.children(), function (child) {
                    if (child.hasAttribute("wex-placeholder")) {
                        targetInput = angular.element(child);
                    }
                });
            });
        });

        describe("when the target input is focused", function() {
            beforeEach(function() {
                targetInput.triggerHandler("focus");
            });

            it("should clear the placeholder", function() {
                expect(targetInput[0].placeholder).toBeFalsy();
            });
        });

        describe("when the target input is blurred", function() {
            beforeEach(function() {
                targetInput.triggerHandler("blur");
            });

            it("should restore the placeholder", function() {
                expect(targetInput[0].placeholder).toEqual(mockPlaceholder);
            });
        });
    });
}());