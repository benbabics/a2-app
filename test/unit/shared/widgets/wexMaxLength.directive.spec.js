(function () {
    "use strict";

    describe("A WEX Max Length directive", function () {

        var form, $scope, element;

        beforeEach(inject(function ($rootScope, $compile) {
            $scope = $rootScope.$new();

            //null out the input value to start
            $scope.model = {textInput: null};

            //Compile the angular markup to get a form that uses the directive
            element = angular.element("<form name='form'><input name='textInput' wex-max-length='10' ng-model='model.textInput'></form>");
            $compile(element)($scope);
            form = $scope.form;
        }));

        describe("modifies an input field that", function () {

            it("should NOT modify the value when the input length is less than the max length", function () {
                var value = TestUtils.getRandomStringThatIsAlphaNumeric(9);

                form.textInput.$setViewValue(value);
                $scope.$digest();

                expect(form.textInput.$viewValue).toEqual(value);
                expect($scope.model.textInput).toEqual(value);
            });

            it("should NOT modify the value when the input length equals the max length", function () {
                var value = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                form.textInput.$setViewValue(value);
                $scope.$digest();

                expect(form.textInput.$viewValue).toEqual(value);
                expect($scope.model.textInput).toEqual(value);
            });

            it("should modify the value when the input length is greater than the max length", function () {
                var expectedValue = TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    enteredValue = expectedValue + TestUtils.getRandomStringThatIsAlphaNumeric(1);

                form.textInput.$setViewValue(enteredValue);
                $scope.$digest();

                expect(form.textInput.$viewValue).toEqual(expectedValue);
                expect($scope.model.textInput).toEqual(expectedValue);
            });

        });

    });

}());