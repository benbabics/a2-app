define(["backbone", "Squire", "globals"],
    function (Backbone, Squire, globals) {

        "use strict";

        var squire = new Squire(),
            driverReactivateModel;

        squire.mock("backbone", Backbone);

        describe("A Driver Reactivate Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverReactivateModel"], function (DriverReactivateModel) {
                    driverReactivateModel = new DriverReactivateModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverReactivateModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(driverReactivateModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a urlRoot property that", function () {
                it("is set to globals.contactUs.constants.WEBSERVICE", function () {
                    expect(driverReactivateModel.urlRoot).toEqual(globals.driverReactivate.constants.WEBSERVICE);
                });
            });

            describe("has property defaults that", function () {
                it("should set driverId to default", function () {
                    expect(driverReactivateModel.defaults.driverId).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(driverReactivateModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(driverReactivateModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverReactivateModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        driverReactivateModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(driverReactivateModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        driverReactivateModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(driverReactivateModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        driverId: "13465134561"
                    };

                    beforeEach(function () {
                        driverReactivateModel.initialize(options);
                    });

                    it("should call set 1 time", function () {
                        expect(driverReactivateModel.set.calls.count()).toEqual(1);
                    });

                    it("should set driverId", function () {
                        expect(driverReactivateModel.set).toHaveBeenCalledWith("driverId", options.driverId);
                    });
                });
            });
        });
    });
