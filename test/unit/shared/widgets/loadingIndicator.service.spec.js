(function () {
    "use strict";

    describe("A LoadingIndicator service", function () {

        var self;

        beforeAll(function () {
            this.commonSharedMockExclusions = ["LoadingIndicator"];
        });

        beforeEach(function () {
            self = this;

            //mock dependencies
            self.$ionicLoading = jasmine.createSpyObj("$ionicLoading", ["hide", "show"]);

            module(function ($provide) {
                $provide.value("$ionicLoading", self.$ionicLoading);
            });

            inject(function (_$q_, _$rootScope_, _LoadingIndicator_) {
                self.LoadingIndicator = _LoadingIndicator_;
                self.$q = _$q_;
                self.$rootScope = _$rootScope_;
            });
        });

        afterAll(function () {
            self = null;
        });

        describe("has an app:loadingBegin event handler function that", function () {
            beforeEach(function() {
                this.showDeferred = this.$q.defer();
                this.$ionicLoading.show.and.returnValue(this.showDeferred.promise);
            });

            describe("when the loadingIndicatorCount > 0", function() {
                beforeEach(function() {
                    this.LoadingIndicator.begin(); // Increments loadingIndicatorCount
                    this.$rootScope.$emit("app:loadingBegin");
                });

                it("should call $ionicLoading.show", function () {
                    expect(this.$ionicLoading.show).toHaveBeenCalled();
                });

                it("should display an ion-spinner", function () {
                    expect(this.$ionicLoading.show.calls.mostRecent().args).toEqual([{
                        template: "<ion-spinner class='spinner-light'></ion-spinner>"
                    }]);
                });

                describe("when the $ionicLoading.show promise is resolved", function() {
                    beforeEach(function() {
                        spyOn(this.$rootScope, "$emit");
                        spyOn(this.LoadingIndicator, "complete");
                        this.showDeferred.resolve();
                        this.$rootScope.$digest();
                    });

                    it("should NOT call complete()", function() {
                        expect(this.$rootScope.$emit).not.toHaveBeenCalledWith("app:loadingComplete");
                    });
                });
            });

            describe("when the loadingIndicatorCount == 0", function() {
                beforeEach(function() {
                    this.$rootScope.$emit("app:loadingBegin");
                });

                it("should call $ionicLoading.show", function () {
                    expect(this.$ionicLoading.show).toHaveBeenCalled();
                });

                it("should display an ion-spinner", function () {
                    expect(this.$ionicLoading.show.calls.mostRecent().args).toEqual([{
                        template: "<ion-spinner class='spinner-light'></ion-spinner>"
                    }]);
                });

                describe("when the $ionicLoading.show promise is resolved", function() {
                    beforeEach(function() {
                        spyOn(this.$rootScope, "$emit");
                        spyOn(this.LoadingIndicator, "complete");
                        this.showDeferred.resolve();
                        this.$rootScope.$digest();
                    });

                    it("should call complete()", function() {
                        expect(this.$rootScope.$emit).toHaveBeenCalledWith("app:loadingComplete");
                    });
                });
            });
        });

        describe("has an app:loadingComplete event handler function that", function () {

            beforeEach(function () {
                this.$rootScope.$emit("app:loadingComplete");
            });

            it("should call $ionicLoading.hide", function () {
                expect(this.$ionicLoading.hide).toHaveBeenCalledWith();
            });
        });

        describe("has a begin function that", function () {
            beforeEach(function () {
                spyOn(this.$rootScope, "$emit");
            });

            it("should broadcast the app:loadingBegin event when the first call is made.", function () {
                this.LoadingIndicator.begin();

                expect(this.$rootScope.$emit).toHaveBeenCalledWith("app:loadingBegin");
            });

            it("should not emit the app:begin event when subsequent calls are made", function () {
                this.LoadingIndicator.begin();
                this.LoadingIndicator.begin();

                expect(this.$rootScope.$emit.calls.count()).toBe(1);
            });
        });

        describe("has a complete function that", function () {
            beforeEach(function () {
                spyOn(this.$rootScope, "$emit");
            });

            it("should not emit the app:loadingComplete event when multiple calls to begin were made", function () {
                this.LoadingIndicator.begin();
                this.LoadingIndicator.begin();
                this.LoadingIndicator.complete();

                expect(this.$rootScope.$emit).not.toHaveBeenCalledWith("app:loadingComplete");
            });

            it("should emit the app:loadingComplete event when the number of complete calls equals the number of begin calls", function () {
                this.LoadingIndicator.begin();
                this.LoadingIndicator.complete();
                this.LoadingIndicator.complete();

                expect(this.$rootScope.$emit).toHaveBeenCalledWith("app:loadingComplete");
            });
        });
    });
})();
