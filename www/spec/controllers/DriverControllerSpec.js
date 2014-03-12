define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            driverController;

        describe("A Driver Controller", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["controllers/DriverController"], function (DriverController) {
                    driverController = DriverController;

                    done();
                });
            });

            it("is defined", function () {
                expect(driverController).toBeDefined();
            });

            describe("has constructor that", function () {
                it("is defined", function () {
                    expect(driverController.construct).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.construct).toEqual(jasmine.any(Function));
                });
            });

            describe("has an init function that", function () {
                it("is defined", function () {
                    expect(driverController.init).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverController.init).toEqual(jasmine.any(Function));
                });
            });
        });
    });
