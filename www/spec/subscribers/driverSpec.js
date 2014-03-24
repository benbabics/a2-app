define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").and.returnValue(mockSubscribe)
            },
            mockDriverController = {
                init: function () { }
            },
            driverSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/DriverController", mockDriverController);

        describe("A Driver Subscriber", function () {
            beforeEach(function (done) {
                squire.require(["subscribers/driver"], function (jasmineDriverSubscriber) {
                    driverSubscriber = jasmineDriverSubscriber;
                    done();
                });
            });

            it("is defined", function () {
                expect(driverSubscriber).toBeDefined();
            });

            it("should call the subscribeTo function on the facade", function () {
                expect(mockFacade.subscribeTo).toHaveBeenCalled();

                expect(mockFacade.subscribeTo.calls.mostRecent().args.length).toEqual(2);
                expect(mockFacade.subscribeTo.calls.mostRecent().args[0]).toEqual("driver");
                expect(mockFacade.subscribeTo.calls.mostRecent().args[1]).toEqual(mockDriverController);
            });

            it("should call subscribe 2 times", function () {
                expect(mockSubscribe.calls.count()).toEqual(2);
            });

            it("should subscribe to navigateSearch", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigateSearch", "navigateSearch");
            });

            it("should subscribe to navigateDriverDetails", function () {
                expect(mockSubscribe).toHaveBeenCalledWith("navigateDriverDetails", "navigateDriverDetails");
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockDriverController, "init").and.callThrough();
                    driverSubscriber.init();
                });

                it("is defined", function () {
                    expect(driverSubscriber.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSubscriber.init).toEqual(jasmine.any(Function));
                });

                it("should call the init function on the controller", function () {
                    expect(mockDriverController.init).toHaveBeenCalled();

                    expect(mockDriverController.init.calls.mostRecent().args.length).toEqual(0);
                });
            });
        });
    });
