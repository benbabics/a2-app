define(["backbone", "Squire", "globals"],
    function (Backbone, Squire, globals) {

        "use strict";

        var squire = new Squire(),
            driverAddModel;

        squire.mock("backbone", Backbone);

        describe("A Driver Add Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverAddModel"], function (DriverAddModel) {
                    driverAddModel = new DriverAddModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(driverAddModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(driverAddModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has a urlRoot property that", function () {
                it("is set to globals.driverAdd.constants.WEBSERVICE", function () {
                    expect(driverAddModel.urlRoot).toEqual(globals.driverAdd.constants.WEBSERVICE);
                });
            });

            describe("has property defaults that", function () {
                it("should set driverId to default", function () {
                    expect(driverAddModel.defaults.driverId).toBeNull();
                });
                it("should set firstName to default", function () {
                    expect(driverAddModel.defaults.firstName).toBeNull();
                });
                it("should set middleInitial to default", function () {
                    expect(driverAddModel.defaults.middleInitial).toBeNull();
                });
                it("should set lastName to default", function () {
                    expect(driverAddModel.defaults.lastName).toBeNull();
                });
                it("should set departmentId to default", function () {
                    expect(driverAddModel.defaults.departmentId).toBeNull();
                });
            });

            describe("has property validation that", function () {
                describe("has a validation configuration for the driverId field that", function () {
                    it("should set the field as required", function () {
                        expect(driverAddModel.validation.driverId.required).toBeTruthy();
                    });

                    it("should set the length", function () {
                        expect(driverAddModel.validation.driverId.length).toEqual(4);
                    });

                    it("should set the pattern", function () {
                        expect(driverAddModel.validation.driverId.pattern).toEqual("digits");
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(driverAddModel.validation.driverId.msg)
                            .toEqual(globals.driverAdd.constants.ERROR_DRIVER_ID_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the firstName field that", function () {
                    it("should set the field as required", function () {
                        expect(driverAddModel.validation.firstName.required).toBeTruthy();
                    });

                    it("should set the maxLength", function () {
                        expect(driverAddModel.validation.firstName.maxLength).toEqual(11);
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(driverAddModel.validation.firstName.msg)
                            .toEqual(globals.driverAdd.constants.ERROR_FIRST_NAME_REQUIRED_FIELD);
                    });
                });

                describe("has a validation configuration for the lastName field that", function () {
                    it("should set the field as required", function () {
                        expect(driverAddModel.validation.lastName.required).toBeTruthy();
                    });

                    it("should set the maxLength", function () {
                        expect(driverAddModel.validation.lastName.maxLength).toEqual(12);
                    });

                    it("should set the error message when the field is not supplied", function () {
                        expect(driverAddModel.validation.lastName.msg)
                            .toEqual(globals.driverAdd.constants.ERROR_LAST_NAME_REQUIRED_FIELD);
                    });
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(driverAddModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(driverAddModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        driverAddModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(driverAddModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        driverAddModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(driverAddModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        driverId     : "13465134561",
                        firstName    : "First Name",
                        middleInitial: "X",
                        lastName     : "Last Name",
                        departmentId : "52v4612345"
                    };

                    beforeEach(function () {
                        driverAddModel.initialize(options);
                    });

                    it("should call set 5 times", function () {
                        expect(driverAddModel.set.calls.count()).toEqual(5);
                    });

                    it("should set driverId", function () {
                        expect(driverAddModel.set).toHaveBeenCalledWith("driverId", options.driverId);
                    });

                    it("should set firstName", function () {
                        expect(driverAddModel.set).toHaveBeenCalledWith("firstName", options.firstName);
                    });

                    it("should set middleInitial", function () {
                        expect(driverAddModel.set).toHaveBeenCalledWith("middleInitial", options.middleInitial);
                    });

                    it("should set lastName", function () {
                        expect(driverAddModel.set).toHaveBeenCalledWith("lastName", options.lastName);
                    });

                    it("should set departmentId", function () {
                        expect(driverAddModel.set).toHaveBeenCalledWith("departmentId", options.departmentId);
                    });
                });
            });
        });
    });
