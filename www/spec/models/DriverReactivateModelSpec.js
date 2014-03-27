define(["backbone", "Squire", "globals"],
    function (Backbone, Squire, globals) {

        "use strict";

        var squire = new Squire(),
            DriverReactivateModel,
            driverReactivateModel;

        squire.mock("backbone", Backbone);

        describe("A Driver Reactivate Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverReactivateModel"], function (JasmineDriverReactivateModel) {
                    DriverReactivateModel = JasmineDriverReactivateModel;
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
                it("is set to globals.driverReactivate.constants.WEBSERVICE", function () {
                    expect(driverReactivateModel.urlRoot).toEqual(globals.driverReactivate.constants.WEBSERVICE);
                });
            });

            describe("has a defaults function that", function () {
                it("is defined", function () {
                    expect(driverReactivateModel.defaults).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverReactivateModel.defaults).toEqual(jasmine.any(Function));
                });

                it("should set driverId to default", function () {
                    expect(driverReactivateModel.defaults().driverId).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(DriverReactivateModel.__super__, "initialize").and.callFake(function () { });
                    spyOn(driverReactivateModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(driverReactivateModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverReactivateModel.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super", function () {
                    driverReactivateModel.initialize();

                    expect(DriverReactivateModel.__super__.initialize).toHaveBeenCalledWith();
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
