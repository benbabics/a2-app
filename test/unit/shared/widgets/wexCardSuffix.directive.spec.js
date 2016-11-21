(function(){
    describe("A Wex Card Suffix Directive", function () {
        var form, $scope, element;

        beforeEach(inject(function ($rootScope, $compile) {
            $scope = $rootScope.$new();

            //null out the input value to start
            $scope.model = {integerInput: null};

            //Compile the angular markup to get a form that uses the directive
            element = angular.element("<form name='form'><input name='cardSuffixInput' wex-card-suffix ng-model='model.cardSuffixInput'></form>");
            $compile(element)($scope);
            form = $scope.form;
        }));

        afterEach(function() {
            element.remove();
        });

        describe("modifies an input field that", function () {

            it("should pass validation when the input is formatted as a card suffix", function () {
                form.cardSuffixInput.$setViewValue("4444-4");
                $scope.$digest();

                expect($scope.model.cardSuffixInput).toEqual("4444-4");
                expect(form.cardSuffixInput.$valid).toBe(true);
            });

            it("should fail validation when the input is not an integer", function () {
                form.cardSuffixInput.$setViewValue("4444-w");
                $scope.$digest();

                expect($scope.model.cardSuffixInput).toEqual(undefined);
                expect(form.cardSuffixInput.$valid).toBe(false);
            });

            it("should add a hyphen after 4 numbers have been entered", function () {
                form.cardSuffixInput.$setViewValue("4444");
                $scope.$digest();

                expect($scope.model.cardSuffixInput).toEqual("4444-");
            });

            it("should add the tel type to the input field", function () {
                $scope.$digest();
                expect(element.find("input").attr("type")).toEqual("tel");
            });
        });
    });
})();
