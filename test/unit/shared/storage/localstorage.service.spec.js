(function () {
    "use strict";

    describe("A LocalStorage Service", function () {

        var mockWindow;

        beforeEach(function () {

            module("app.shared.storage");

            // mock dependencies
            mockWindow = {
                localStorage: {}
            };
            module(function($provide) {
                $provide.value("$window", mockWindow);
            });
        });

        describe("has a set function that", function () {

            var mockKey = "some key",
                mockValue;

            it("should add the key value pair to localStorage when the value is a primitive", inject(function (LocalStorage) {
                mockValue = "some value";

                LocalStorage.set(mockKey, mockValue);

                expect(mockWindow.localStorage[mockKey]).toEqual(mockValue);
            }));

        });

        describe("has a get function that", function () {

            var mockKey = "some key",
                mockValue = "some value",
                defaultValue = "default";

            beforeEach(inject(function (LocalStorage) {
                LocalStorage.set(mockKey, mockValue);
            }));

            it("should get the value when the key is found in localStorage", inject(function (LocalStorage) {
                var retrievedValue = LocalStorage.get(mockKey, defaultValue);

                expect(retrievedValue).toEqual(mockValue);
                expect(retrievedValue).not.toEqual(defaultValue);
            }));

            it("should return the supplied default value when the key is NOT found in localStorage", inject(function (LocalStorage) {
                var retrievedValue = LocalStorage.get("NOT_THE_KEY", defaultValue);

                expect(retrievedValue).toEqual(defaultValue);
                expect(retrievedValue).not.toEqual(mockValue);
            }));

        });

        describe("has a setObject function that", function () {

            var mockKey = "some key",
                mockValue;

            it("should add the key value pair to localStorage when the value is an object", inject(function (LocalStorage) {
                mockValue = {
                    property1: "value1",
                    property2: "value2"
                };

                LocalStorage.set(mockKey, mockValue);

                expect(mockWindow.localStorage[mockKey]).toEqual(mockValue);
            }));

            it("should add the key value pair to localStorage when the value is an array", inject(function (LocalStorage) {
                mockValue = ["1", "2", "3", "4"];

                LocalStorage.set(mockKey, mockValue);

                expect(mockWindow.localStorage[mockKey]).toEqual(mockValue);
            }));
        });

        describe("has a getObject function that", function () {

            describe("when the value is an object", function () {

                var mockKey = "some key",
                    mockValue = {
                        property1: "value1",
                        property2: "value2"
                    };

                beforeEach(inject(function (LocalStorage) {
                    LocalStorage.setObject(mockKey, mockValue);
                }));

                it("should get the value when the key is found in localStorage", inject(function (LocalStorage) {
                    var retrievedValue = LocalStorage.getObject(mockKey);

                    expect(retrievedValue).toEqual(mockValue);
                    expect(retrievedValue).not.toEqual({});
                }));

                it("should return an empty object when the key is NOT found in localStorage", inject(function (LocalStorage) {
                    var retrievedValue = LocalStorage.getObject("NOT_THE_KEY");

                    expect(retrievedValue).toEqual({});
                    expect(retrievedValue).not.toEqual(mockValue);
                }));

            });

            describe("when the value is an array", function () {

                var mockKey = "some key",
                    mockValue = ["1", "2", "3", "4"];

                beforeEach(inject(function (LocalStorage) {
                    LocalStorage.setObject(mockKey, mockValue);
                }));

                it("should get the value when the key is found in localStorage", inject(function (LocalStorage) {
                    var retrievedValue = LocalStorage.getObject(mockKey);

                    expect(retrievedValue).toEqual(mockValue);
                    expect(retrievedValue).not.toEqual({});
                }));

                it("should return an empty object when the key is NOT found in localStorage", inject(function (LocalStorage) {
                    var retrievedValue = LocalStorage.getObject("NOT_THE_KEY");

                    expect(retrievedValue).toEqual({});
                    expect(retrievedValue).not.toEqual(mockValue);
                }));

            });

        });

    });

})();