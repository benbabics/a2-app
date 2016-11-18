(function(){
    describe("A Wex Submit Directive", function () {
        var form, $scope;

        beforeEach(inject(function ($rootScope, $compile) {
            $scope = $rootScope.$new();

            //Compile the angular markup to get a form that uses the directive
            form = angular.element("<form name='form'><wex-submit>Submit</wex-submit></form>");
            $compile(form)($scope);
            $scope.$digest();
        }));

        afterEach(function() {
            form.remove();
        });

        describe("creates a button that", function () {
            var button;

            beforeEach(function () {
                button = form.find("button");
            });

            it("should be a submit button", function () {
                expect(button.attr("type")).toEqual("submit");
            });

            it("should set the scope's submitted value when clicked", function () {
                expect(button.attr("ng-click")).toEqual("submitted=true");
            });

            //use toContain to test for transcluded text because extra markup is added by angular.
            it("should set the button's text to be the text within the wex-submit tag", function () {
                expect(button.html()).toContain("Submit");
            });
        });
    });
})();
