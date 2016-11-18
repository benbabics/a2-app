(function () {
    "use strict";

    describe("An Address Model Service", function () {

        var address,
            AddressUtil,
            poBoxAcceptableValues = ["PO Box", "P O Box", "POBox", "P OBox", "P.O. Box", "P. O. Box", "P.O.Box", "P. O.Box",
                "PO. Box", "P O. Box", "PO.Box", "P OBox", "P.O Box", "P. O Box", "P.OBox", "P. OBox", "POB", "P.O.B.",
                "POST OFFICE BOX", "Post Office Box"],
            poBoxUnacceptableValues = ["P Box", "P Box", "PBox", "Pb", "PB", "pB", "pb", "Po", "PO", "pO", "po"];

        beforeEach(function () {

            inject(function (_AddressUtil_, AddressModel) {
                AddressUtil = _AddressUtil_;

                address = TestUtils.getRandomAddress(AddressModel);
            });
        });

        describe("has an isPoBox function that", function () {
            var result;

            beforeEach(function () {
                spyOn(AddressUtil, "isPoBox").and.callThrough();
            });

            describe("when addressLine1 is a PO Box", function () {

                beforeEach(function () {
                    address.addressLine1 = TestUtils.getRandomValueFromArray(poBoxAcceptableValues);

                    result = address.isPoBox();
                });

                it("should call AddressUtil.isPoBox with addressLine1", function () {
                    expect(AddressUtil.isPoBox).toHaveBeenCalledWith(address.addressLine1);
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

                    it("should call AddressUtil.isPoBox with addressLine1", function () {
                        expect(AddressUtil.isPoBox).toHaveBeenCalledWith(address.addressLine1);
                    });

                    it("should call AddressUtil.isPoBox with addressLine2", function () {
                        expect(AddressUtil.isPoBox).toHaveBeenCalledWith(address.addressLine2);
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

                    it("should call AddressUtil.isPoBox with addressLine1", function () {
                        expect(AddressUtil.isPoBox).toHaveBeenCalledWith(address.addressLine1);
                    });

                    it("should call AddressUtil.isPoBox with addressLine2", function () {
                        expect(AddressUtil.isPoBox).toHaveBeenCalledWith(address.addressLine2);
                    });

                    it("should return false", function () {
                        expect(result).toBeFalsy();
                    });
                });
            });
        });

    });

})();