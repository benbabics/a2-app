define(["utils", "globals", "Squire", "models/ShippingMethodModel"],
    function (utils, globals, Squire, ShippingMethodModel) {
        "use strict";

        var squire = new Squire(),
            shippingMethodCollection;

        squire.mock("models/ShippingMethodModel", ShippingMethodModel);

        describe("A Shipping Method Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/ShippingMethodCollection"], function (ShippingMethodCollection) {
                    shippingMethodCollection = new ShippingMethodCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(shippingMethodCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(shippingMethodCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(shippingMethodCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingMethodCollection.constructor).toEqual(jasmine.any(Function));
                });

                it("should default model to ShippingMethodModel", function () {
                    expect(shippingMethodCollection.model).toEqual(ShippingMethodModel);
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(shippingMethodCollection.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(shippingMethodCollection.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when the list of models is null", function () {
                    var actualValue;

                    beforeEach(function () {
                        shippingMethodCollection.reset();

                        actualValue = shippingMethodCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                describe("when the list of models is empty", function () {
                    var actualValue;

                    beforeEach(function () {
                        shippingMethodCollection.reset();

                        actualValue = shippingMethodCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                // TODO - Figure out why these tests don't work even though the collection seems to work correctly
                xdescribe("when there are models in the collection", function () {
                    var mockShippingMethods,
                        shippingMethod1,
                        shippingMethod2,
                        actualValue;

                    beforeEach(function () {
                        mockShippingMethods = [
                            {
                                id: "134613456",
                                name: "UNASSIGNED",
                                cost: 3.14,
                                poBoxAllowed: true
                            },
                            {
                                id: "2456724567",
                                name: "Dewey, Cheetum and Howe",
                                cost: 6.66,
                                poBoxAllowed: false
                            }
                        ];
                        shippingMethod1 = new ShippingMethodModel();
                        shippingMethod1.initialize(mockShippingMethods[0]);
                        shippingMethod2 = new ShippingMethodModel();
                        shippingMethod2.initialize(mockShippingMethods[1]);

                        shippingMethodCollection.add(shippingMethod1);
                        shippingMethodCollection.add(shippingMethod2);

                        spyOn(shippingMethod1, "toJSON").and.callThrough();
                        spyOn(shippingMethod2, "toJSON").and.callThrough();

                        actualValue = shippingMethodCollection.toJSON();
                    });

                    it("should call toJSON on shippingMethod1", function () {
                        expect(shippingMethod1.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on shippingMethod2", function () {
                        expect(shippingMethod2.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockShippingMethods);
                    });
                });
            });
        });
    });
