(function(){
    describe("A Wex Integer Directive", function () {
        var form, $scope, element;

        beforeEach(inject(function($rootScope, $compile) {
            $scope = $rootScope.$new();

            //null out the input value to start
            $scope.model = {integerInput: null};

            //Compile the angular markup to get a form that uses the directive
            element = angular.element("<form name='form'><input name='integerInput' wex-integer ng-model='model.integerInput'></form>");
            $compile(element)($scope);
            form = $scope.form;
        }));

        afterEach(function() {
            element.remove();
        });

        describe("modifies an input field that", function () {
            it("should pass validation when the input is an integer", function () {
                form.integerInput.$setViewValue("4");
                $scope.$digest();

                expect($scope.model.integerInput).toEqual("4");
                expect(form.integerInput.$valid).toBe(true);
            });

            it("should fail validation when the input is not an integer", function () {
                form.integerInput.$setViewValue("w");
                $scope.$digest();

                expect($scope.model.integerInput).toEqual(undefined);
                expect(form.integerInput.$valid).toBe(false);
            });

            it("should add the tel type to the input field", function () {
                $scope.$digest();
                expect(element.find("input").attr("type")).toEqual("tel");
            });
        });
    });
})();