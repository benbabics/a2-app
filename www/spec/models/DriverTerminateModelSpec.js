define(["backbone", "Squire", "globals"],
    function (Backbone, Squire, globals) {

        "use strict";

        var squire = new Squire(),
            driverTerminateModel;

        squire.mock("backbone", Backbone);

        describe("A Driver Terminate Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverTerminateModel"], function (DriverTerminateModel) {
                    driverTerminateModel = new DriverTerminateModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverTerminateModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(driverTerminateModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a urlRoot property that", function () {
                it("is set to globals.contactUs.constants.WEBSERVICE", function () {
                    expect(driverTerminateModel.urlRoot).toEqual(globals.driverTerminate.constants.WEBSERVICE);
                });
            });

            describe("has property defaults that", function () {
                it("should set driverId to default", function () {
                    expect(driverTerminateModel.defaults.driverId).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(driverTerminateModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(driverTerminateModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverTerminateModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        driverTerminateModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(driverTerminateModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        driverTerminateModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(driverTerminateModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        driverId: "13465134561"
                    };

                    beforeEach(function () {
                        driverTerminateModel.initialize(options);
                    });

                    it("should call set 1 time", function () {
                        expect(driverTerminateModel.set.calls.count()).toEqual(1);
                    });

                    it("should set driverId", function () {
                        expect(driverTerminateModel.set).toHaveBeenCalledWith("driverId", options.driverId);
                    });
                });
            });
        });
    });
