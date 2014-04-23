define(["Squire", "backbone", "utils"],
    function (Squire, Backbone, utils) {

        "use strict";

        var squire = new Squire(),
            mockUtils = utils,
            shippingMethodModel;

        squire.mock("backbone", Backbone);
        squire.mock("utils", mockUtils);

        describe("A Shipping Method Model", function () {
            beforeEach(function (done) {
                squire.require(["models/ShippingMethodModel"], function (ShippingMethodModel) {
                    shippingMethodModel = new ShippingMethodModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(shippingMethodModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(shippingMethodModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set id to default", function () {
                    expect(shippingMethodModel.defaults.id).toBeNull();
                });

                it("should set name to default", function () {
                    expect(shippingMethodModel.defaults.name).toBeNull();
                });

                it("should set cost to default", function () {
                    expect(shippingMethodModel.defaults.cost).toBeNull();
                });

                it("should set poBoxAllowed to default", function () {
                    expect(shippingMethodModel.defaults.poBoxAllowed).toBeFalsy();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(shippingMethodModel, "set").and.callThrough();
                    spyOn(shippingMethodModel, "formatAttributes").and.callFake(function () {});
                });

                it("is defined", function () {
                    expect(shippingMethodModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingMethodModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        shippingMethodModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(shippingMethodModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        shippingMethodModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(shippingMethodModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        "id"          : "ID",
                        "name"        : "Name",
                        "cost"        : 6.66,
                        "poBoxAllowed": true
                    };

                    beforeEach(function () {
                        shippingMethodModel.initialize(options);
                    });

                    it("should call set 4 times", function () {
                        expect(shippingMethodModel.set.calls.count()).toEqual(4);
                    });

                    it("should set id", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("id", options.id);
                    });

                    it("should set name", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set cost", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("cost", options.cost);
                    });

                    it("should set poBoxAllowed", function () {
                        expect(shippingMethodModel.set).toHaveBeenCalledWith("poBoxAllowed", options.poBoxAllowed);
                    });
                });

                it("should call formatAttributes", function () {
                    shippingMethodModel.initialize();
                    expect(shippingMethodModel.formatAttributes).toHaveBeenCalledWith();
                });
            });

            describe("has a formatAttributes function that", function () {
                beforeEach(function () {
                    // re-initialize the model
                    shippingMethodModel.set(shippingMethodModel.defaults);

                    spyOn(shippingMethodModel, "set").and.callThrough();

                    shippingMethodModel.formatAttributes();
                });

                it("is defined", function () {
                    expect(shippingMethodModel.formatAttributes).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingMethodModel.formatAttributes).toEqual(jasmine.any(Function));
                });

                it("should call set 1 time", function () {
                    expect(shippingMethodModel.set.calls.count()).toEqual(1);
                });

                it("should set formattedName", function () {
                    expect(shippingMethodModel.set).toHaveBeenCalledWith("formattedName", jasmine.any(Function));
                });

                describe("when calling the callback function", function () {
                    var callback,
                        actualResult,
                        expectedResult,
                        name = "Name",
                        cost = 76,
                        formattedCost = "$76.00";

                    beforeEach(function () {
                        shippingMethodModel.formatAttributes();
                        callback = shippingMethodModel.set.calls.mostRecent().args[1];

                        spyOn(mockUtils, "formatCurrency").and.returnValue(formattedCost);
                    });

                    describe("when name and cost both have values", function () {
                        it("should match expected result", function () {
                            shippingMethodModel.set("name", name);
                            shippingMethodModel.set("cost", cost);

                            expectedResult = name + " - " + formattedCost;
                            actualResult = callback.call();
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when cost does not have a value", function () {
                        it("should match expected result", function () {
                            shippingMethodModel.set("name", name);
                            shippingMethodModel.set("cost", null);

                            expectedResult = name;
                            actualResult = callback.call();
                            expect(actualResult).toEqual(expectedResult);
                        });
                    });

                    describe("when name does not have a value", function () {
                        it("should match expected result", function () {
                            shippingMethodModel.set("name", null);
                            shippingMethodModel.set("cost", cost);

                            actualResult = callback.call();
                            expect(actualResult).toBeNull();
                        });
                    });

                    describe("when name and cost do not have values", function () {
                        it("should match expected result", function () {
                            shippingMethodModel.set("name", null);
                            shippingMethodModel.set("cost", null);

                            actualResult = callback.call();
                            expect(actualResult).toBeNull();
                        });
                    });
                });
            });
        });
    });
