define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            driverSettingsModel;

        squire.mock("backbone", Backbone);

        describe("A Driver Settings Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverSettingsModel"], function (DriverSettingsModel) {
                    driverSettingsModel = new DriverSettingsModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverSettingsModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(driverSettingsModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set idFixedLength to default", function () {
                    expect(driverSettingsModel.defaults.idFixedLength).toBeNull();
                });

                it("should set firstNameMaxLength to default", function () {
                    expect(driverSettingsModel.defaults.firstNameMaxLength).toBeNull();
                });

                it("should set middleNameMaxLength to default", function () {
                    expect(driverSettingsModel.defaults.middleNameMaxLength).toBeNull();
                });

                it("should set lastNameMaxLength to default", function () {
                    expect(driverSettingsModel.defaults.lastNameMaxLength).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(driverSettingsModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(driverSettingsModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverSettingsModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        driverSettingsModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(driverSettingsModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        driverSettingsModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(driverSettingsModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        idFixedLength: 1,
                        firstNameMaxLength: 2,
                        middleNameMaxLength: 3,
                        lastNameMaxLength: 4
                    };

                    beforeEach(function () {
                        driverSettingsModel.initialize(options);
                    });

                    it("should call set 4 times", function () {
                        expect(driverSettingsModel.set.calls.count()).toEqual(4);
                    });

                    it("should set idFixedLength", function () {
                        expect(driverSettingsModel.set)
                            .toHaveBeenCalledWith("idFixedLength", options.idFixedLength);
                    });

                    it("should set firstNameMaxLength", function () {
                        expect(driverSettingsModel.set)
                            .toHaveBeenCalledWith("firstNameMaxLength", options.firstNameMaxLength);
                    });

                    it("should set middleNameMaxLength", function () {
                        expect(driverSettingsModel.set)
                            .toHaveBeenCalledWith("middleNameMaxLength", options.middleNameMaxLength);
                    });

                    it("should set lastNameMaxLength", function () {
                        expect(driverSettingsModel.set)
                            .toHaveBeenCalledWith("lastNameMaxLength", options.lastNameMaxLength);
                    });
                });
            });
        });
    });
