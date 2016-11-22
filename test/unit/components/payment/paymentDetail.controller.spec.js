(function () {
    "use strict";

    var _,
        $rootScope,
        $scope,
        $state,
        Navigation,
        $q,
        ctrl,
        Popup,
        PaymentManager,
        UserManager,
        confirmDeferred,
        removePaymentDeferred,
        mockPayment,
        mockIsPaymentEditable = TestUtils.getRandomBoolean(),
        globals,
        config,
        mockUser,
        self;

    describe("A Payment View Controller", function () {

        beforeEach(function () {
            self = this;

            // mock dependencies
            $state = jasmine.createSpyObj("$state", ["go"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["removePayment"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            Popup = jasmine.createSpyObj("Popup", ["displayConfirm"]);
            Navigation = jasmine.createSpyObj("Navigation", ["goToPaymentActivity"]);

            inject(function (___, _$rootScope_, $controller, _$q_, _globals_, BankModel, PaymentModel, UserAccountModel, UserModel) {
                _ = ___;
                $rootScope = _$rootScope_;
                $q = _$q_;
                globals = _globals_;
                confirmDeferred = $q.defer();
                removePaymentDeferred = $q.defer();
                config = globals.PAYMENT_VIEW.CONFIG;

                mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentDetailController", {
                    $scope           : $scope,
                    $state           : $state,
                    Navigation       : Navigation,
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

        afterEach(function () {
            _ =
            $rootScope =
            $scope =
            $state =
            Navigation =
            $q =
            ctrl =
            Popup =
            PaymentManager =
            UserManager =
            confirmDeferred =
            removePaymentDeferred =
            mockPayment =
            mockIsPaymentEditable =
            globals =
            config =
            mockUser =
            self = null;
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
                    content             : config.cancelPaymentConfirm.content,
                    okButtonText        : config.cancelPaymentConfirm.yesButton,
                    cancelButtonText    : config.cancelPaymentConfirm.noButton,
                    okButtonCssClass    : "button-primary",
                    cancelButtonCssClass: "button-secondary"
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

                it("should call this.AnalyticsUtil.trackEvent", function () {
                    verifyEventTracked(config.ANALYTICS.events.confirmPaymentCancel);
                });

                describe("when removing the payment is successful", function () {

                    beforeEach(function () {
                        removePaymentDeferred.resolve();
                        $rootScope.$digest();
                    });

                    it("should go to the payment activity page", function () {
                        expect(Navigation.goToPaymentActivity).toHaveBeenCalledWith();
                    });
                });

                describe("when removing the payment is NOT successful", function () {

                    beforeEach(function () {
                        removePaymentDeferred.reject();
                        $rootScope.$digest();
                    });

                    it("should NOT go to the payment activity page", function () {
                        expect(Navigation.goToPaymentActivity).not.toHaveBeenCalled();
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

                it("should NOT go to the payment activity page", function () {
                    expect(Navigation.goToPaymentActivity).not.toHaveBeenCalled();
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
        expect(self.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
    }

}());