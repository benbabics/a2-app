(function () {
    "use strict";

    var _,
        $rootScope,
        $scope,
        $state,
        $cordovaGoogleAnalytics,
        $q,
        ctrl,
        CommonService,
        PaymentManager,
        UserManager,
        confirmDeferred,
        removePaymentDeferred,
        mockPayment,
        mockIsPaymentEditable = TestUtils.getRandomBoolean(),
        mockGlobals = {
            PAYMENT_VIEW: {
                "CONFIG": {
                    "ANALYTICS"   : {
                        "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
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

            module("app.shared");
            module("app.components");

            module(function ($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, mockGlobals, sharedGlobals));
            });

            // stub the routing and template loading
            module(function ($urlRouterProvider) {
                $urlRouterProvider.deferIntercept();
            });

            module(function ($provide) {
                $provide.value("$ionicTemplateCache", function () {
                });
            });

            // mock dependencies
            $state = jasmine.createSpyObj("$state", ["go"]);
            CommonService = jasmine.createSpyObj("CommonService", ["displayConfirm", "waitForCordovaPlatform"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["removePayment"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            $cordovaGoogleAnalytics = jasmine.createSpyObj("$cordovaGoogleAnalytics", ["trackView"]);

            inject(function (_$rootScope_, _CommonService_, $controller, _$q_, BankModel, PaymentModel, UserAccountModel, UserModel) {

                $rootScope = _$rootScope_;
                $q = _$q_;
                _ = _CommonService_._;
                confirmDeferred = $q.defer();
                removePaymentDeferred = $q.defer();

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentDetailController", {
                    $scope                 : $scope,
                    $state                 : $state,
                    $cordovaGoogleAnalytics: $cordovaGoogleAnalytics,
                    CommonService          : CommonService,
                    PaymentManager         : PaymentManager,
                    UserManager            : UserManager,
                    payment                : mockPayment,
                    isPaymentEditable      : mockIsPaymentEditable
                });
            });

            CommonService.displayConfirm.and.returnValue(confirmDeferred.promise);
            UserManager.getUser.and.returnValue(mockUser);
            PaymentManager.removePayment.and.returnValue(removePaymentDeferred.promise);
            CommonService.waitForCordovaPlatform.and.callFake(function(callback) {
                //just execute the callback directly
                return $q.when((callback || function() {})());
            });
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

            it("should call $cordovaGoogleAnalytics.trackView", function () {
                expect($cordovaGoogleAnalytics.trackView).toHaveBeenCalledWith(mockConfig.ANALYTICS.pageName);
            });

        });

        describe("has a displayCancelPaymentPopup function that", function () {

            beforeEach(function () {
                ctrl.payment = mockPayment;

                ctrl.displayCancelPaymentPopup();
            });

            it("should call CommonService.displayConfirm with the expected values", function () {
                expect(CommonService.displayConfirm).toHaveBeenCalledWith({
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

}());