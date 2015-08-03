(function () {
    "use strict";

    var $q,
        $rootScope,
        billingAccountId = "141v51235",
        getActiveBanksDeferred,
        resolveHandler,
        rejectHandler,
        BankManager,
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

            inject(function (_$q_, _$rootScope_, globals, _BankManager_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                BankManager = _BankManager_;
            });

            // set up spies
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        describe("has a fetchActiveBanks function that", function () {

            var mockResponse = {
                    data: [
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
                    ]
                };


            beforeEach(function () {
                getActiveBanksDeferred = $q.defer();

                BanksResource.getActiveBanks.and.returnValue(getActiveBanksDeferred.promise);

                BankManager.setActiveBanks(null);

                BankManager.fetchActiveBanks(billingAccountId)
                    .then(resolveHandler, rejectHandler);
            });

            describe("when getting the active banks", function () {

                it("should call BanksResource.getActiveBanks", function () {
                    expect(BanksResource.getActiveBanks).toHaveBeenCalledWith(billingAccountId);
                });

            });

            describe("when the active banks are fetched successfully", function () {

                describe("when there is data in the response", function () {

                    beforeEach(function () {
                        getActiveBanksDeferred.resolve(mockResponse);
                        $rootScope.$digest();
                    });

                    it("should set the active banks", function () {
                        expect(BankManager.getActiveBanks()).toEqual(mockResponse.data);
                    });

                    it("should resolve", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(mockResponse.data);
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