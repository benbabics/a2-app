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
                init: function () { }
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
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.calls.mostRecent().args.length).toEqual(2);
                expect(mockFacade.subscribeTo.calls.mostRecent().args[0]).toEqual("home");
                expect(mockFacade.subscribeTo.calls.mostRecent().args[1]).toEqual(mockHomeController);
            });

            it("should call subscribe 1 time", function () {
                expect(mockSubscribe.calls.count()).toEqual(1);
            });

            it("should subscribe to navigate", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigate", "navigate");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockHomeController, "init").and.callThrough();
                    homeSubscriber.init();
                });

                it("is defined", function () {
                    expect(homeSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(homeSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockHomeController.init).toHaveBeenCalled();

                    expect(mockHomeController.init.calls.mostRecent().args.length).toEqual(0);
                });
            });
        });
    });
