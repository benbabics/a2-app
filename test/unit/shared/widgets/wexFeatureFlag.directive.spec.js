(function () {
    "use strict";

    describe("A WEX Feature Flag directive", function () {

        var self;

        beforeEach(function () {
            self = this;
        });

        afterEach(function () {
            self = null;
        });

        beforeEach(function () {
            //test functions:
            self.createDirective = function(feature) {
                //NOTE: The directive needs to be wrapped with a parent div element in order to test element.remove().
                var template = ["<div><div wex-feature-flag"],
                    scope = self.$rootScope.$new();

                if (feature) {
                    template.push("='");
                    template.push(feature);
                    template.push("' ");
                }

                template.push(">ELEMENT_CONTENT</div></div>");

                var element = self.$compile(template.join(""))(scope);

                self.$rootScope.$digest();

                return {
                    element: element.children(),
                    scope: scope
                };
            };

            inject(function ($compile, $rootScope, globals) {
                self.$compile = $compile;
                self.$rootScope = $rootScope;
                self.globals = globals;
            });
        });

        afterEach(function () {
            if (this.directive && this.directive.element) {
                this.directive.element.remove();
            }
        });

        describe("when given a feature", function () {

            beforeEach(function () {
                this.feature = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            describe("when the feature is enabled", function () {

                beforeEach(function () {
                    this.globals.FEATURE_FLAGS[this.feature.toUpperCase()] = true;

                    this.directive = this.createDirective(this.feature);
                    this.$rootScope.$digest();
                });

                it("should NOT remove the element", function () {
                    expect(this.directive.element.html()).not.toBeFalsy();
                });
            });

            describe("when the feature is disabled", function () {

                beforeEach(function () {
                    this.globals.FEATURE_FLAGS[this.feature.toUpperCase()] = false;

                    this.directive = this.createDirective(this.feature);
                    this.$rootScope.$digest();
                });

                it("should remove the element", function () {
                    expect(this.directive.element.html()).toBeFalsy();
                });
            });
        });

        describe("when NOT given a feature", function () {

            beforeEach(function () {
                this.directive = this.createDirective();
                this.$rootScope.$digest();
            });

            it("should NOT remove the element", function () {
                expect(this.directive.element.html()).not.toBeFalsy();
            });
        });
    });
})();
