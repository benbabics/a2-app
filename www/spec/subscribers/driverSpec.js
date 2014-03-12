define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            mockSubscribe = jasmine.createSpy("subscribe() spy"),
            mockFacade = {
                subscribeTo: jasmine.createSpy("subscribeTo() spy").andReturn(mockSubscribe)
            },
            mockDriverController = {
                init: function () { }
            },
            driverSubscriber;

        squire.mock("facade", mockFacade);
        squire.mock("controllers/DriverController", mockDriverController);

        describe("A Driver Subscriber", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
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

                expect(mockFacade.subscribeTo.mostRecentCall.args.length).toEqual(2);
                expect(mockFacade.subscribeTo.mostRecentCall.args[0]).toEqual("driver");
                expect(mockFacade.subscribeTo.mostRecentCall.args[1]).toEqual(mockDriverController);
            });

            it("should call subscribe 0 times", function () {
                expect(mockSubscribe.calls.length).toEqual(0);
            });

            describe("has an init function that", function () {
                beforeEach(function () {
                    spyOn(mockDriverController, "init").andCallThrough();
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

                    expect(mockDriverController.init.mostRecentCall.args.length).toEqual(0);
                });
            });
        });
    });
