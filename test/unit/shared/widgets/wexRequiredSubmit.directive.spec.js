(function () {
    "use strict";

    describe("A WEX Required Submit directive", function () {

        var $scope,
            $rootScope,
            CommonService,
            formModel,
            directiveForm,
            submitButton,
            mockInput,
            mockSubmitText = "mock submit";

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, $compile, _CommonService_) {
                $rootScope = _$rootScope_;

                CommonService = _CommonService_;

                $scope = $rootScope.$new();

                $scope.mockSubmitText = mockSubmitText;

                //Compile the angular markup to get an instance of the directive
                directiveForm = $compile([
                    '<form novalidate name="formModel">',
                    '<input type="text" name="mockInput" ng-model="mockInputModel" required>',
                    '<wex-required-submit text="{{mockSubmitText}}"></wex-required-submit>',
                    '</form>'
                ].join(""))($scope);

                $rootScope.$digest();

                formModel = $scope.formModel;

                submitButton = directiveForm.find("button");
                mockInput = directiveForm.find("input");
            });
        });

        describe("should add a submit button that", function() {
            it("should exist", function() {
                expect(submitButton).toBeDefined();
                expect(submitButton).not.toBeNull();
            });

            it("should have the expected label text", function() {
                expect(submitButton.html()).toContain(mockSubmitText);
            });

            it("should be disabled by default", function() {
                expect(submitButton.attr("ng-disabled")).toEqual("true");
            });

            describe("when all required fields are empty", function() {
                beforeEach(function() {
                    mockInput.val("").triggerHandler("input");
                    $rootScope.$digest();
                });

                it("should be disabled", function() {
                    expect(submitButton.attr("ng-disabled")).toEqual("true");
                });
            });

            describe("when all required fields have data", function() {
                beforeEach(function() {
                    mockInput.val("mock data").triggerHandler("input");
                    $rootScope.$digest();
                });

                it("should be enabled", function() {
                    expect(submitButton.attr("ng-disabled")).toEqual("false");
                });
            });
        });
    });
}());