(function () {
    "use strict";

    var _,
        $rootScope,
        $scope,
        $state,
        AnalyticsUtil,
        $q,
        ctrl,
        Popup,
        PaymentManager,
        UserManager,
        confirmDeferred,
        removePaymentDeferred,
        mockPayment,
        mockIsPaymentEditable = TestUtils.getRandomBoolean(),
        mockGlobals = {
            LOCALSTORAGE : {
                "CONFIG": {
                    "keyPrefix": "FLEET_MANAGER-"
                },
                "KEYS": {
                    "LAST_BRAND_UPDATE_DATE": "LAST_BRAND_UPDATE_DATE"
                }
            },
            PAYMENT_VIEW: {
                "CONFIG": {
                    "ANALYTICS"   : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "events": {
                            "cancelPaymentLink"   : [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ],
                            "editPaymentLink"     : [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ],
                            "confirmPaymentCancel": [
                                TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            ]
                        }
                    },
                    "title"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "amount"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "bankAccount"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "postedDate"          : TestUtils.getRandomDate(),
                    "scheduledDate"       : TestUtils.getRandomDate(),
                    "inProcess"           : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "method"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "editButton"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cancelButton"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                    "cancelPaymentConfirm": {
                        "content"  : TestUtils.getRandomStringThatIsAlphaNumeric(20),
                        "yesButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "noButton" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                }
            }
        },
        mockConfig = mockGlobals.PAYMENT_VIEW.CONFIG,
        mockUser;

    describe("A Payment View Controller", function () {

        beforeEach(function () {

            // mock dependencies
            $state = jasmine.createSpyObj("$state", ["go"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["removePayment"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            AnalyticsUtil = jasmine.createSpyObj("AnalyticsUtil", [
                "getActiveTrackerId",
                "hasActiveTracker",
                "setUserId",
                "startTracker",
                "trackEvent",
                "trackView"
            ]);
            Popup = jasmine.createSpyObj("Popup", ["displayConfirm"]);

            module("app.shared");
            module("app.components", function ($provide, sharedGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, mockGlobals));

                $provide.value("AnalyticsUtil", AnalyticsUtil);
            });

            module(function ($provide, sharedGlobals, appGlobals) {
                $provide.constant("globals", angular.extend({}, sharedGlobals, appGlobals, mockGlobals));
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            inject(function (___, _$rootScope_, $controller, _$q_, BankModel, PaymentModel, UserAccountModel, UserModel) {

                $rootScope = _$rootScope_;
                $q = _$q_;
                confirmDeferred = $q.defer();
                removePaymentDeferred = $q.defer();

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentDetailController", {
                    $scope           : $scope,
                    $state           : $state,
                    AnalyticsUtil    : AnalyticsUtil,
                    PaymentManager   : PaymentManager,
                    Popup            : Popup,
                    UserManager      : UserManager,
                    payment          : mockPayment,
                    isPaymentEditable: mockIsPaymentEditable
                });
            });

            //setup mocks:
            UserManager.getUser.and.returnValue(mockUser);
            PaymentManager.removePayment.and.returnValue(removePaymentDeferred.promise);

            //setup spies:
            Popup.displayConfirm.and.returnValue(confirmDeferred.promise);
        });

        describe("has an $ionicView.beforeEnter event handler function that", function () {

            beforeEach(function() {
                //setup an existing values to test them being modified
                ctrl.payment = null;
                ctrl.scheduledPaymentsCount = null;

                $scope.$broadcast("$ionicView.beforeEnter");
            });

            it("should set the payment", function () {
                expect(ctrl.payment).toEqual(mockPayment);
            });

            it("should set the is payment editable indicator", function () {
                expect(ctrl.isPaymentEditable).toEqual(mockIsPaymentEditable);
            });

        });

        describe("has a displayCancelPaymentPopup function that", function () {

            beforeEach(function () {
                ctrl.payment = mockPayment;

                ctrl.displayCancelPaymentPopup();
            });

            it("should call Popup.displayConfirm with the expected values", function () {
                expect(Popup.displayConfirm).toHaveBeenCalledWith({
                    content             : mockConfig.cancelPaymentConfirm.content,
                    okButtonText        : mockConfig.cancelPaymentConfirm.yesButton,
                    cancelButtonText    : mockConfig.cancelPaymentConfirm.noButton,
                    okButtonCssClass    : "button-submit",
                    cancelButtonCssClass: "button-default"
                });
            });

            describe("when the user confirms the cancel", function () {

                beforeEach(function() {
                    confirmDeferred.resolve(true);
                    $rootScope.$digest();
                });

                it("should call PaymentManager.removePayment with the expected values", function () {
                    expect(PaymentManager.removePayment).toHaveBeenCalledWith(
                        mockUser.billingCompany.accountId,
                        mockPayment.id
                    );
                });

                it("should call AnalyticsUtil.trackEvent", function () {
                    verifyEventTracked(mockConfig.ANALYTICS.events.confirmPaymentCancel);
                });

                describe("when removing the payment is successful", function () {

                    beforeEach(function () {
                        removePaymentDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should redirect to payment.list.view", function () {
                        expect($state.go).toHaveBeenCalledWith("payment.list.view");
                    });
                });

                describe("when removing the payment is NOT successful", function () {

                    beforeEach(function () {
                        removePaymentDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should NOT redirect to payment.list.view", function () {
                        expect($state.go).not.toHaveBeenCalledWith("payment.list.view");
                    });
                });
            });

            describe("when the user denies the cancel", function () {

                beforeEach(function () {
                    confirmDeferred.resolve(false);
                    $rootScope.$digest();
                });

                it("should NOT call PaymentManager.removePayment", function () {
                    expect(PaymentManager.removePayment).not.toHaveBeenCalledWith();
                });

                it("should NOT redirect to payment.list.view", function () {
                    expect($state.go).not.toHaveBeenCalledWith("payment.list.view");
                });
            });
        });

        describe("has an editPayment function that", function () {

            beforeEach(function () {
                ctrl.payment = mockPayment;

                ctrl.editPayment();
            });

            it("should navigate to the payment.update flow with the expected paymentId", function () {
                expect($state.go).toHaveBeenCalledWith("payment.update", {paymentId: mockPayment.id});
            });
        });

    });

    function verifyEventTracked(event) {
        expect(AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());