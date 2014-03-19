define(["Squire"],
    function (Squire) {

        "use strict";

        // Mock application info
        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockAppController = {
                init: function () { },
                ready: function () { },
                alert: function () { }
            },
            appSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/AppController", mockAppController);

        describe("An App Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/app"], function (jasmineAppSubscriber) {
                    appSubscriber = jasmineAppSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(appSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.calls.mostRecent().args.length).toEqual(2);
                expect(mockFacade.subscribeTo.calls.mostRecent().args[0]).toEqual("app");
                expect(mockFacade.subscribeTo.calls.mostRecent().args[1]).toEqual(mockAppController);
            });

            it("should call subscribe 2 times", function () {
                expect(mockSubscribe.calls.count()).toEqual(2);
            });

            it("should subscribe to ready", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("ready", "ready");
            });

            it("should subscribe to alert", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("alert", "alert");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockAppController, "init").and.callThrough();
                    appSubscriber.init();
                });

                it("is defined", function () {
                    expect(appSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(appSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockAppController.init).toHaveBeenCalled();

                    expect(mockAppController.init.calls.mostRecent().args.length).toEqual(0);
                });
            });
        });
    });
