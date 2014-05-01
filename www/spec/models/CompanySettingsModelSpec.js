define(["Squire", "utils", "globals", "backbone"],
    function (Squire, utils, globals, Backbone) {

        "use strict";

        var squire = new Squire(),
            CompanySettingsModel,
            companySettingsModel;

        squire.mock("backbone", Backbone);

        describe("A Company Settings Model", function () {
            beforeEach(function (done) {
                squire.require(["models/CompanySettingsModel"], function (JasmineCompanySettingsModel) {
                    CompanySettingsModel = JasmineCompanySettingsModel;
                    companySettingsModel = new CompanySettingsModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(companySettingsModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(companySettingsModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set cardSettings to default", function () {
                    expect(companySettingsModel.defaults.cardSettings).toBeNull();
                });

                it("should set driverSettings to default", function () {
                    expect(companySettingsModel.defaults.driverSettings).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(companySettingsModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(companySettingsModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(companySettingsModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        companySettingsModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(companySettingsModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        companySettingsModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(companySettingsModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            cardSettings: {
                                customVehicleIdMaxLength: 17,
                                licensePlateNumberMaxLength: 10,
                                licensePlateStateFixedLength: 2,
                                vehicleDescriptionMaxLength: 17,
                                vinFixedLength: 17
                            },
                            driverSettings: {
                                idFixedLength: 4,
                                firstNameMaxLength: 11,
                                middleNameMaxLength: 1,
                                lastNameMaxLength: 12
                            }
                        };

                    beforeEach(function () {
                        companySettingsModel.initialize(options);
                    });

                    it("should call set 2 times", function () {
                        expect(companySettingsModel.set.calls.count()).toEqual(2);
                    });

                    // TODO - Replace with something that verifies that a new CardSettingsModel was created,
                    // the correct parameter was passed to the CardSettingsModel.initialize function and then set
                    // to "cardSettings"
                    it("should set cardSettings", function () {
                        var actualSettings;

                        expect(companySettingsModel.set.calls.argsFor(0).length).toEqual(2);
                        expect(companySettingsModel.set.calls.argsFor(0)[0]).toEqual("cardSettings");

                        actualSettings = companySettingsModel.set.calls.argsFor(0)[1].toJSON();

                        expect(actualSettings.customVehicleIdMaxLength)
                            .toEqual(options.cardSettings.customVehicleIdMaxLength);
                        expect(actualSettings.licensePlateNumberMaxLength)
                            .toEqual(options.cardSettings.licensePlateNumberMaxLength);
                        expect(actualSettings.licensePlateStateFixedLength)
                            .toEqual(options.cardSettings.licensePlateStateFixedLength);
                        expect(actualSettings.vehicleDescriptionMaxLength)
                            .toEqual(options.cardSettings.vehicleDescriptionMaxLength);
                        expect(actualSettings.vinFixedLength).toEqual(options.cardSettings.vinFixedLength);
                    });

                    // TODO - Replace with something that verifies that a new DriverSettingsModel was created,
                    // the correct parameter was passed to the DriverSettingsModel.initialize function and then set
                    // to "driverSettings"
                    it("should set driverSettings", function () {
                        var actualSettings;

                        expect(companySettingsModel.set.calls.argsFor(1).length).toEqual(2);
                        expect(companySettingsModel.set.calls.argsFor(1)[0]).toEqual("driverSettings");

                        actualSettings = companySettingsModel.set.calls.argsFor(1)[1].toJSON();

                        expect(actualSettings.idFixedLength).toEqual(options.driverSettings.idFixedLength);
                        expect(actualSettings.firstNameMaxLength).toEqual(options.driverSettings.firstNameMaxLength);
                        expect(actualSettings.middleNameMaxLength).toEqual(options.driverSettings.middleNameMaxLength);
                        expect(actualSettings.lastNameMaxLength).toEqual(options.driverSettings.lastNameMaxLength);
                    });
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(companySettingsModel.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(companySettingsModel.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when cardSettings does have a value", function () {
                    var cardSettings,
                        mockCompanySettingsModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanySettingsModel = {
                            cardSettings: {
                                customVehicleIdMaxLength: 17,
                                licensePlateNumberMaxLength: 10,
                                licensePlateStateFixedLength: 2,
                                vehicleDescriptionMaxLength: 17,
                                vinFixedLength: 17
                            }
                        };
                        companySettingsModel.clear();
                        companySettingsModel.initialize(mockCompanySettingsModel);
                        cardSettings = companySettingsModel.get("cardSettings");

                        spyOn(cardSettings, "toJSON").and.callThrough();
                        spyOn(CompanySettingsModel.__super__, "toJSON").and.callThrough();

                        actualValue = companySettingsModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanySettingsModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on cardSettings", function () {
                        expect(cardSettings.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanySettingsModel);
                    });
                });

                describe("when cardSettings does NOT have a value", function () {
                    var mockCompanySettingsModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanySettingsModel = {};
                        companySettingsModel.clear();
                        companySettingsModel.initialize(mockCompanySettingsModel);

                        spyOn(CompanySettingsModel.__super__, "toJSON").and.callThrough();

                        actualValue = companySettingsModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanySettingsModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanySettingsModel);
                    });
                });

                describe("when driverSettings does have a value", function () {
                    var driverSettings,
                        mockCompanySettingsModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanySettingsModel = {
                            cardSettings: {
                                customVehicleIdMaxLength: 17,
                                licensePlateNumberMaxLength: 10,
                                licensePlateStateFixedLength: 2,
                                vehicleDescriptionMaxLength: 17,
                                vinFixedLength: 17
                            },
                            driverSettings: {
                                idFixedLength: 4,
                                firstNameMaxLength: 11,
                                middleNameMaxLength: 1,
                                lastNameMaxLength: 12
                            }
                        };
                        companySettingsModel.clear();
                        companySettingsModel.initialize(mockCompanySettingsModel);
                        driverSettings = companySettingsModel.get("driverSettings");

                        spyOn(driverSettings, "toJSON").and.callThrough();
                        spyOn(CompanySettingsModel.__super__, "toJSON").and.callThrough();

                        actualValue = companySettingsModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanySettingsModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on driverSettings", function () {
                        expect(driverSettings.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanySettingsModel);
                    });
                });

                describe("when driverSettings does NOT have a value", function () {
                    var mockCompanySettingsModel,
                        actualValue;

                    beforeEach(function () {
                        mockCompanySettingsModel = {
                            cardSettings: {
                                customVehicleIdMaxLength: 17,
                                licensePlateNumberMaxLength: 10,
                                licensePlateStateFixedLength: 2,
                                vehicleDescriptionMaxLength: 17,
                                vinFixedLength: 17
                            }
                        };
                        companySettingsModel.clear();
                        companySettingsModel.initialize(mockCompanySettingsModel);

                        spyOn(CompanySettingsModel.__super__, "toJSON").and.callThrough();

                        actualValue = companySettingsModel.toJSON();
                    });

                    it("should call toJSON on super", function () {
                        expect(CompanySettingsModel.__super__.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockCompanySettingsModel);
                    });
                });
            });
        });
    });
