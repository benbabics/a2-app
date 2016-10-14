(function () {
    "use strict";

    describe("A WEX Required directive", function () {

        var $scope,
            $rootScope,
            directiveFormInput,
            targetInput,
            directiveForm,
            mockInput,
            mockText = "Mock text";

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, $compile) {
                $rootScope = _$rootScope_;

                $scope = $rootScope.$new();

                //Compile the angular markup to get an instance of the directive
                directiveFormInput = $compile([
                    "<form novalidate name='formModel'>",
                    "<input type='text' ng-model='mockInputModel' name='mockInput' class='wex-required' required>",
                    "</form>"
                ].join(""))($scope);

                $rootScope.$digest();

                //get the form and mock input object
                directiveForm = $scope.formModel;
                mockInput = directiveForm.mockInput;

                //get the form input element
                _.each(directiveFormInput.children(), function (child) {
                    if (child.className.indexOf("wex-required") !== -1) {
                        targetInput = angular.element(child);
                    }
                });
            });
        });

        describe("when the form has NOT been submitted", function () {

            describe("when the user has modified the field and left data", function () {

                beforeEach(function () {
                    mockInput.$setViewValue(mockText);
                    $rootScope.$digest();
                });

                it("should NOT set the target field's required error to true", function () {
                    expect(mockInput.$error.required).toBeFalsy();
                });
            });

            describe("when the user has modified the field and left it blank", function () {

                beforeEach(function () {
                    mockInput.$setViewValue("");
                    $rootScope.$digest();

                    targetInput.triggerHandler("change");
                    targetInput.triggerHandler("keyup");
                    $rootScope.$digest();
                });

                it("should set the target field's required error to true", function () {
                    expect(mockInput.$error.required).toBeTruthy();
                });
            });
        });

        describe("when the form has been submitted", function () {
            beforeEach(function () {
                mockInput.$setViewValue("");
                mockInput.$setPristine();
                $rootScope.$digest();

                directiveForm.$setSubmitted();
                $rootScope.$digest();
            });

            describe("when the user has NOT modified the field since it was submitted", function () {

                it("should set the target field's required error to true", function () {
                    expect(mockInput.$error.required).toBeDefined();
                    expect(mockInput.$error.required).toBeTruthy();
                });
            });

            describe("when the user has modified the field since it was submitted and left data", function () {

                beforeEach(function () {
                    mockInput.$setViewValue(mockText);
                    $rootScope.$digest();
                });

                it("should NOT set the target field's required error to true", function () {
                    expect(mockInput.$error.required).toBeFalsy();
                });
            });

            describe("when the user has modified the field since it was submitted and left it blank", function () {

                beforeEach(function () {
                    mockInput.$setViewValue("");
                    $rootScope.$digest();

                    targetInput.triggerHandler("change");
                    targetInput.triggerHandler("keyup");
                    $rootScope.$digest();
                });

                it("should set the target field's required error to true", function () {
                    expect(mockInput.$error.required).toBeTruthy();
                });
            });
        });
    });
}());