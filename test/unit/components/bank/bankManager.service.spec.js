(function () {
    "use strict";

    var _,
        $q,
        $rootScope,
        accountId = TestUtils.getRandomStringThatIsAlphaNumeric(8),
        getActiveBanksDeferred,
        resolveHandler,
        rejectHandler,
        bankModel1, bankModel2, bankModel3,
        mockBankCollection = {},
        BankManager,
        BankModel,
        BanksResource;

    describe("A Bank Manager", function () {

        beforeEach(function () {

            module("app.shared");
            module("app.html");
            module("app.components.account");
            module("app.components.bank");

            // mock dependencies
            BanksResource = jasmine.createSpyObj("BanksResource", ["getActiveBanks"]);

            module(function ($provide) {
                $provide.value("BanksResource", BanksResource);
            });

            inject(function (_$q_, _$rootScope_, globals, _BankManager_, _BankModel_, _CommonService_) {
                _ = _CommonService_._;
                $q = _$q_;
                $rootScope = _$rootScope_;
                BankManager = _BankManager_;
                BankModel = _BankModel_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");

            // set up mocks
            bankModel1 = TestUtils.getRandomBank(BankModel);
            bankModel2 = TestUtils.getRandomBank(BankModel);
            bankModel3 = TestUtils.getRandomBank(BankModel);

            mockBankCollection = {};
            mockBankCollection[bankModel1.id] = bankModel1;
            mockBankCollection[bankModel2.id] = bankModel2;
            mockBankCollection[bankModel3.id] = bankModel3;
        });

        describe("has an activate function that", function () {

            // TODO: figure out how to test this

        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function() {
                BankManager.setActiveBanks(mockBankCollection);
                $rootScope.$broadcast("userLoggedOut");
            });

            it("should reset the active banks", function () {
                expect(BankManager.getActiveBanks()).not.toEqual(mockBankCollection);
            });

        });

        describe("has a fetchActiveBanks function that", function () {

            beforeEach(function () {
                getActiveBanksDeferred = $q.defer();

                BanksResource.getActiveBanks.and.returnValue(getActiveBanksDeferred.promise);

                BankManager.setActiveBanks(null);

                BankManager.fetchActiveBanks(accountId)
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting the active banks", function () {

                it("should call BanksResource.getActiveBanks", function () {
                    expect(BanksResource.getActiveBanks).toHaveBeenCalledWith(accountId);
                });

            });

            describe("when the active banks are fetched successfully", function () {

                var mockRemoteBanks = {data: {}};

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        mockRemoteBanks.data = _.values(mockBankCollection);
                        getActiveBanksDeferred.resolve(mockRemoteBanks);

                        BanksResource.getActiveBanks.and.returnValue(getActiveBanksDeferred.promise);

                        BankManager.setActiveBanks(null);

                        BankManager.fetchActiveBanks(accountId)
                            .then(resolveHandler).catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should set the active banks", function () {
                        expect(BankManager.getActiveBanks()).toEqual(mockBankCollection);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockBankCollection);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                });

                describe("when there is no data in the response", function () {

                    beforeEach(function () {
                        getActiveBanksDeferred.resolve(null);
                    });

                    it("should throw an error", function () {
                        expect($rootScope.$digest).toThrow();
                    });

                    it("should NOT update the active banks", function () {
                        expect(BankManager.getActiveBanks()).toBeNull();
                    });

                });
            });

            describe("when retrieving the active banks fails", function () {

                var mockResponse = "Some error";

                beforeEach(function () {
                    getActiveBanksDeferred.reject(mockResponse);
                });

                it("should throw an error", function () {
                    expect($rootScope.$digest).toThrow();
                });

                it("should NOT update the active banks", function () {
                    expect(BankManager.getActiveBanks()).toBeNull();
                });

            });

        });

        describe("has a getActiveBanks function that", function () {

            var newActiveBanks = [
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
                ];

            it("should return the active banks passed to setActiveBanks", function () {
                var result;

                BankManager.setActiveBanks(newActiveBanks);
                result = BankManager.getActiveBanks();

                expect(result).toEqual(newActiveBanks);
            }) ;

            // TODO: figure out how to test this without using setActiveBanks
        });

        describe("has a getOrFetchActiveBanks function that", function () {

            var result;

            beforeEach(function () {
                BanksResource.getActiveBanks.and.returnValue(getActiveBanksDeferred.promise);
            });

            describe("when activeBanks have already been fetched", function () {

                beforeEach(function () {
                    BankManager.setActiveBanks(mockBankCollection);

                    BankManager.getOrFetchActiveBanks(accountId)
                        .then(function (bankAccounts) { result = bankAccounts; })
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should NOT call BanksResource.getActiveBanks", function () {
                    expect(BanksResource.getActiveBanks).not.toHaveBeenCalledWith();
                });

                it("should return the correct result", function () {
                    expect(result).toEqual(mockBankCollection);
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

            describe("when activeBanks have NOT been fetched", function () {

                beforeEach(function () {
                    BankManager.setActiveBanks(null);

                    BankManager.getOrFetchActiveBanks(accountId)
                        .then(function (bankAccounts) { result = bankAccounts; })
                        .catch(rejectHandler);

                    getActiveBanksDeferred.resolve(mockBankCollection);
                    $rootScope.$digest();
                });

                it("should call BanksResource.getActiveBanks", function () {
                    expect(BanksResource.getActiveBanks).toHaveBeenCalledWith(accountId);
                });

                it("should return the correct result", function () {
                    expect(result).not.toBeNull();
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a getDefaultBank function that", function () {

            var defaultBank,
                expectedResult;

            describe("when none of the banks are the default", function () {

                beforeEach(function () {
                    bankModel1 = TestUtils.getRandomBank(BankModel);
                    bankModel1.defaultBank = false;

                    bankModel2 = TestUtils.getRandomBank(BankModel);
                    bankModel2.defaultBank = false;

                    bankModel3 = TestUtils.getRandomBank(BankModel);
                    bankModel3.defaultBank = false;

                    mockBankCollection = {};
                    mockBankCollection[bankModel1.id] = bankModel1;
                    mockBankCollection[bankModel2.id] = bankModel2;
                    mockBankCollection[bankModel3.id] = bankModel3;

                    BankManager.setActiveBanks(mockBankCollection);

                    expectedResult = _.first(_.sortBy(mockBankCollection, "name"));

                    BankManager.getDefaultBank(accountId)
                        .then(function (response) {
                            defaultBank = response;
                        })
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should return the correct bank", function () {
                    expect(defaultBank).toEqual(expectedResult);
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

            describe("when there is a default bank", function () {

                beforeEach(function () {
                    bankModel1 = TestUtils.getRandomBank(BankModel);
                    bankModel1.defaultBank = false;

                    bankModel2 = TestUtils.getRandomBank(BankModel);
                    bankModel2.defaultBank = true;

                    bankModel3 = TestUtils.getRandomBank(BankModel);
                    bankModel3.defaultBank = false;

                    mockBankCollection = {};
                    mockBankCollection[bankModel1.id] = bankModel1;
                    mockBankCollection[bankModel2.id] = bankModel2;
                    mockBankCollection[bankModel3.id] = bankModel3;

                    BankManager.setActiveBanks(mockBankCollection);

                    expectedResult = bankModel2;

                    BankManager.getDefaultBank(accountId)
                        .then(function (response) {
                            defaultBank = response;
                        })
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should return the correct bank", function () {
                    expect(defaultBank).toEqual(expectedResult);
                });

                it("should NOT reject", function () {
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

            });

        });

        describe("has a setActiveBanks function that", function () {

            var newActiveBanks = [
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
                ];

            it("should update the active banks returned by getActiveBanks", function () {
                var result;

                BankManager.setActiveBanks(newActiveBanks);
                result = BankManager.getActiveBanks();

                expect(result).toEqual(newActiveBanks);
            }) ;

            // TODO: figure out how to test this without using getActiveBanks
        });

    });

})();