define(["Squire"],
    function (Squire) {

        "use strict";

        var utilsClass,
            squire = new Squire();

        describe("The utils class", function () {

            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["utils"], function (utils) {
                    utilsClass = utils;
                    done();
                });
            });

            it("is defined", function () {
                expect(utilsClass).toBeDefined();
            });

            // TODO: Add in tests for everything else

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

        });

        return "utils";
    });