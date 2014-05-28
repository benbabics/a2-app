define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockHomeController = {
                init: jasmine.createSpy("init() spy"),
                beforeNavigateCondition: jasmine.createSpy("beforeNavigateCondition() spy")
            },
            homeSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/HomeController", mockHomeController);

        describe("A Home Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/home"], function (jasmineHomeSubscriber) {
                    homeSubscriber = jasmineHomeSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(homeSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalledWith("home", mockHomeController);
            });

            it("should call subscribe 1 time", function () {
                expect(mockSubscribe.calls.count()).toEqual(1);
            });

            it("should subscribe to navigate", function () {
                expect(mockSubscribe)
                    .toHaveBeenCalledWith("navigate", "navigate", mockHomeController.beforeNavigateCondition);
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    homeSubscriber.init();
                });

                it("is defined", function () {
                    expect(homeSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockHomeController.init).toHaveBeenCalledWith();
                });
            });
        });
    });
