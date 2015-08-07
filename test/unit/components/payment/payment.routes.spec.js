(function () {
    "use strict";

    describe("A Payment Module Route Config", function () {

        var $q,
            $rootScope,
            $state,
            mockActiveBanks = [
                {
                    id         : "Bank Id 1",
                    defaultBank: false,
                    name       : "Bank Name 1"
                },
                {
                    id         : "Bank Id 2",
                    defaultBank: true,
                    name       : "Bank Name 2"
                },
                {
                    id         : "Bank Id 3",
                    defaultBank: false,
                    name       : "Bank Name 3"
                }
            ],
            mockUser = {
                newField1: "some value",
                newField2: "some other value",
                newField3: "yet another value",
                email    : "email address value",
                firstName: "first name value",
                username : "username value",
                company  : {
                    accountId    : "company account id value",
                    accountNumber: "company account number value",
                    name         : "company name value"
                },
                billingCompany: {
                    accountId    : "billing company account id value",
                    accountNumber: "billing company account number value",
                    name         : "billing company name value"
                }
            },
            PaymentAdd,
            UserManager;

        beforeEach(function () {

            module("app.shared");
            module("app.components.payment");
            module("app.html");

            // mock dependencies
            PaymentAdd = jasmine.createSpyObj("PaymentAdd", ["getOrCreatePaymentAdd"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            module(function($provide) {
                $provide.value("PaymentAdd", PaymentAdd);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$q_, _$rootScope_, _$state_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
            });
        });

        describe("has a payment.add state that", function () {
            var state,
                stateName = "payment.add";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/add");
            });

            it("should define a payment-view", function () {
                expect(state.views).toBeDefined();
                expect(state.views["payment-view"]).toBeDefined();
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/payment/add");
            });

            describe("when navigated to", function () {

                var getOrFetchPaymentAddDeferred;

                beforeEach(function () {
                    getOrFetchPaymentAddDeferred = $q.defer();
                    UserManager.getUser.and.returnValue(mockUser);
                    PaymentAdd.getOrCreatePaymentAdd.and.returnValue(getOrFetchPaymentAddDeferred.promise);

                    $state.go(stateName);
                    getOrFetchPaymentAddDeferred.resolve(mockActiveBanks);
                    $rootScope.$digest();
                });

                it("should call PaymentAdd.getOrCreatePaymentAdd", function () {
                    expect(PaymentAdd.getOrCreatePaymentAdd).toHaveBeenCalledWith();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

            });

        });

    });

})();