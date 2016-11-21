(function () {
    "use strict";

    describe("A Validate Email Directive", function () {
        var form, $scope, element;

        beforeEach(inject(function ($rootScope, $compile) {
            $scope = $rootScope.$new();

            //null out the input value to start
            $scope.model = {emailAddress: null};

            //Compile the angular markup to get a form that uses the directive
            element = angular.element("<form name='form'><input name='emailAddress' type='email' validate-email ng-model='model.emailAddress'></form>");
            $compile(element)($scope);
            form = $scope.form;
        }));

        afterEach(function() {
            element.remove();
        });

        describe("modifies an input field that", function () {
            it("should pass validation when the input is null", function () {
                form.emailAddress.$setViewValue(null);
                $scope.$digest();

                expect($scope.model.emailAddress).toBeNull();
                expect(form.emailAddress.$valid).toBe(true);
            });

            it("should pass validation when the input is empty", function () {
                form.emailAddress.$setViewValue("");
                $scope.$digest();

                expect($scope.model.emailAddress).toEqual("");
                expect(form.emailAddress.$valid).toBe(true);
            });

            it("should pass validation when the input is an email address", function () {
                form.emailAddress.$setViewValue("Q@billionaire.com");
                $scope.$digest();

                expect($scope.model.emailAddress).toEqual("Q@billionaire.com");
                expect(form.emailAddress.$valid).toBe(true);
            });

            it("should fail validation when the input is not an email address", function () {
                form.emailAddress.$setViewValue("Q@b");
                $scope.$digest();

                expect($scope.model.emailAddress).toEqual(undefined);
                expect(form.emailAddress.$valid).toBe(false);
            });
        });
    });
})();