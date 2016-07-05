(function () {
    "use strict";

    describe("A Driver Model Service", function () {

        var _,
            DriverModel,
            driver;

        beforeEach(function () {
            module("app.shared");
            module("app.components.driver");

            inject(function (___, _DriverModel_) {
                _ = ___;

                DriverModel = _DriverModel_;
                driver = new DriverModel();
            });
        });

        describe("has a set function that", function () {

            var mockDriverResource,
                driverModelKeys,
                driverResourceKeys;

            beforeEach(inject(function () {
                mockDriverResource = TestUtils.getRandomDriver(DriverModel);

                // set all values to "default" to more easily detect any changes
                for (var property in driver) {
                    if (_.has(driver, property)) {
                        driver[property] = "default";
                    }
                }

                driverModelKeys = _.keys(driver);
                driverResourceKeys = _.keys(mockDriverResource);
            }));

            it("should set the DriverModel object with the fields from the passed in driverResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(driverModelKeys, driverResourceKeys);

                driver.set(mockDriverResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(driver[key]).toEqual(mockDriverResource[key]);
                }
            });

            it("should NOT change the DriverModel object fields that the driverResource object does not have", function () {
                var key,
                    keysDifference = _.difference(driverModelKeys, driverResourceKeys);

                driver.set(mockDriverResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(driver[key]).toEqual("default");
                }
            });

            it("should extend the DriverModel object with the fields from the passed in driverResource object that the DriverModel does not have", function () {
                var key,
                    keysDifference = _.difference(driverResourceKeys, driverModelKeys);

                driver.set(mockDriverResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(driver, key)).toBeTruthy();
                    expect(driver[key]).toEqual(mockDriverResource[key]);
                }
            });
        });
    });
})();
