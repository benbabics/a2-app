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

        describe("has a clearCardReissue function that", function () {

            beforeEach(function () {
                CardReissueManager.setCardReissue(getRandomCardReissue());
            });

            beforeEach(function () {
                CardReissueManager.clearCardReissue();
            });

            it("should set cardReissue to an empty object", function () {
                expect(CardReissueManager.getCardReissue()).toEqual({});

                //TODO - figure out how to test without getCardReissue
            });
        });

        describe("has a getCardReissue function that", function () {

            it("should return the cardReissue passed to setCardReissue", function () {
                var cardReissue = getRandomCardReissue(),
                    result;

                CardReissueManager.setCardReissue(cardReissue);
                result = CardReissueManager.getCardReissue();

                expect(result).toEqual(cardReissue);
            });

            // TODO: figure out how to test this without using setCardReissue
        });

        describe("has a setCardReissue function that", function () {
            var cardReissue;

            beforeEach(function () {
                cardReissue = getRandomCardReissue();

                CardReissueManager.setCardReissue(cardReissue);
            });

            it("should set cardReissue to the given object", function () {
                expect(CardReissueManager.getCardReissue()).toEqual(cardReissue);

                //TODO - figure out how to test without getCardReissue
            });
        });

        describe("has a getOrCreateCardReissue function that", function () {
            var accountId,
                cardId;

            describe("when cardReissue has already been created", function () {
                var cardReissue;

                beforeEach(function () {
                    cardReissue = getRandomCardReissue();

                    CardReissueManager.setCardReissue(cardReissue);
                });

                describe("when the created cardReissue matches the accountId and cardId", function () {

                    beforeEach(function () {
                        accountId = cardReissue.account.accountId;
                        cardId = cardReissue.card.cardId;
                    });

                    beforeEach(function () {
                        CardReissueManager.getOrCreateCardReissue(accountId, cardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should resolve with the existing cardReissue", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(cardReissue);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                    it("should NOT modify cardReissue", function () {
                        expect(CardReissueManager.getCardReissue()).toEqual(cardReissue);
                    });
                });

                describe("when the created cardReissue does NOT match the accountId and cardId", function () {
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
                        CardReissueManager.getOrCreateCardReissue(accountId, cardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    it("should resolve with a new cardReissue with the specified account and card", function () {
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

                    it("should update cardReissue", function () {
                        expect(CardReissueManager.getCardReissue()).toEqual(jasmine.objectContaining({
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

            describe("when cardReissue has NOT been created", function () {
                var account,
                    card,
                    fetchAccountPromise,
                    fetchCardPromise;

                beforeEach(function () {
                    CardReissueManager.clearCardReissue();

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
                    CardReissueManager.getOrCreateCardReissue(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should resolve with a new cardReissue with the specified account and card", function () {
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

                it("should update cardReissue", function () {
                    expect(CardReissueManager.getCardReissue()).toEqual(jasmine.objectContaining({
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

        describe("has an initializeCardReissue function that", function () {
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
                        CardReissueManager.initializeCardReissue(accountId, cardId)
                            .then(resolveHandler)
                            .catch(rejectHandler);

                        $rootScope.$digest();
                    });

                    beforeEach(function () {
                        result = CardReissueManager.getCardReissue();
                    });

                    it("should resolve with the new cardReissue object", function () {
                        expect(resolveHandler).toHaveBeenCalledWith(result);
                        expect(rejectHandler).not.toHaveBeenCalled();
                    });

                    it("should set the expected account on cardReissue", function () {
                        expect(result.account).toEqual(account);
                    });

                    it("should set the expected card on cardReissue", function () {
                        expect(result.card).toEqual(card);
                    });

                    it("should set the expected shippingAddress on cardReissue", function () {
                        expect(result.shippingAddress).toEqual(account.defaultCardShippingAddress);
                    });

                    it("should set the expected selectedShippingMethod on cardReissue", function () {
                        expect(result.selectedShippingMethod).toEqual(account.regularCardShippingMethod);
                    });

                    it("should set the expected shippingMethods on cardReissue", function () {
                        expect(result.shippingMethods).toEqual([account.regularCardShippingMethod]);
                    });

                    it("should set the expected reissueReason on cardReissue", function () {
                        expect(result.reissueReason).toEqual("");
                    });
                });

                describe("when the default card shipping address is NOT a PO Box", function () {
                    var result;

                    beforeEach(function () {
                        account.defaultCardShippingAddress.addressLine1 = TestUtils.getRandomStringThatIsAlphaNumeric(20);
                    });

                    describe("when the account has a default shipping carrier", function () {

                        beforeEach(function () {
                            account.cardShippingCarrier.default = true;

                            CardReissueManager.initializeCardReissue(accountId, cardId)
                                .then(resolveHandler)
                                .catch(rejectHandler);

                            $rootScope.$digest();
                        });

                        beforeEach(function () {
                            result = CardReissueManager.getCardReissue();
                        });

                        it("should resolve with the new cardReissue object", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(result);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });

                        it("should set the expected account on cardReissue", function () {
                            expect(result.account).toEqual(account);
                        });

                        it("should set the expected card on cardReissue", function () {
                            expect(result.card).toEqual(card);
                        });

                        it("should set the expected shippingAddress on cardReissue", function () {
                            expect(result.shippingAddress).toEqual(account.defaultCardShippingAddress);
                        });

                        it("should set the expected selectedShippingMethod on cardReissue", function () {
                            expect(result.selectedShippingMethod).toEqual(account.cardShippingCarrier.getDefaultShippingMethod());
                        });

                        it("should set the expected shippingMethods on cardReissue", function () {
                            var expectedShippingMethods = [account.regularCardShippingMethod].concat(account.cardShippingCarrier.shippingMethods);

                            expect(result.shippingMethods).toEqual(expectedShippingMethods);
                        });

                        it("should set the expected reissueReason on cardReissue", function () {
                            expect(result.reissueReason).toEqual("");
                        });
                    });

                    describe("when the account does NOT have a default shipping carrier", function () {

                        beforeEach(function () {
                            account.cardShippingCarrier.default = false;

                            CardReissueManager.initializeCardReissue(accountId, cardId)
                                .then(resolveHandler)
                                .catch(rejectHandler);

                            $rootScope.$digest();
                        });

                        beforeEach(function () {
                            result = CardReissueManager.getCardReissue();
                        });

                        it("should resolve with the new cardReissue object", function () {
                            expect(resolveHandler).toHaveBeenCalledWith(result);
                            expect(rejectHandler).not.toHaveBeenCalled();
                        });

                        it("should set the expected account on cardReissue", function () {
                            expect(result.account).toEqual(account);
                        });

                        it("should set the expected card on cardReissue", function () {
                            expect(result.card).toEqual(card);
                        });

                        it("should set the expected shippingAddress on cardReissue", function () {
                            expect(result.shippingAddress).toEqual(account.defaultCardShippingAddress);
                        });

                        it("should set the expected selectedShippingMethod on cardReissue", function () {
                            expect(result.selectedShippingMethod).toEqual(account.cardShippingCarrier.getDefaultShippingMethod());
                        });

                        it("should set the expected shippingMethods on cardReissue", function () {
                            expect(result.shippingMethods).toEqual(account.cardShippingCarrier.shippingMethods);
                        });

                        it("should set the expected reissueReason on cardReissue", function () {
                            expect(result.reissueReason).toEqual("");
                        });
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
                    CardReissueManager.initializeCardReissue(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should reject with the expected error", function () {
                    expect(rejectHandler).toHaveBeenCalledWith("Failed to initialize card reissue: " + error);
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
                    CardReissueManager.initializeCardReissue(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should reject with the expected error", function () {
                    expect(rejectHandler).toHaveBeenCalledWith("Failed to initialize card reissue: " + error);
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
                    CardReissueManager.initializeCardReissue(accountId, cardId)
                        .then(resolveHandler)
                        .catch(rejectHandler);

                    $rootScope.$digest();
                });

                it("should reject with the expected error", function () {
                    expect(rejectHandler).toHaveBeenCalledWith("Failed to initialize card reissue: " + error);
                    expect(resolveHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe("has a userLoggedOut event handler function that", function () {

            beforeEach(function () {
                CardReissueManager.setCardReissue(getRandomCardReissue());

                $rootScope.$broadcast("userLoggedOut");
                $rootScope.$digest();
            });

            it("should clear cardReissue", function () {
                expect(CardReissueManager.getCardReissue()).toEqual({});
            });
        });
    });

    function getRandomCardReissue() {
        return TestUtils.getRandomCardReissue(CardReissueModel, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel);
    }
})();