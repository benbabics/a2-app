(function () {
    "use strict";

    describe("A Core Module run block", function () {

        var $q,
            $rootScope,
            $state,
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
            AuthenticationManager,
            CommonService,
            PaymentManager,
            UserManager;

        beforeEach(function () {

            module("app.shared");
            module("app.components");
            module("app.shared");
            module("app.html");

            // mock dependencies
            AuthenticationManager = jasmine.createSpyObj("AuthenticationManager", ["logOut", "userLoggedIn"]);
            CommonService = jasmine.createSpyObj("CommonService", ["displayAlert", "loadingBegin", "loadingComplete"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchMakePaymentAvailability"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            module(function($provide) {
                $provide.value("AuthenticationManager", AuthenticationManager);
                $provide.value("CommonService", CommonService);
                $provide.value("PaymentManager", PaymentManager);
                $provide.value("UserManager", UserManager);
            });

            inject(function (_$q_, _$rootScope_, _$state_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;

                spyOn($rootScope, "$on").and.callThrough();
            });

        });

        describe("should set a $stateChangeStart event handler that", function () {
            var loginRoute = "user.auth.login",
                landingRoute = "landing",
                paymentAddRoute = "payment.add";

            //TODO - the module's run block finishes before the spy can be injected into $rootScope
            //Figure out how to test this
            xit("should be set on the $stateChangeStart event", function () {
                expect($rootScope.$on).toHaveBeenCalledWith("$stateChangeStart", jasmine.any(Function));
            });

            describe("when the user is logged in", function () {

                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(true);
                });

                describe("when the user is navigating to the login page", function () {

                    beforeEach(function () {
                        $state.go(loginRoute);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });

                describe("when the user is navigating to the landing page", function () {

                    beforeEach(function () {
                        $state.go(landingRoute);
                        $rootScope.$digest();
                    });

                    //TODO - figure out why this doesn't work. The resolve method does not seem to be getting called
                    xit("should continue to the page", function () {
                        expect($state.current.name).toEqual(landingRoute);
                    });
                });

                describe("when the user is navigating to the payment add page", function () {
                    var makePaymentAvailability = {},
                        fetchMakePaymentAvailabilityDeferred;

                    describe("when bank accounts have NOT been setup", function () {

                        beforeEach(function () {
                            makePaymentAvailability = {
                                makePaymentAllowed: false,
                                shouldDisplayBankAccountSetupMessage: true,
                                shouldDisplayDirectDebitEnabledMessage: false,
                                shouldDisplayOutstandingPaymentMessage: false
                            };

                            fetchMakePaymentAvailabilityDeferred = $q.defer();
                            PaymentManager.fetchMakePaymentAvailability.and.returnValue(fetchMakePaymentAvailabilityDeferred.promise);
                            fetchMakePaymentAvailabilityDeferred.resolve(makePaymentAvailability);

                            UserManager.getUser.and.returnValue(mockUser);

                            $state.go(paymentAddRoute);
                            $rootScope.$digest();
                        });

                        it("should call PaymentManager.fetchMakePaymentAvailability", function () {
                            expect(PaymentManager.fetchMakePaymentAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                        });

                        it("should call CommonService.displayAlert", function () {
                            expect(CommonService.displayAlert).toHaveBeenCalledWith({
                                cssClass: "wex-warning-popup",
                                content: "You must set up your financial institutions as your payment options online prior to scheduling a payment.",
                                buttonCssClass: "button-submit"
                            });
                        });
                    });

                    describe("when direct debit has been setup", function () {

                        beforeEach(function () {
                            makePaymentAvailability = {
                                makePaymentAllowed: false,
                                shouldDisplayBankAccountSetupMessage: false,
                                shouldDisplayDirectDebitEnabledMessage: true,
                                shouldDisplayOutstandingPaymentMessage: false
                            };

                            fetchMakePaymentAvailabilityDeferred = $q.defer();
                            PaymentManager.fetchMakePaymentAvailability.and.returnValue(fetchMakePaymentAvailabilityDeferred.promise);
                            fetchMakePaymentAvailabilityDeferred.resolve(makePaymentAvailability);

                            UserManager.getUser.and.returnValue(mockUser);

                            $state.go(paymentAddRoute);
                            $rootScope.$digest();
                        });

                        it("should call PaymentManager.fetchMakePaymentAvailability", function () {
                            expect(PaymentManager.fetchMakePaymentAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                        });

                        it("should call CommonService.displayAlert", function () {
                            expect(CommonService.displayAlert).toHaveBeenCalledWith({
                                cssClass: "wex-warning-popup",
                                content: "Online payment is not currently available for this account. The account has set up an alternative method of payment, such as direct debit.",
                                buttonCssClass: "button-submit"
                            });
                        });
                    });

                    describe("when no messages should be displayed", function () {

                        beforeEach(function () {
                            makePaymentAvailability = {
                                makePaymentAllowed: true,
                                shouldDisplayBankAccountSetupMessage: false,
                                shouldDisplayDirectDebitEnabledMessage: false,
                                shouldDisplayOutstandingPaymentMessage: false
                            };

                            fetchMakePaymentAvailabilityDeferred = $q.defer();
                            PaymentManager.fetchMakePaymentAvailability.and.returnValue(fetchMakePaymentAvailabilityDeferred.promise);
                            fetchMakePaymentAvailabilityDeferred.resolve(makePaymentAvailability);

                            UserManager.getUser.and.returnValue(mockUser);

                            $state.go(paymentAddRoute);
                            $rootScope.$digest();
                        });

                        it("should call PaymentManager.fetchMakePaymentAvailability", function () {
                            expect(PaymentManager.fetchMakePaymentAvailability).toHaveBeenCalledWith(mockUser.billingCompany.accountId);
                        });

                        it("should continue to the page", function () {
                            expect($state.current.name).toEqual(paymentAddRoute);
                        });

                    });

                });
            });

            describe("when the user is NOT logged in", function () {

                beforeEach(function () {
                    AuthenticationManager.userLoggedIn.and.returnValue(false);
                });

                describe("when the user is navigating to the login page", function () {

                    beforeEach(function () {
                        $state.go(loginRoute);
                        $rootScope.$digest();
                    });

                    it("should continue to the page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });

                describe("when the user is navigating to the landing page", function () {

                    beforeEach(function () {
                        $state.go(landingRoute);
                        $rootScope.$digest();
                    });

                    it("should redirect to the login page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });

                describe("when the user is navigating to the payment add page", function () {

                    beforeEach(function () {
                        $state.go(paymentAddRoute);
                        $rootScope.$digest();
                    });

                    it("should redirect to the login page", function () {
                        expect($state.current.name).toEqual(loginRoute);
                    });
                });
            });
        });

        describe("has a cordovaPause event handler function that", function () {

            beforeEach(function() {
                $rootScope.$broadcast("cordovaPause");
            });

            it("should log out the User", function () {
                expect(AuthenticationManager.logOut).toHaveBeenCalledWith();
            });

        });
    });
})();