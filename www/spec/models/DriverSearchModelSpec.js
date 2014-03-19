define(["backbone", "Squire"],
    function (Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            driverSearchModel;

        squire.mock("backbone", Backbone);

        describe("A Driver Search Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverSearchModel"], function (DriverSearchModel) {
                    driverSearchModel = new DriverSearchModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverSearchModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(driverSearchModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set filterFirstName to default", function () {
                    expect(driverSearchModel.defaults.filterFirstName).toBeNull();
                });

                it("should set filterLastName to default", function () {
                    expect(driverSearchModel.defaults.filterLastName).toBeNull();
                });

                it("should set filterDriverId to default", function () {
                    expect(driverSearchModel.defaults.filterDriverId).toBeNull();
                });

                it("should set filterStatus to default", function () {
                    expect(driverSearchModel.defaults.filterStatus).toBeNull();
                });

                it("should set filterDepartmentId to default", function () {
                    expect(driverSearchModel.defaults.filterDepartmentId).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    driverSearchModel.initialize();
                });

                it("is defined", function () {
                    expect(driverSearchModel.initialize).toBeDefined();
                });
            });
        });
    });
