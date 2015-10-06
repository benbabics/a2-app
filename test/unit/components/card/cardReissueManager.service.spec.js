(function () {
    "use strict";

    var $rootScope,
        $q,
        CardManager,
        CardReissueManager,
        CardReissueModel,
        AccountManager,
        AccountModel,
        AddressModel,
        CardModel,
        ShippingCarrierModel,
        ShippingMethodModel,
        resolveHandler,
        rejectHandler;

    describe("A Card Reissue Manager", function () {

        beforeEach(function () {
            module("app.shared");
            module("app.components.account");
            module("app.html");

            //mock dependencies:
            AccountManager = jasmine.createSpyObj("AccountManager", ["fetchAccount"]);

            module(function($provide) {
                $provide.value("AccountManager", AccountManager);
            });

            module("app.components.card");

            inject(function (_$rootScope_, _$q_, _CardReissueManager_, _CardReissueModel_, _AccountModel_,
                             _AddressModel_, _CardManager_, _CardModel_, _ShippingCarrierModel_, _ShippingMethodModel_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                CardManager = _CardManager_;
                CardReissueManager = _CardReissueManager_;
                CardReissueModel = _CardReissueModel_;
                AccountModel = _AccountModel_;
                AddressModel = _AddressModel_;
                CardModel = _CardModel_;
                ShippingCarrierModel = _ShippingCarrierModel_;
                ShippingMethodModel = _ShippingMethodModel_;
            });

            //setup spies:
            spyOn(CardManager, ["fetchCard"]);
            resolveHandler = jasmine.createSpy("resolveHandler");
            rejectHandler = jasmine.createSpy("rejectHandler");
        });

        xdescribe("has an activate function that", function () {

            xit("should set an event listener for 'userLoggedOut' to clear the cached values", function () {
                //TODO - figure out how to test this
            });

            //TODO - figure out how to test this
        });

        describe("has a clearCardReissueDetails function that", function () {

            beforeEach(function () {
                CardReissueManager.setCardReissueDetails(getRandomCardReissueDetails());
            });

            beforeEach(function () {
                CardReissueManager.clearCardReissueDetails();
            });

            it("should set cardReissueDetails to an empty object", function () {
                expect(CardReissueManager.getCardReissueDetails()).toEqual({});

                //TODO - figure out how to test without getCardReissueDetails
            });
        });

        describe("has a getCardReissueDetails function that", function () {

            it("should return the cardReissueDetails passed to setCardReissueDetails", function () {
                var cardReissueDetails = getRandomCardReissueDetails(),
                    result;

                CardReissueManager.setCardReissueDetails(cardReissueDetails);
                result = CardReissueManager.getCardReissueDetails();

                expect(result).toEqual(cardReissueDetails);
            });

            // TODO: figure out how to test this without using setCardReissueDetails
        });

        describe("has a setCardReissueDetails function that", function () {
            var cardReissueDetails;

            beforeEach(function () {
                cardReissueDetails = getRandomCardReissueDetails();

                CardReissueManager.setCardReissueDetails(cardReissueDetails);
            });

            it("should set cardReissueDetails to the given object", function () {
                expect(CardReissueManager.getCardReissueDetails()).toEqual(cardReissueDetails);

                //TODO - figure out how to test without getCardReissueDetails
            });
        });

        describe("has a getOrCreateCardReissueDetails function that", function () {
            var accountId,
                cardId;

            describe("when cardReissueDetails has already been created", function () {
                var cardReissueDetails;

                beforeEach(function () {
                    cardReissueDetails = getRandomCardReissueDetails();

                    CardReissueManager.setCardReissueDetails(cardReissueDetails);
                });

                describe("when the created cardReissueDetails matches the accountId and cardId", function () {

                    beforeEach(function () {
                        accountId = cardReissueDetails.account.accountId;
                        cardId = cardReissueDetails.card.cardId;
                    });

                    beforeEach(function () {
                        CardReissueManager.getOrCreateCardReissueDetails(accountId, cardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should resolve with the existing cardReissueDetails", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(cardReissueDetails);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                    it("should NOT modify cardReissueDetails", function () {
                        expect(CardReissueManager.getCardReissueDetails()).toEqual(cardReissueDetails);
                    });
                });

                describe("when the created cardReissueDetails does NOT match the accountId and cardId", function () {
                    var account,
                        card,
                        fetchAccountPromise,
                        fetchCardPromise;

                    beforeEach(function () {
                        account = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
                        card = TestUtils.getRandomCard(CardModel);

                        accountId = account.accountId;
                        cardId = card.cardId;

                        fetchAccountPromise = $q.when(account);
                        fetchCardPromise = $q.when(card);

                        AccountManager.fetchAccount.and.returnValue(fetchAccountPromise);
                        CardManager.fetchCard.and.returnValue(fetchCardPromise);
                    });

                    beforeEach(function () {
                        CardReissueManager.getOrCreateCardReissueDetails(accountId, cardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should resolve with a new cardReissueDetails with the specified account and card", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(jasmine.objectContaining({
                            account: jasmine.objectContaining({
                                accountId: accountId
                            }),
                            card   : jasmine.objectContaining({
                                cardId: cardId
                            })
                        }));
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                    it("should update cardReissueDetails", function () {
                        expect(CardReissueManager.getCardReissueDetails()).toEqual(jasmine.objectContaining({
                            account: jasmine.objectContaining({
                                accountId: accountId
                            }),
                            card   : jasmine.objectContaining({
                                cardId: cardId
                            })
                        }));
                    });
                });
            });

            describe("when cardReissueDetails has NOT been created", function () {
                var account,
                    card,
                    fetchAccountPromise,
                    fetchCardPromise;

                beforeEach(function () {
                    CardReissueManager.clearCardReissueDetails();

                    account = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
                    card = TestUtils.getRandomCard(CardModel);

                    accountId = account.accountId;
                    cardId = card.cardId;

                    fetchAccountPromise = $q.when(account);
                    fetchCardPromise = $q.when(card);

                    AccountManager.fetchAccount.and.returnValue(fetchAccountPromise);
                    CardManager.fetchCard.and.returnValue(fetchCardPromise);
                });

                beforeEach(function () {
                    CardReissueManager.getOrCreateCardReissueDetails(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should resolve with a new cardReissueDetails with the specified account and card", function () {
                    expect(resolveHandler).toHaveBeenCalledWith(jasmine.objectContaining({
                        account: jasmine.objectContaining({
                            accountId: accountId
                        }),
                        card   : jasmine.objectContaining({
                            cardId: cardId
                        })
                    }));
                    expect(rejectHandler).not.toHaveBeenCalled();
                });

                it("should update cardReissueDetails", function () {
                    expect(CardReissueManager.getCardReissueDetails()).toEqual(jasmine.objectContaining({
                        account: jasmine.objectContaining({
                            accountId: accountId
                        }),
                        card   : jasmine.objectContaining({
                            cardId: cardId
                        })
                    }));
                });
            });
        });

        describe("has an initializeCardReissueDetails function that", function () {
            var accountId,
                cardId,
                fetchAccountDeferred,
                fetchCardDeferred;

            beforeEach(function () {
                fetchAccountDeferred = $q.defer();
                fetchCardDeferred = $q.defer();

                AccountManager.fetchAccount.and.returnValue(fetchAccountDeferred.promise);
                CardManager.fetchCard.and.returnValue(fetchCardDeferred.promise);
            });

            describe("when the account and card are fetched successfully", function () {
                var account,
                    card;

                beforeEach(function () {
                    account = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
                    card = TestUtils.getRandomCard(CardModel);

                    accountId = account.accountId;
                    cardId = card.cardId;

                    fetchAccountDeferred.resolve(account);
                    fetchCardDeferred.resolve(card);
                });

                describe("when the default card shipping address is a PO Box", function () {
                    var result;

                    beforeEach(function () {
                        account.defaultCardShippingAddress.addressLine1 = "PO Box " + TestUtils.getRandomInteger(1, 1000);
                    });

                    beforeEach(function () {
                        CardReissueManager.initializeCardReissueDetails(accountId, cardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    beforeEach(function () {
                        result = CardReissueManager.getCardReissueDetails();
                    });

                    it("should resolve with the new cardReissueDetails object", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(result);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                    it("should set the expected account on cardReissueDetails", function () {
                        expect(result.account).toEqual(account);
                    });

                    it("should set the expected card on cardReissueDetails", function () {
                        expect(result.card).toEqual(card);
                    });

                    it("should set the expected shippingAddress on cardReissueDetails", function () {
                        expect(result.shippingAddress).toEqual(account.defaultCardShippingAddress);
                    });

                    it("should set the expected selectedShippingMethod on cardReissueDetails", function () {
                        expect(result.selectedShippingMethod).toEqual(account.regularCardShippingMethod);
                    });

                    it("should set the expected shippingMethods on cardReissueDetails", function () {
                        expect(result.shippingMethods).toEqual([account.regularCardShippingMethod]);
                    });

                    it("should set the expected reissueReason on cardReissueDetails", function () {
                        expect(result.reissueReason).toEqual("");
                    });
                });

                describe("when the default card shipping address is NOT a PO Box", function () {
                    var result;

                    beforeEach(function () {
                        account.defaultCardShippingAddress.addressLine1 = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                    });

                    beforeEach(function () {
                        CardReissueManager.initializeCardReissueDetails(accountId, cardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    beforeEach(function () {
                        result = CardReissueManager.getCardReissueDetails();
                    });

                    it("should resolve with the new cardReissueDetails object", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(result);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                    it("should set the expected account on cardReissueDetails", function () {
                        expect(result.account).toEqual(account);
                    });

                    it("should set the expected card on cardReissueDetails", function () {
                        expect(result.card).toEqual(card);
                    });

                    it("should set the expected shippingAddress on cardReissueDetails", function () {
                        expect(result.shippingAddress).toEqual(account.defaultCardShippingAddress);
                    });

                    it("should set the expected selectedShippingMethod on cardReissueDetails", function () {
                        expect(result.selectedShippingMethod).toEqual(account.cardShippingCarrier.getDefaultShippingMethod());
                    });

                    it("should move the regular shipping method to the front of the shipping methods array", function () {
                        var expectedArray = account.cardShippingCarrier.shippingMethods.slice();
                        _.remove(expectedArray, {id: account.regularCardShippingMethod.id});
                        expectedArray.unshift(account.regularCardShippingMethod);

                        expect(result.shippingMethods).toEqual(expectedArray);
                    });

                    it("should set the expected reissueReason on cardReissueDetails", function () {
                        expect(result.reissueReason).toEqual("");
                    });
                });
            });

            describe("when the account is NOT fetched successfully", function () {
                var error;

                beforeEach(function () {
                    error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    fetchAccountDeferred.reject(error);
                    fetchCardDeferred.resolve();
                });

                beforeEach(function () {
                    CardReissueManager.initializeCardReissueDetails(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should reject with the expected error", function () {
                    expect(rejectHandler).toHaveBeenCalledWith("Failed to initialize card reissue details: " + error);
                    expect(resolveHandler).not.toHaveBeenCalled();
                });
            });

            describe("when the card is NOT fetched successfully", function () {
                var error;

                beforeEach(function () {
                    error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    fetchAccountDeferred.resolve();
                    fetchCardDeferred.reject(error);
                });

                beforeEach(function () {
                    CardReissueManager.initializeCardReissueDetails(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should reject with the expected error", function () {
                    expect(rejectHandler).toHaveBeenCalledWith("Failed to initialize card reissue details: " + error);
                    expect(resolveHandler).not.toHaveBeenCalled();
                });
            });

            describe("when the account and card are NOT fetched successfully", function () {
                var error;

                beforeEach(function () {
                    error = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    fetchAccountDeferred.reject(error);
                    fetchCardDeferred.reject(error);
                });

                beforeEach(function () {
                    CardReissueManager.initializeCardReissueDetails(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should reject with the expected error", function () {
                    expect(rejectHandler).toHaveBeenCalledWith("Failed to initialize card reissue details: " + error);
                    expect(resolveHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function () {
                CardReissueManager.setCardReissueDetails(getRandomCardReissueDetails());

                $rootScope.$broadcast("userLoggedOut");
                $rootScope.$digest();
            });

            it("should clear cardReissueDetails", function () {
                expect(CardReissueManager.getCardReissueDetails()).toEqual({});
            });
        });
    });

    function getRandomCardReissueDetails() {
        return TestUtils.getRandomCardReissueDetails(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);
    }
})();