(function () {
    "use strict";

    describe("A User Model Service", function () {

        var $q,
            $rootScope,
            user,
            BRAND,
            ONLINE_APPLICATION;

        beforeEach(inject(function (sharedGlobals, _$rootScope_, _$q_, UserModel) {
            BRAND = sharedGlobals.BRAND;
            ONLINE_APPLICATION = sharedGlobals.USER.ONLINE_APPLICATION;
            $q = _$q_;
            $rootScope = _$rootScope_;
            user = new UserModel();
        }));

        describe("has a getDisplayAccountNumber function that", function () {

            describe("when the online application type is WOL_NP", function () {

                beforeEach(function () {
                    user.onlineApplication = ONLINE_APPLICATION.WOL_NP;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is CLASSIC", function () {

                beforeEach(function () {
                    user.onlineApplication = ONLINE_APPLICATION.CLASSIC;
                });

                it("should return the wexAccountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.wexAccountNumber);
                });
            });

            describe("when the online application type is unrecognized", function () {

                beforeEach(function () {
                    user.onlineApplication = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is empty", function () {

                beforeEach(function () {
                    user.onlineApplication = "";
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is null", function () {

                beforeEach(function () {
                    user.onlineApplication = null;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });

            describe("when the online application type is undefined", function () {

                beforeEach(function () {
                    delete user.onlineApplication;
                });

                it("should return the accountNumber", function () {
                    expect(user.getDisplayAccountNumber()).toEqual(user.billingCompany.accountNumber);
                });
            });
        });
    });

})();