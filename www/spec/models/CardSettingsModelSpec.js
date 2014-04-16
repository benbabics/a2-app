define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            cardSettingsModel;

        squire.mock("backbone", Backbone);

        describe("A Card Settings Model", function () {
            beforeEach(function (done) {
                squire.require(["models/CardSettingsModel"], function (CardSettingsModel) {
                    cardSettingsModel = new CardSettingsModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(cardSettingsModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(cardSettingsModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set customVehicleIdMaxLength to default", function () {
                    expect(cardSettingsModel.defaults.customVehicleIdMaxLength).toBeNull();
                });

                it("should set licensePlateNumberMaxLength to default", function () {
                    expect(cardSettingsModel.defaults.licensePlateNumberMaxLength).toBeNull();
                });

                it("should set licensePlateStateFixedLength to default", function () {
                    expect(cardSettingsModel.defaults.licensePlateStateFixedLength).toBeNull();
                });

                it("should set vehicleDescriptionMaxLength to default", function () {
                    expect(cardSettingsModel.defaults.vehicleDescriptionMaxLength).toBeNull();
                });

                it("should set vinFixedLength to default", function () {
                    expect(cardSettingsModel.defaults.vinFixedLength).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(cardSettingsModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(cardSettingsModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(cardSettingsModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        cardSettingsModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(cardSettingsModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        cardSettingsModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(cardSettingsModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        customVehicleIdMaxLength: 1,
                        licensePlateNumberMaxLength: 2,
                        licensePlateStateFixedLength: 3,
                        vehicleDescriptionMaxLength: 4,
                        vinFixedLength: 5
                    };

                    beforeEach(function () {
                        cardSettingsModel.initialize(options);
                    });

                    it("should call set 5 times", function () {
                        expect(cardSettingsModel.set.calls.count()).toEqual(5);
                    });

                    it("should set customVehicleIdMaxLength", function () {
                        expect(cardSettingsModel.set)
                            .toHaveBeenCalledWith("customVehicleIdMaxLength", options.customVehicleIdMaxLength);
                    });

                    it("should set licensePlateNumberMaxLength", function () {
                        expect(cardSettingsModel.set)
                            .toHaveBeenCalledWith("licensePlateNumberMaxLength", options.licensePlateNumberMaxLength);
                    });

                    it("should set licensePlateStateFixedLength", function () {
                        expect(cardSettingsModel.set)
                            .toHaveBeenCalledWith("licensePlateStateFixedLength", options.licensePlateStateFixedLength);
                    });

                    it("should set vehicleDescriptionMaxLength", function () {
                        expect(cardSettingsModel.set)
                            .toHaveBeenCalledWith("vehicleDescriptionMaxLength", options.vehicleDescriptionMaxLength);
                    });

                    it("should set vinFixedLength", function () {
                        expect(cardSettingsModel.set)
                            .toHaveBeenCalledWith("vinFixedLength", options.vinFixedLength);
                    });
                });
            });
        });
    });
