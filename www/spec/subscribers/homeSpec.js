define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").andReturn(mockSubscribe)
            },
            mockHomeController = {
                init: function () { }
            },
            homeSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/HomeController", mockHomeController);

        describe("A Home Subscriber", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
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

                expect(mockFacade.subscribeTo.mostRecentCall.args.length).toEqual(2);
                expect(mockFacade.subscribeTo.mostRecentCall.args[0]).toEqual("home");
                expect(mockFacade.subscribeTo.mostRecentCall.args[1]).toEqual(mockHomeController);
            });

            it("should call subscribe 1 time", function () {
                expect(mockSubscribe.calls.length).toEqual(1);
            });

            it("should subscribe to navigate", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigate", "navigate");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockHomeController, "init").andCallThrough();
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

                    expect(mockHomeController.init.mostRecentCall.args.length).toEqual(0);
                });
            });
        });
    });
