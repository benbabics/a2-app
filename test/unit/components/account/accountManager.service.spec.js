(function () {
    "use strict";

    var $q,
        $rootScope,
        account,
        AccountManager,
        AccountsResource,
        AccountModel,
        AddressModel,
        ShippingCarrierModel,
        ShippingMethodModel,
        rejectHandler,
        resolveHandler;

    describe("An Account Manager", function () {

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");

            //mock dependencies:
            AccountsResource = jasmine.createSpyObj("AccountsResource", ["getAccount"]);

            module(function ($provide) {
                $provide.value("AccountsResource", AccountsResource);
            });

            inject(function (_$q_, _$rootScope_, _AccountManager_, _AccountModel_, _AddressModel_, _ShippingCarrierModel_, _ShippingMethodModel_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                AccountManager = _AccountManager_;
                AccountModel = _AccountModel_;
                AddressModel = _AddressModel_;
                ShippingCarrierModel = _ShippingCarrierModel_;
                ShippingMethodModel = _ShippingMethodModel_;
            });

            account = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);

            //setup spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has an activate function that", function () {
            // TODO: figure out how to test this
        });

        describe("has a clearCachedValues function that", function () {

            beforeEach(function () {
                AccountManager.setAccount(account);
                AccountManager.clearCachedValues();
            });

            it("should reset the account", function () {
                expect(AccountManager.getAccount()).toBeNull();
            });

        });

        describe("has a fetchAccount function that", function () {
            var cachedAccount,
                accountId;

            beforeEach(function () {
                cachedAccount = getRandomAccount();

                AccountManager.setAccount(cachedAccount);
            });

            describe("when the account is already cached", function () {

                beforeEach(function () {
                    accountId = cachedAccount.accountId;

                    AccountManager.fetchAccount(accountId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should NOT call AccountsResource.getAccount", function () {
                    expect(AccountsResource.getAccount).not.toHaveBeenCalled();
                });

                it("should resolve with the cached account", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(cachedAccount);
                    expect(rejectHandler).not.toHaveBeenCalled();
                });
            });

            describe("when the account is NOT already cached", function () {
                var getAccountDeferred;

                beforeEach(function () {
                    getAccountDeferred = $q.defer();

                    AccountsResource.getAccount.and.returnValue(getAccountDeferred.promise);
                });

                beforeEach(function () {
                    accountId = TestUtils.getRandomStringThatIsAlphaNumeric(15);

                    AccountManager.fetchAccount(accountId)
                        .then(resolveHandler)
                        .catch(rejectHandler);
                });

                it("should call AccountsResource.getAccount", function () {
                    expect(AccountsResource.getAccount).toHaveBeenCalledWith(accountId);
                });

                describe("when getting the account succeeds", function () {
                    var response = {data:{}};

                    describe("when there is data in the response", function () {

                        beforeEach(function () {
                            response.data = getRandomAccount();

                            getAccountDeferred.resolve(response);
                            $rootScope.$digest();
                        });

                        it("should resolve with a model for the account", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(angular.extend(new AccountModel(), response.data));
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });

                        it("should set the cached account to the new account", function () {
                            expect(AccountManager.getAccount()).toEqual(angular.extend(new AccountModel(), response.data));
                        });
                    });

                    describe("when there is NOT data in the response", function () {

                        beforeEach(function () {
                            delete response.data;

                            getAccountDeferred.resolve(response);
                        });

                        it("should throw an error", function () {
                            expect($rootScope.$digest).toThrowError("No data in Response from getting the account");
                        });

                        it("should NOT resolve", function () {
                            expect(resolveHandler).not.toHaveBeenCalled();
                        });

                        it("should NOT modify the cached account", function () {
                            expect(AccountManager.getAccount()).toEqual(cachedAccount);
                        });
                    });
                });

                describe("when getting the account fails", function () {
                    var error;

                    beforeEach(function () {
                        error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                        getAccountDeferred.reject(error);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrowError("Getting Account failed: " + error);
                    });

                    it("should NOT resolve", function () {
                        expect(resolveHandler).not.toHaveBeenCalled();
                    });

                    it("should NOT modify the cached account", function () {
                        expect(AccountManager.getAccount()).toEqual(cachedAccount);
                    });
                });
            });
        });

        describe("has a getAccount function that", function () {
            var account;

            beforeEach(function () {
                account = getRandomAccount();
            });

            it("should return the account passed to setAccount", function () {
                var result;

                AccountManager.setAccount(account);
                result = AccountManager.getAccount();

                expect(result).toEqual(account);
            }) ;

            // TODO: figure out how to test this without using setAccount
        });

        describe("has a setAccount function that", function () {
            var account;

            beforeEach(function () {
                account = getRandomAccount();
            });

            it("should replace the account with the new account", function () {
                var result;

                AccountManager.setAccount(account);
                result = AccountManager.getAccount();

                expect(result).toEqual(account);
            }) ;

            //TODO: figure out how to test this without using getAccount
        });
    });

    function getRandomAccount() {
        return TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
    }
})();
