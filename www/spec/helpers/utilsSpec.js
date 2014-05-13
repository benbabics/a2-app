define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var utilsClass,
            squire = new Squire();

        squire.mock("backbone", Backbone);

        describe("The utils class", function () {

            beforeEach(function (done) {
                squire.require(["utils"], function (utils) {
                    utilsClass = utils;
                    done();
                });
            });

            it("is defined", function () {
                expect(utilsClass).toBeDefined();
            });

            describe("has an extend function that", function () {
                it("is defined", function () {
                    expect(utilsClass.extend).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.extend).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has a deepClone function that", function () {
                it("is defined", function () {
                    expect(utilsClass.deepClone).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.deepClone).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has a convertToConfigurationObject function that", function () {
                it("is defined", function () {
                    expect(utilsClass.convertToConfigurationObject).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.convertToConfigurationObject).toEqual(jasmine.any(Function));
                });

                it("returns the expected result", function () {
                    var i,
                        originalValues = ["Unleaded", "Diesel", "Propane"],
                        actualValues = utilsClass.convertToConfigurationObject(originalValues);

                    expect(actualValues.length).toEqual(originalValues.length);

                    for (i = 0; i < originalValues.length; i++) {
                        expect(actualValues[i].label).toEqual(originalValues[i]);
                        expect(actualValues[i].value).toEqual(originalValues[i]);
                    }
                });
            });

            describe("has a navigate function that", function () {
                it("is defined", function () {
                    expect(utilsClass.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.navigate).toEqual(jasmine.any(Function));
                });

                it("call navigate on Backbone.history", function () {
                    var mockViewId = "View Id";

                    spyOn(Backbone.history, "navigate").and.callFake(function () {});

                    utilsClass.navigate(mockViewId);

                    expect(Backbone.history.navigate).toHaveBeenCalledWith(mockViewId, true);
                });
            });

            describe("has a changePage function that", function () {
                it("is defined", function () {
                    expect(utilsClass.changePage).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.changePage).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has a hasNetworkConnection function that", function () {
                it("is defined", function () {
                    expect(utilsClass.hasNetworkConnection).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.hasNetworkConnection).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has an isActivePage function that", function () {
                it("is defined", function () {
                    expect(utilsClass.isActivePage).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.isActivePage).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has an isEmailAddressValid function that", function () {
                it("is defined", function () {
                    expect(utilsClass.isEmailAddressValid).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.isEmailAddressValid).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has an isPOBox function that", function () {
                it("is defined", function () {
                    expect(utilsClass.isPOBox).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.isPOBox).toEqual(jasmine.any(Function));
                });

                it("should return expected value when address is not defined", function () {
                    var address,
                        actualValue = utilsClass.isPOBox(address);

                    expect(actualValue).toBeFalsy();
                });

                it("should return expected value when address is a P.O.Box", function () {
                    var addresses = [
                            "PO Box",
                            "P O Box",
                            "POBox",
                            "P OBox",
                            "P.O. Box",
                            "P. O. Box",
                            "P.O.Box",
                            "P. O.Box",
                            "PO. Box",
                            "P O. Box",
                            "PO.Box",
                            "P OBox",
                            "P.O Box",
                            "P. O Box",
                            "P.OBox",
                            "P. OBox",
                            "POB",
                            "P.O.B.",
                            "POST OFFICE BOX"
                        ],
                        index;

                    for (index = 0; index < addresses.length; index++) {
                        expect(utilsClass.isPOBox(addresses[index])).toBeTruthy();
                        expect(utilsClass.isPOBox(addresses[index].toLowerCase())).toBeTruthy();
                        expect(utilsClass.isPOBox(addresses[index].toUpperCase())).toBeTruthy();
                    }
                });

                it("should return expected value when address is NOT a P.O.Box", function () {
                    var addresses = [
                            "P Box",
                            "P Box",
                            "PBox",
                            "Pb",
                            "PB",
                            "pB",
                            "pb",
                            "Po",
                            "PO",
                            "pO",
                            "po"
                        ],
                        index;

                    for (index = 0; index < addresses.length; index++) {
                        expect(utilsClass.isPOBox(addresses[index])).toBeFalsy();
                        expect(utilsClass.isPOBox(addresses[index].toLowerCase())).toBeFalsy();
                        expect(utilsClass.isPOBox(addresses[index].toUpperCase())).toBeFalsy();
                    }
                });
            });

            describe("has a formatCurrency function that", function () {
                it("is defined", function () {
                    expect(utilsClass.formatCurrency).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.formatCurrency).toEqual(jasmine.any(Function));
                });

                it("should return expected value when number is not defined", function () {
                    var numberToFormat,
                        actualValue = utilsClass.formatCurrency(numberToFormat);

                    expect(actualValue).toBeUndefined();
                });

                it("should return expected value when number is an integer", function () {
                    var numberToFormat = 17,
                        expectedValue = "$17.00",
                        actualValue = utilsClass.formatCurrency(numberToFormat);

                    expect(actualValue).toEqual(expectedValue);
                });

                it("should return expected value when number has more than 2 decimal places", function () {
                    var numberToFormat = 45.5675,
                        expectedValue = "$45.57",
                        actualValue = utilsClass.formatCurrency(numberToFormat);

                    expect(actualValue).toEqual(expectedValue);
                });

                it("should return expected value when number is greater than 1000", function () {
                    var numberToFormat = 3445.5,
                        expectedValue = "$3,445.50",
                        actualValue = utilsClass.formatCurrency(numberToFormat);

                    expect(actualValue).toEqual(expectedValue);
                });
            });

            describe("has a fetchCollection function that", function () {
                var mockPromiseReturnValue = "Promise Return Value",
                    mockDeferred = {
                        promise: function () { return mockPromiseReturnValue; },
                        reject: function () {},
                        resolve: function () {}
                    },
                    mockData = {
                        name: "value"
                    },
                    mockCollection = {
                        fetch: function () { return mockCollection; },
                        once: function () { return mockCollection; }
                    },
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(utilsClass, "Deferred").and.returnValue(mockDeferred);
                    spyOn(mockDeferred, "promise").and.callThrough();
                    spyOn(mockCollection, "once").and.callThrough();
                    spyOn(mockCollection, "fetch").and.callThrough();

                    actualReturnValue = utilsClass.fetchCollection(mockCollection, mockData);
                });

                it("is defined", function () {
                    expect(utilsClass.fetchCollection).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.fetchCollection).toEqual(jasmine.any(Function));
                });

                it("should call once on the Collection on sync", function () {
                    expect(mockCollection.once)
                        .toHaveBeenCalledWith("sync", jasmine.any(Function), utilsClass);
                });

                describe("when the handler of the sync event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "resolve").and.callThrough();

                        callback = mockCollection.once.calls.argsFor(0)[1];
                        callback.apply();
                    });

                    it("should call resolve on the Deferred object", function () {
                        expect(mockDeferred.resolve).toHaveBeenCalledWith();
                    });
                });

                it("should call once on the Collection on error", function () {
                    expect(mockCollection.once)
                        .toHaveBeenCalledWith("error", jasmine.any(Function), utilsClass);
                });

                describe("when the handler of the error event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "reject").and.callThrough();

                        callback = mockCollection.once.calls.argsFor(1)[1];
                        callback.apply();
                    });

                    it("should call reject on the Deferred object", function () {
                        expect(mockDeferred.reject).toHaveBeenCalledWith();
                    });
                });

                it("should call fetch on the Collection", function () {
                    expect(mockCollection.fetch).toHaveBeenCalledWith(mockData);
                });

                it("should call promise on the Deferred object", function () {
                    expect(mockDeferred.promise).toHaveBeenCalledWith();
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                });
            });

            describe("has a fetchModel function that", function () {
                var mockPromiseReturnValue = "Promise Return Value",
                    mockDeferred = {
                        promise: function () { return mockPromiseReturnValue; },
                        reject: function () {},
                        resolve: function () {}
                    },
                    mockModel = {
                        fetch: function () { return mockModel; },
                        once: function () { return mockModel; }
                    },
                    actualReturnValue;

                beforeEach(function () {
                    spyOn(utilsClass, "Deferred").and.returnValue(mockDeferred);
                    spyOn(mockDeferred, "promise").and.callThrough();
                    spyOn(mockModel, "once").and.callThrough();
                    spyOn(mockModel, "fetch").and.callThrough();

                    actualReturnValue = utilsClass.fetchModel(mockModel);
                });

                it("is defined", function () {
                    expect(utilsClass.fetchModel).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.fetchModel).toEqual(jasmine.any(Function));
                });

                it("should call once on the Model on sync", function () {
                    expect(mockModel.once)
                        .toHaveBeenCalledWith("sync", jasmine.any(Function), utilsClass);
                });

                describe("when the handler of the sync event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "resolve").and.callThrough();

                        callback = mockModel.once.calls.argsFor(0)[1];
                        callback.apply();
                    });

                    it("should call resolve on the Deferred object", function () {
                        expect(mockDeferred.resolve).toHaveBeenCalledWith();
                    });
                });

                it("should call once on the Model on error", function () {
                    expect(mockModel.once)
                        .toHaveBeenCalledWith("error", jasmine.any(Function), utilsClass);
                });

                describe("when the handler of the error event is called", function () {
                    var callback;

                    beforeEach(function () {
                        spyOn(mockDeferred, "reject").and.callThrough();

                        callback = mockModel.once.calls.argsFor(1)[1];
                        callback.apply();
                    });

                    it("should call reject on the Deferred object", function () {
                        expect(mockDeferred.reject).toHaveBeenCalledWith();
                    });
                });

                it("should call fetch on the Model", function () {
                    expect(mockModel.fetch).toHaveBeenCalledWith();
                });

                it("should call promise on the Deferred object", function () {
                    expect(mockDeferred.promise).toHaveBeenCalledWith();
                });

                it("should return the expected value", function () {
                    expect(actualReturnValue).toEqual(mockPromiseReturnValue);
                });
            });
        });

        return "utils";
    });