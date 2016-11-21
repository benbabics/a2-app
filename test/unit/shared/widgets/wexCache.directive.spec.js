(function () {
    "use strict";

    describe("A WEX Cache directive", function () {

        var self;

        beforeEach(function () {
            self = this;

            //test functions:
            self.createDirective = function(options) {
                var template = ["<div wex-cache"],
                    scope = self.$rootScope.$new();

                if (_.get(options, "useKey")) {
                    template.push("='mockCacheKey'");
                }

                if (_.get(options, "useModel")) {
                    template.push(" ng-model='mockModel'");
                }

                template.push("><div class='mock-content'></div></div>");

                var element = self.$compile(template.join(""))(scope);

                self.$rootScope.$digest();

                return {
                    element: element,
                    scope: scope
                };
            };

            //mock dependencies:
            self.WexCache = jasmine.createSpyObj("WexCache", [
                "clearPropertyValue",
                "getPropertyKey",
                "mergePropertyValue",
                "readPropertyValue",
                "storePropertyValue",
                "fetchPropertyValue"
            ]);

            module(function ($provide) {
                $provide.value("WexCache", self.WexCache);
            });

            inject(function ($compile, $rootScope) {
                self.$compile = $compile;
                self.$rootScope = $rootScope;
            });

            //setup mocks:
            self.cachedValue = TestUtils.getRandomStringThatIsAlphaNumeric(10);
        });

        afterEach(function () {
            self = null;
        });

        describe("if there is a model", function () {

            describe("when the value is initially cached", function () {

                beforeEach(function () {
                    this.WexCache.readPropertyValue.and.returnValue(this.cachedValue);

                    this.directive = this.createDirective({
                        useKey: true,
                        useModel: true
                    });
                });

                afterEach(function() {
                    this.directive.element.remove();
                });

                it("should update the model with the cached value", function () {
                    expect(this.directive.scope.mockModel).toEqual(this.cachedValue);
                });

                it("should render the content", function () {
                    expect(this.directive.element[0].querySelector(".mock-content")).toBeDefined();
                });
            });

            describe("when the value is NOT initially cached", function () {

                beforeEach(function () {
                    this.directive = this.createDirective({
                        useKey: true,
                        useModel: true
                    });
                });

                afterEach(function() {
                    this.directive.element.remove();
                });

                it("should NOT render the content", function () {
                    expect(this.directive.element[0].querySelector(".mock-content")).toBeFalsy();
                });

                it("should render the loading indicator", function () {
                    expect(this.directive.element[0].querySelector(".wex-cache-icon-loading")).toBeDefined();
                });

                describe("once the value is cached", function () {

                    beforeEach(function () {
                        this.WexCache.readPropertyValue.and.returnValue(this.cachedValue);
                        this.$rootScope.$digest();
                    });

                    it("should update the model with the cached value", function () {
                        expect(this.directive.scope.mockModel).toEqual(this.cachedValue);
                    });

                    it("should render the content", function () {
                        expect(this.directive.element[0].querySelector(".mock-content")).toBeDefined();
                    });

                    it("should NOT render the loading indicator", function () {
                        expect(this.directive.element[0].querySelector(".wex-cache-icon-loading")).toBeFalsy();
                    });
                });
            });
        });

        describe("if there is NOT a model", function () {

            describe("when the value is initially cached", function () {

                beforeEach(function () {
                    this.WexCache.readPropertyValue.and.returnValue(this.cachedValue);

                    this.directive = this.createDirective({
                        useKey: true,
                        useModel: false
                    });
                });

                afterEach(function() {
                    this.directive.element.remove();
                });

                it("should render the content", function () {
                    expect(this.directive.element[0].querySelector(".mock-content")).toBeDefined();
                });
            });

            describe("when the value is NOT initially cached", function () {

                beforeEach(function () {
                    this.directive = this.createDirective({
                        useKey: true,
                        useModel: false
                    });
                });

                afterEach(function() {
                    this.directive.element.remove();
                });

                it("should NOT render the content", function () {
                    expect(this.directive.element[0].querySelector(".mock-content")).toBeFalsy();
                });

                it("should render the loading indicator", function () {
                    expect(this.directive.element[0].querySelector(".wex-cache-icon-loading")).toBeDefined();
                });

                describe("once the value is cached", function () {

                    beforeEach(function () {
                        this.WexCache.readPropertyValue.and.returnValue(this.cachedValue);
                        this.$rootScope.$digest();
                    });

                    it("should render the content", function () {
                        expect(this.directive.element[0].querySelector(".mock-content")).toBeDefined();
                    });

                    it("should NOT render the loading indicator", function () {
                        expect(this.directive.element[0].querySelector(".wex-cache-icon-loading")).toBeFalsy();
                    });
                });
            });
        });
    });
})();