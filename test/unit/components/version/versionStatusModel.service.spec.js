(function () {
    "use strict";

    describe("A VersionStatus Model Service", function () {

        var _,
            versionStatus,
            moment,
            globals;

        beforeEach(inject(function (___, _globals_, _moment_, VersionStatusModel) {
            _ = ___;
            globals = _globals_;
            moment = _moment_;

            versionStatus = new VersionStatusModel();
        }));

        describe("has a set function that", function () {

            var versionStatusResource,
                versionStatusModelKeys,
                versionStatusResourceKeys;

            beforeEach(inject(function (VersionStatusModel) {
                versionStatusResource = angular.extend(TestUtils.getRandomVersionStatus(VersionStatusModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in versionStatus) {
                    if (_.has(versionStatus, property)) {
                        versionStatus[property] = "default";
                    }
                }

                versionStatusModelKeys = _.keys(versionStatus);
                versionStatusResourceKeys = _.keys(versionStatusResource);
            }));

            it("should set the VersionStatus object with the fields from the passed in versionStatusResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(versionStatusModelKeys, versionStatusResourceKeys);

                versionStatus.set(versionStatusResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(versionStatus[key]).toEqual(versionStatusResource[key]);
                }
            });

            it("should NOT change the VersionStatus object fields that the versionStatusResource object does not have", function () {
                var key,
                    keysDifference = _.difference(versionStatusModelKeys, versionStatusResourceKeys);

                versionStatus.set(versionStatusResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(versionStatus[key]).toEqual("default");
                }
            });

            it("should extend the VersionStatus object with the fields from the passed in versionStatusResource object that the VersionStatus does not have", function () {
                var key,
                    keysDifference = _.difference(versionStatusResourceKeys, versionStatusModelKeys);

                versionStatus.set(versionStatusResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(versionStatus, key)).toBeTruthy();
                    expect(versionStatus[key]).toEqual(versionStatusResource[key]);
                }
            });

        });

    });

})();
