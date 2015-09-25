(function () {
    "use strict";

    describe("An Address Model Service", function () {

        var _,
            address,
            CommonService,
            poBoxAcceptableValues = ["PO Box", "P O Box", "POBox", "P OBox", "P.O. Box", "P. O. Box", "P.O.Box", "P. O.Box",
                "PO. Box", "P O. Box", "PO.Box", "P OBox", "P.O Box", "P. O Box", "P.OBox", "P. OBox", "POB", "P.O.B.",
                "POST OFFICE BOX", "Post Office Box"],
            poBoxUnacceptableValues = ["P Box", "P Box", "PBox", "Pb", "PB", "pB", "pb", "Po", "PO", "pO", "po"];

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");

            inject(function (_CommonService_, AddressModel) {
                CommonService = _CommonService_;
                _ = CommonService._;

                address = TestUtils.getRandomAddress(AddressModel);
            });
        });

        describe("has a set function that", function () {

            var mockAddressResource,
                addressModelKeys,
                addressResourceKeys;

            beforeEach(inject(function (AddressModel) {
                mockAddressResource = angular.extend(TestUtils.getRandomAddress(AddressModel), {
                    newField1: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField2: TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    newField3: TestUtils.getRandomStringThatIsAlphaNumeric(10)
                });

                // set all values to "default" to more easily detect any changes
                for (var property in address) {
                    if (_.has(address, property)) {
                        address[property] = "default";
                    }
                }

                addressModelKeys = _.keys(address);
                addressResourceKeys = _.keys(mockAddressResource);
            }));

            it("should set the AddressModel object with the fields from the passed in addressResource object that they have in common", function () {
                var key,
                    keysIntersection = _.intersection(addressModelKeys, addressResourceKeys);

                address.set(mockAddressResource);

                for (var i = 0; i < keysIntersection.length; i++) {
                    key = keysIntersection[i];
                    expect(address[key]).toEqual(mockAddressResource[key]);
                }
            });

            it("should NOT change the AddressModel object fields that the addressResource object does not have", function () {
                var key,
                    keysDifference = _.difference(addressModelKeys, addressResourceKeys);

                address.set(mockAddressResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(address[key]).toEqual("default");
                }
            });

            it("should extend the AddressModel object with the fields from the passed in addressResource object that the AddressModel does not have", function () {
                var key,
                    keysDifference = _.difference(addressResourceKeys, addressModelKeys);

                address.set(mockAddressResource);

                for (var i = 0; i < keysDifference.length; i++) {
                    key = keysDifference[i];
                    expect(_.has(address, key)).toBeTruthy();
                    expect(address[key]).toEqual(mockAddressResource[key]);
                }
            });

        });

        describe("has an isPoBox function that", function () {
            var result;

            beforeEach(function () {
                spyOn(CommonService, "isPoBox").and.callThrough();
            });

            describe("when addressLine1 is a PO Box", function () {

                beforeEach(function () {
                    address.addressLine1 = TestUtils.getRandomValueFromArray(poBoxAcceptableValues);

                    result = address.isPoBox();
                });

                it("should call CommonService.isPoBox with addressLine1", function () {
                    expect(CommonService.isPoBox).toHaveBeenCalledWith(address.addressLine1);
                });

                it("should return true", function () {
                    expect(result).toBeTruthy();
                });
            });

            describe("when addressLine1 is NOT a PO Box", function () {

                beforeEach(function () {
                    address.addressLine1 = TestUtils.getRandomValueFromArray(poBoxUnacceptableValues);
                });

                describe("when addressLine2 is a PO Box", function () {

                    beforeEach(function () {
                        address.addressLine2 = TestUtils.getRandomValueFromArray(poBoxAcceptableValues);

                        result = address.isPoBox();
                    });

                    it("should call CommonService.isPoBox with addressLine1", function () {
                        expect(CommonService.isPoBox).toHaveBeenCalledWith(address.addressLine1);
                    });

                    it("should call CommonService.isPoBox with addressLine2", function () {
                        expect(CommonService.isPoBox).toHaveBeenCalledWith(address.addressLine2);
                    });

                    it("should return true", function () {
                        expect(result).toBeTruthy();
                    });
                });

                describe("when addressLine2 is NOT a PO Box", function () {

                    beforeEach(function () {
                        address.addressLine2 = TestUtils.getRandomValueFromArray(poBoxUnacceptableValues);

                        result = address.isPoBox();
                    });

                    it("should call CommonService.isPoBox with addressLine1", function () {
                        expect(CommonService.isPoBox).toHaveBeenCalledWith(address.addressLine1);
                    });

                    it("should call CommonService.isPoBox with addressLine2", function () {
                        expect(CommonService.isPoBox).toHaveBeenCalledWith(address.addressLine2);
                    });

                    it("should return false", function () {
                        expect(result).toBeFalsy();
                    });
                });
            });
        });

    });

})();