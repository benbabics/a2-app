(function () {
    "use strict";

    describe("A WEX Colored Currency directive", function () {

        var $scope,
            element,
            model;

        beforeEach(inject(function ($rootScope, $compile) {
            $scope = $rootScope.$new();

            // null out the amount value to start
            $scope.model = {amount: null};

            // Compile the angular markup to get an element that uses the directive
            element = angular.element("<span wex-colored-currency ng-model='model.amount'></span>");
            $compile(element)($scope);
            model = $scope.model;
        }));

        afterEach(function() {
            element.remove();
        });

        describe("modifies an element that", function () {

            describe("when the amount is greater than zero", function () {

                beforeEach(function () {
                    model.amount = TestUtils.getRandomNumber(0.01, 9999);
                    $scope.$digest();
                });

                it("should add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-positive")).toBeTruthy();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-negative")).toBeFalsy();
                });

            });

            describe("when the amount is zero", function () {

                beforeEach(function () {
                    model.amount = 0;
                    $scope.$digest();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-positive")).toBeFalsy();
                });

                it("should add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-negative")).toBeTruthy();
                });

            });

            describe("when the amount is less than zero", function () {

                beforeEach(function () {
                    model.amount = 0 - TestUtils.getRandomNumber(0.01, 9999);
                    $scope.$digest();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-positive")).toBeFalsy();
                });

                it("should add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-negative")).toBeTruthy();
                });

            });

            describe("when the amount is a object", function () {

                beforeEach(function () {
                    model.amount = {};
                    $scope.$digest();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-positive")).toBeFalsy();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-negative")).toBeFalsy();
                });

            });

            describe("when the amount is a string", function () {

                beforeEach(function () {
                    model.amount = TestUtils.getRandomStringThatIsAlphaNumeric(1);
                    $scope.$digest();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-positive")).toBeFalsy();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-negative")).toBeFalsy();
                });

            });

            describe("when the amount is null", function () {

                beforeEach(function () {
                    model.amount = null;
                    $scope.$digest();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-positive")).toBeFalsy();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-negative")).toBeFalsy();
                });

            });

            describe("when the amount is undefined", function () {

                beforeEach(function () {
                    delete model.amount;
                    $scope.$digest();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-positive")).toBeFalsy();
                });

                it("should NOT add the 'balance-positive' class to the content element", function () {
                    expect(element.hasClass("balance-negative")).toBeFalsy();
                });

            });

        });

    });

}());