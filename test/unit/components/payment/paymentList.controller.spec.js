(function () {
    "use strict";

    var _,
        $rootScope,
        $scope,
        $q,
        globals,
        ctrl,
        mockCompletedPayments,
        mockPayments,
        mockScheduledPayments,
        mockUser,
        UserManager,
        PaymentManager,
        LoadingIndicator,
        fetchPaymentsDeferred,
        resolveHandler,
        rejectHandler;

    describe("A Payment List Controller", function () {

        beforeEach(function () {

            //create mock dependencies
            UserManager = jasmine.createSpyObj("UserManager", ["getUser", "userLoggedIn"]);
            PaymentManager = jasmine.createSpyObj("PaymentManager", ["fetchPayments"]);
            LoadingIndicator = jasmine.createSpyObj("LoadingIndicator", ["begin", "complete"]);

            inject(function (___, $controller, _$rootScope_, _$q_, _globals_, BankModel, PaymentModel, UserAccountModel, UserModel) {
                _ = ___;
                $q = _$q_;
                $rootScope = _$rootScope_;
                globals = _globals_;

                // setup mock objects
                mockCompletedPayments = getRandomNotScheduledPayments(PaymentModel, BankModel);
                mockScheduledPayments = getRandomScheduledPayments(PaymentModel, BankModel);
                mockPayments = _.union(mockCompletedPayments, mockScheduledPayments);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel, globals.USER.ONLINE_APPLICATION);
                fetchPaymentsDeferred = $q.defer();

                UserManager.getUser.and.returnValue(mockUser);
                UserManager.userLoggedIn.and.returnValue(true);
                PaymentManager.fetchPayments.and.returnValue(fetchPaymentsDeferred.promise);

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("PaymentListController", {
                    $scope          : $scope,
                    LoadingIndicator: LoadingIndicator,
                    PaymentManager  : PaymentManager,
                    UserManager     : UserManager
                });

            });

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has an activate function that", function () {

            it("should call LoadingIndicator.begin", function () {
                expect(LoadingIndicator.begin).toHaveBeenCalledWith();
            });

            it("should call PaymentManager.fetchPayments", function () {
                expect(PaymentManager.fetchPayments).toHaveBeenCalledWith(mockUser.billingCompany.accountId,
                    globals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_NUMBER,
                    globals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_SIZE);
            });

            describe("when the payments are successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.resolve(mockPayments);
                    $rootScope.$digest();
                });

                it("should set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual(_.orderBy(mockCompletedPayments, ["scheduledDate"], ["desc"]));
                });

                it("should set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual(_.orderBy(mockScheduledPayments, ["scheduledDate"], ["asc"]));
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });

            describe("when the payments are NOT successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.reject();
                    $rootScope.$digest();
                });

                it("should NOT set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual({});
                });

                it("should NOT set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual({});
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });
            });
        });

        describe("has a fetchPayments function that", function () {

            beforeEach(function () {
                spyOn($scope, "$broadcast").and.callThrough();

                ctrl.fetchPayments()
                    .then(resolveHandler)
                    .catch(rejectHandler);
            });

            it("should broadcast 'scroll.refreshComplete'", function () {
                expect($scope.$broadcast).toHaveBeenCalledWith("scroll.refreshComplete");
            });

            it("should call LoadingIndicator.begin", function () {
                expect(LoadingIndicator.begin).toHaveBeenCalledWith();
            });

            it("should call PaymentManager.fetchPayments", function () {
                expect(PaymentManager.fetchPayments).toHaveBeenCalledWith(mockUser.billingCompany.accountId,
                    globals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_NUMBER,
                    globals.PAYMENT_LIST.SEARCH_OPTIONS.PAGE_SIZE);
            });

            describe("when the payments are successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.resolve(mockPayments);
                    $rootScope.$digest();
                });

                it("should set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual(_.orderBy(mockCompletedPayments, ["scheduledDate"], ["desc"]));
                });

                it("should set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual(_.orderBy(mockScheduledPayments, ["scheduledDate"], ["asc"]));
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });

                it("should resolve", function () {
                    expect(resolveHandler).toHaveBeenCalled();
                });
            });

            describe("when the payments are NOT successfully fetched", function () {

                beforeEach(function () {
                    fetchPaymentsDeferred.reject();
                    $rootScope.$digest();
                });

                it("should NOT set the completed payments", function () {
                    expect(ctrl.completedPayments).toEqual({});
                });

                it("should NOT set the scheduled payments", function () {
                    expect(ctrl.scheduledPayments).toEqual({});
                });

                it("should call LoadingIndicator.complete", function () {
                    expect(LoadingIndicator.complete).toHaveBeenCalledWith();
                });

                it("should reject", function () {
                    expect(rejectHandler).toHaveBeenCalled();
                });
            });
        });

    });

    function getRandomNotScheduledPayments(PaymentModel, BankModel) {
        var i,
            mockPaymentCollection,
            numModels;

        mockPaymentCollection = [];
        numModels = TestUtils.getRandomInteger(1, 100);
        for (i = 0; i < numModels; ++i) {
            mockPaymentCollection.push(TestUtils.getRandomPayment(PaymentModel, BankModel));
        }

        return mockPaymentCollection;
    }

    function getRandomScheduledPayment(PaymentModel, BankModel) {
        var mockPayment = TestUtils.getRandomPayment(PaymentModel, BankModel);

        mockPayment.status = "SCHEDULED";

        return mockPayment;
    }

    function getRandomScheduledPayments(PaymentModel, BankModel) {
        var i,
            mockPaymentCollection,
            numModels;

        mockPaymentCollection = [];
        numModels = TestUtils.getRandomInteger(1, 100);
        for (i = 0; i < numModels; ++i) {
            mockPaymentCollection.push(getRandomScheduledPayment(PaymentModel, BankModel));
        }

        return mockPaymentCollection;
    }

}());
