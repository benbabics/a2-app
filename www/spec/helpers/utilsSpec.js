define(["Squire", "backbone", "globals"],
    function (Squire, Backbone, globals) {

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

            describe("has a deepClone function that", function () {
                it("is defined", function () {
                    expect(utilsClass.deepClone).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.deepClone).toEqual(jasmine.any(Function));
                });

                describe("when a single object is being cloned", function () {
                    var sourceObject,
                        clonedObject;

                    beforeEach(function () {
                        sourceObject = {
                            "id"     : 234561345616,
                            "name"   : "Test Name",
                            "visible": false
                        };

                        clonedObject = utilsClass.deepClone(sourceObject);
                    });

                    it("should return the expected object", function () {
                        var property;

                        // All properties in the source object should exist and match the cloned object
                        for (property in sourceObject) {
                            expect(clonedObject[property]).toEqual(sourceObject[property]);
                        }

                        // All properties in the cloned object should exist and match the source object
                        for (property in clonedObject) {
                            expect(clonedObject[property]).toEqual(sourceObject[property]);
                        }
                    });

                    it("changing the source object should not update the cloned object", function () {
                        expect(clonedObject.name).toEqual("Test Name");

                        sourceObject.name = "Changed Source Name";

                        expect(clonedObject.name).toEqual("Test Name");
                    });

                    it("changing the cloned object should not update the source object", function () {
                        expect(sourceObject.name).toEqual("Test Name");

                        clonedObject.name = "Changed Cloned Name";

                        expect(sourceObject.name).toEqual("Test Name");
                    });
                });

                describe("when multiple objects are being cloned", function () {
                    var sourceObject1,
                        sourceObject2,
                        clonedObject;

                    beforeEach(function () {
                        sourceObject1 = {
                            "id"     : 234561345616,
                            "name"   : "Test Name",
                            "visible": false
                        };
                        sourceObject2 = {
                            "attr1": 2456256,
                            "attr2": "Test Name 2",
                            "attr3": true
                        };

                        clonedObject = utilsClass.deepClone(sourceObject1, sourceObject2);
                    });

                    it("should return the expected object", function () {
                        var property,
                            combinedProperties = {};

                        // All properties in each of the source objects should exist and match the cloned object
                        for (property in sourceObject1) {
                            combinedProperties[property] = sourceObject1[property];
                            expect(clonedObject[property]).toEqual(sourceObject1[property]);
                        }
                        for (property in sourceObject2) {
                            combinedProperties[property] = sourceObject2[property];
                            expect(clonedObject[property]).toEqual(sourceObject2[property]);
                        }

                        // All properties in the cloned object should exist and match one of the source objects
                        for (property in clonedObject) {
                            expect(clonedObject[property]).toEqual(combinedProperties[property]);
                        }
                    });

                    it("changing the source object should not update the cloned object", function () {
                        expect(clonedObject.name).toEqual("Test Name");
                        expect(clonedObject.attr1).toEqual(2456256);

                        sourceObject1.name = "Changed Source Name";
                        sourceObject2.attr1 = 24576245;

                        expect(clonedObject.name).toEqual("Test Name");
                        expect(clonedObject.attr1).toEqual(2456256);
                    });

                    it("changing the cloned object should not update the source object", function () {
                        expect(sourceObject1.name).toEqual("Test Name");
                        expect(sourceObject2.attr1).toEqual(2456256);

                        clonedObject.name = "Changed Cloned Name";
                        clonedObject.attr1 = 562156126;

                        expect(sourceObject1.name).toEqual("Test Name");
                        expect(sourceObject2.attr1).toEqual(2456256);
                    });
                });
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
                var mockViewId = "testViewId";

                beforeEach(function () {
                    spyOn(utilsClass.$.mobile, "changePage").and.callFake(function () { });
                });

                it("is defined", function () {
                    expect(utilsClass.changePage).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.changePage).toEqual(jasmine.any(Function));
                });

                describe("when only the view id is passed", function () {
                    it("should call changePage on JQM", function () {
                        utilsClass.changePage(mockViewId);

                        expect(utilsClass.$.mobile.changePage).toHaveBeenCalledWith(mockViewId,
                            {
                                transition: globals.DEFAULT.PAGE_TRANSITION,
                                reverse   : false,
                                changeHash: false
                            });
                    });
                });

                describe("when all parameters are passed", function () {
                    it("should call changePage on JQM", function () {
                        var transition = "Transition",
                            direction = true,
                            updateHash = true;

                        utilsClass.changePage(mockViewId, transition, direction, updateHash);

                        expect(utilsClass.$.mobile.changePage).toHaveBeenCalledWith(mockViewId,
                            {
                                transition: transition,
                                reverse   : direction,
                                changeHash: updateHash
                            });
                    });
                });
            });

            describe("has a hasNetworkConnection function that", function () {
                it("is defined", function () {
                    expect(utilsClass.hasNetworkConnection).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.hasNetworkConnection).toEqual(jasmine.any(Function));
                });

                describe("when there is NOT a navigator", function () {
                    var originalNavigator;

                    beforeEach(function () {
                        originalNavigator = utilsClass.navigator;
                        utilsClass.navigator = null;
                    });

                    afterEach(function () {
                        utilsClass.navigator = originalNavigator;
                    });

                    it("should return expected value", function () {
                        expect(utilsClass.hasNetworkConnection()).toBeTruthy();
                    });
                });

                describe("when there is NOT a navigator.connection", function () {
                    var originalNavigatorConnection;

                    beforeEach(function () {
                        originalNavigatorConnection = utilsClass.navigator;
                        utilsClass.navigator.connection = null;
                    });

                    afterEach(function () {
                        utilsClass.navigator.connection = originalNavigatorConnection;
                    });

                    it("should return expected value", function () {
                        expect(utilsClass.hasNetworkConnection()).toBeTruthy();
                    });
                });

                describe("when there is NOT a navigator.connection.type", function () {
                    beforeEach(function () {
                        utilsClass.navigator.connection.type = null;
                    });

                    it("should return expected value", function () {
                        expect(utilsClass.hasNetworkConnection()).toBeTruthy();
                    });
                });

                describe("when navigator.connection.type is NONE", function () {
                    beforeEach(function () {
                        utilsClass.navigator.connection.type = Connection.NONE;
                    });

                    it("should return expected value", function () {
                        expect(utilsClass.hasNetworkConnection()).toBeFalsy();
                    });
                });

                describe("when navigator.connection.type is NOT NONE", function () {
                    beforeEach(function () {
                        utilsClass.navigator.connection.type = Connection.NONE;
                    });

                    it("should return expected value", function () {
                        var connectionType;

                        for (connectionType in Connection) {
                            if (connectionType !== Connection.NONE) {
                                utilsClass.navigator.connection.type = connectionType;

                                expect(utilsClass.hasNetworkConnection()).toBeTruthy();
                            }
                        }
                    });
                });
            });

            describe("has an isActivePage function that", function () {
                var mockPageId = "pageId";

                it("is defined", function () {
                    expect(utilsClass.isActivePage).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.isActivePage).toEqual(jasmine.any(Function));
                });

                describe("when there is NOT an active page", function () {
                    beforeEach(function () {
                        utilsClass.$.mobile.activePage = null;
                    });

                    it("should return expected value", function () {
                        var actualValue = utilsClass.isActivePage(mockPageId);

                        expect(actualValue).toBeFalsy();
                    });
                });

                describe("when there is an active page", function () {
                    var mockActivePage = {
                            attr: function () {}
                        },
                        actualResponse;

                    beforeEach(function () {
                        utilsClass.$.mobile.activePage = mockActivePage;
                    });

                    describe("when the id of the active page is the page being checked", function () {
                        beforeEach(function () {
                            spyOn(mockActivePage, "attr").and.returnValue(mockPageId);

                            actualResponse = utilsClass.isActivePage(mockPageId);
                        });

                        it("should call attr on the active page", function () {
                            expect(mockActivePage.attr).toHaveBeenCalledWith("id");
                        });

                        it("should return expected value", function () {
                            expect(actualResponse).toBeTruthy();
                        });
                    });

                    describe("when the id of the active page is NOT the page being checked", function () {
                        beforeEach(function () {
                            spyOn(mockActivePage, "attr").and.returnValue(mockPageId);

                            actualResponse = utilsClass.isActivePage("256fsagv");
                        });

                        it("should call attr on the active page", function () {
                            expect(mockActivePage.attr).toHaveBeenCalledWith("id");
                        });

                        it("should return expected value", function () {
                            expect(actualResponse).toBeFalsy();
                        });
                    });
                });
            });

            describe("has an isEmailAddressValid function that", function () {
                it("is defined", function () {
                    expect(utilsClass.isEmailAddressValid).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.isEmailAddressValid).toEqual(jasmine.any(Function));
                });

                it("should return expected value when email address is not defined", function () {
                    var emailAddress,
                        actualValue = utilsClass.isEmailAddressValid(emailAddress);

                    expect(actualValue).toBeFalsy();
                });

                it("should return expected value when email address is valid", function () {
                    var emailAddresses = [
                            "butthead@gmail.com",
                            "a@a.co",
                            "my.ownsite@ourearth.org",
                            "mysite@you.me.net"
                        ],
                        index;

                    for (index = 0; index < emailAddresses.length; index++) {
                        expect(utilsClass.isEmailAddressValid(emailAddresses[index])).toBeTruthy();
                        expect(utilsClass.isEmailAddressValid(emailAddresses[index].toLowerCase())).toBeTruthy();
                        expect(utilsClass.isEmailAddressValid(emailAddresses[index].toUpperCase())).toBeTruthy();
                    }
                });

                it("should return expected value when email address is valid", function () {
                    var emailAddresses = [
                            "email",
                            "email@",
                            "email.",
                            "email@address",
                            "email@address.",
                            "email@address.c",
                            "email@address.abcde",
                            "email@address.123",
                            "email.com",
                            "email.address.com",
                            "@address.com",
                            "email()*@address.org"
                        ],
                        index;


                    for (index = 0; index < emailAddresses.length; index++) {
                        expect(utilsClass.isEmailAddressValid(emailAddresses[index])).toBeFalsy();
                        expect(utilsClass.isEmailAddressValid(emailAddresses[index].toLowerCase())).toBeFalsy();
                        expect(utilsClass.isEmailAddressValid(emailAddresses[index].toUpperCase())).toBeFalsy();
                    }
                });
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
        });

        return "utils";
    });