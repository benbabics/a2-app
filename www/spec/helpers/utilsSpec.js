define(["Squire"],
    function (Squire) {

        "use strict";

        var utilsClass,
            squire = new Squire();

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

            describe("has an uncapitalize function that", function () {
                it("is defined", function () {
                    expect(utilsClass.uncapitalize).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.uncapitalize).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has a camelcaseKeys function that", function () {
                it("is defined", function () {
                    expect(utilsClass.camelcaseKeys).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.camelcaseKeys).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has a navigate function that", function () {
                it("is defined", function () {
                    expect(utilsClass.navigate).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.navigate).toEqual(jasmine.any(Function));
                });

                // TODO: finish
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

            describe("has an addHours function that", function () {
                it("is defined", function () {
                    expect(utilsClass.addHours).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.addHours).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

            describe("has an addMinutes function that", function () {
                it("is defined", function () {
                    expect(utilsClass.addMinutes).toBeDefined();
                });

                it("is a function", function () {
                    expect(utilsClass.addMinutes).toEqual(jasmine.any(Function));
                });

                // TODO: finish
            });

        });

        return "utils";
    });