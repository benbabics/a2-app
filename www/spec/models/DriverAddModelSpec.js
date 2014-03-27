define(["backbone", "Squire", "globals"],
    function (Backbone, Squire, globals) {

        "use strict";

        var squire = new Squire(),
            DriverAddModel,
            driverAddModel;

        squire.mock("backbone", Backbone);

        describe("A Driver Add Model", function () {
            beforeEach(function (done) {
                squire.require(["models/DriverAddModel"], function (JasmineDriverAddModel) {
                    DriverAddModel = JasmineDriverAddModel;
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

            describe("has a defaults function that", function () {
                it("is defined", function () {
                    expect(driverAddModel.defaults).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddModel.defaults).toEqual(jasmine.any(Function));
                });

                it("should set driverId to default", function () {
                    expect(driverAddModel.defaults().driverId).toBeNull();
                });

                it("should set firstName to default", function () {
                    expect(driverAddModel.defaults().firstName).toBeNull();
                });

                it("should set middleInitial to default", function () {
                    expect(driverAddModel.defaults().middleInitial).toBeNull();
                });

                it("should set lastName to default", function () {
                    expect(driverAddModel.defaults().lastName).toBeNull();
                });

                it("should set departmentId to default", function () {
                    expect(driverAddModel.defaults().departmentId).toBeNull();
                });
            });

            describe("has property validation that", function () {
                describe("has a validation configuration for the driverId field that", function () {
                    it("has 3 validation rules", function () {
                        expect(driverAddModel.validation.driverId.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(driverAddModel.validation.driverId[0].required).toBeTruthy();
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.driverId[0].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_DRIVER_ID_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        it("should set the field length", function () {
                            expect(driverAddModel.validation.driverId[1].length).toEqual(4);
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.driverId[1].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_DRIVER_ID_INVALID_LENGTH);
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(driverAddModel.validation.driverId[2].pattern).toEqual("digits");
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.driverId[2].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_DRIVER_ID_INVALID_FORMAT);
                        });
                    });
                });

                describe("has a validation configuration for the firstName field that", function () {
                    it("has 3 validation rules", function () {
                        expect(driverAddModel.validation.firstName.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(driverAddModel.validation.firstName[0].required).toBeTruthy();
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.firstName[0].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_FIRST_NAME_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        it("should set the maxLength", function () {
                            expect(driverAddModel.validation.firstName[1].maxLength).toEqual(11);
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.firstName[1].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_FIRST_NAME_INVALID_LENGTH);
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(driverAddModel.validation.firstName[2].pattern)
                                .toEqual(/^[A-Z\d`~&_\-+{}|:',.\/]+$/i);
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.firstName[2].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_FIRST_NAME_INVALID_CHARACTERS);
                        });
                    });
                });

                describe("has a validation configuration for the middleInitial field that", function () {
                    it("has 2 validation rules", function () {
                        expect(driverAddModel.validation.middleInitial.length).toEqual(2);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as not required", function () {
                            expect(driverAddModel.validation.middleInitial[0].required).toBeFalsy();
                        });

                        it("should set the maxLength", function () {
                            expect(driverAddModel.validation.middleInitial[0].maxLength).toEqual(1);
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.middleInitial[0].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_MIDDLE_NAME_INVALID_LENGTH);
                        });
                    });

                    describe("the second validation rule", function () {
                        it("should set the pattern", function () {
                            expect(driverAddModel.validation.middleInitial[1].pattern).toEqual(/^[A-Z]+$/i);
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.middleInitial[1].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_MIDDLE_NAME_INVALID_CHARACTERS);
                        });
                    });
                });

                describe("has a validation configuration for the lastName field that", function () {
                    it("has 3 validation rules", function () {
                        expect(driverAddModel.validation.lastName.length).toEqual(3);
                    });

                    describe("the first validation rule", function () {
                        it("should set the field as required", function () {
                            expect(driverAddModel.validation.lastName[0].required).toBeTruthy();
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.lastName[0].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_LAST_NAME_REQUIRED_FIELD);
                        });
                    });

                    describe("the second validation rule", function () {
                        it("should set the maxLength", function () {
                            expect(driverAddModel.validation.lastName[1].maxLength).toEqual(12);
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.lastName[1].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_LAST_NAME_INVALID_LENGTH);
                        });
                    });

                    describe("the third validation rule", function () {
                        it("should set the pattern", function () {
                            expect(driverAddModel.validation.lastName[2].pattern)
                                .toEqual(/^[A-Z\d`~&_\-+{}|:',.\/]+$/i);
                        });

                        it("should set the error message", function () {
                            expect(driverAddModel.validation.lastName[2].msg)
                                .toEqual(globals.driverAdd.constants.ERROR_LAST_NAME_INVALID_CHARACTERS);
                        });
                    });
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(DriverAddModel.__super__, "initialize").and.callFake(function () { });
                    spyOn(driverAddModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(driverAddModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(driverAddModel.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super", function () {
                    driverAddModel.initialize();

                    expect(DriverAddModel.__super__.initialize).toHaveBeenCalledWith();
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
