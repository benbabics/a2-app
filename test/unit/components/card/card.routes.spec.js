(function () {
    "use strict";

    describe("A Card Module Route Config", function () {

        var $injector,
            $q,
            $rootScope,
            $state,
            mockCard,
            mockUser,
            mockAccount,
            AccountManager,
            CardManager,
            CardReissueModel,
            UserManager,
            mockGlobals = {
                "CARD_CHANGE_STATUS": {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "statuses"         : {
                            "activate" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "terminate": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "card"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "confirmationPopup": {
                            "contentMessages": {
                                "active"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                "terminated": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            },
                            "yesButton"      : TestUtils.getRandomStringThatIsAlphaNumeric(5),
                            "noButton"       : TestUtils.getRandomStringThatIsAlphaNumeric(5)
                        }
                    }
                },
                "CARD_CHANGE_STATUS_CONFIRMATION": {
                    "CONFIG": {
                        "ANALYTICS": {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title"               : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "confirmationMessages": {
                            "active"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "terminated": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "cardNumber"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "standardEmbossing"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "optionalEmbossing"   : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "status"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "cards"               : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                },
                "CARD_DETAIL": {
                    "CONFIG": {
                        "ANALYTICS"         : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "cardNumber"        : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "standardEmbossing" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "optionalEmbossing" : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "status"            : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "changeStatusButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "reissueCardButton" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                },
                CARD_LIST: {
                    "CONFIG"        : {
                        "ANALYTICS"         : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "events": {
                                "searchSubmitted": [
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10),
                                    TestUtils.getRandomStringThatIsAlphaNumeric(10)
                                ]
                            }
                        },
                        "title"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "reloadDistance": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    },
                    "SEARCH_OPTIONS": {
                        "PAGE_SIZE": TestUtils.getRandomInteger(1, 100),
                        "STATUSES": TestUtils.getRandomStringThatIsAlphaNumeric(50)
                    }
                },
                "CARD_REISSUE": {
                    "CONFIG": {
                        "ANALYTICS"         : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "shippingAddress"    : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "shippingMethod"     : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "reissueReason"      : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "selectReissueReason": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "submitButton"       : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "instructionalText"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "poBoxText"          : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "confirmationPopup": {
                            "content"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "yesButton": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                            "noButton" : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                },
                "CARD_REISSUE_CONFIRMATION": {
                    "CONFIG": {
                        "ANALYTICS"         : {
                            "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        },
                        "title"              : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "confirmationMessage": TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "cardNumber"         : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "standardEmbossing"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "optionalEmbossing"  : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "status"             : TestUtils.getRandomStringThatIsAlphaNumeric(10),
                        "cards"              : TestUtils.getRandomStringThatIsAlphaNumeric(10)
                    }
                },
                "CARD_REISSUE_INPUTS": {
                    "REISSUE_REASON": {
                        "CONFIG": {
                            "ANALYTICS"         : {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            },
                            "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    },
                    "SHIPPING_METHOD": {
                        "CONFIG": {
                            "ANALYTICS"         : {
                                "pageName": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                            },
                            "title": TestUtils.getRandomStringThatIsAlphaNumeric(10)
                        }
                    }
                }
            };

        beforeAll(function () {
            this.includeAppDependencies = false;
            this.includeHtml = true;
        });

        beforeEach(function () {

            module("app.components.card");
            module("app.components.account");
            module("app.components.user");
            module("app.components.brand");

            // mock dependencies
            CardManager = jasmine.createSpyObj("CardManager", ["fetchCard"]);
            UserManager = jasmine.createSpyObj("UserManager", ["getUser"]);
            AccountManager = jasmine.createSpyObj("AccountManager", ["fetchAccount"]);

            module(function ($provide, sharedGlobals) {
                $provide.value("globals", angular.extend({}, sharedGlobals, mockGlobals));
                $provide.value("CardManager", CardManager);
                $provide.value("UserManager", UserManager);
                $provide.value("AccountManager", AccountManager);
            });

            inject(function (_$injector_, _$q_, _$rootScope_, _$state_,
                             _CardReissueModel_, AccountModel, AddressModel, CardModel, ShippingCarrierModel, ShippingMethodModel,
                             UserModel, UserAccountModel) {
                $injector = _$injector_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                CardReissueModel = _CardReissueModel_;

                mockCard = TestUtils.getRandomCard(CardModel);
                mockUser = TestUtils.getRandomUser(UserModel, UserAccountModel);
                mockAccount = TestUtils.getRandomAccount(AccountModel, AddressModel, ShippingCarrierModel, ShippingMethodModel);
            });

            //setup spies:
            UserManager.getUser.and.returnValue(mockUser);
        });

        describe("has a card state that", function () {
            var state,
                stateName = "card";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/card");
            });

            it("should define a view on the root container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["@"]).toBeDefined();
            });
        });

        describe("has a card.list state that", function () {
            var state,
                stateName = "card.list";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should be cached", function () {
                expect(state.cache).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/list");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName)).toEqual("#/card/list");
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    $state.go(stateName);
                    $rootScope.$digest();
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should call this.AnalyticsUtil.trackView", function () {
                    expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.CARD_LIST.CONFIG.ANALYTICS.pageName);
                });

            });

        });

        describe("has a card.detail state that", function () {
            var state,
                stateName = "card.detail";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should accept isReissued param", function () {
                expect(state.params.isReissued).toBeDefined();
                expect(state.params.isReissued).toBeFalsy();
            })

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/detail/:cardId");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {cardId: "1234"})).toEqual("#/card/detail/1234");
            });

            describe("when navigated to", function () {

                var fetchCardDeferred,
                    mockCardId = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                beforeEach(function () {
                    fetchCardDeferred = $q.defer();
                    CardManager.fetchCard.and.returnValue(fetchCardDeferred.promise);

                    $state.go(stateName, {cardId: mockCardId});

                    fetchCardDeferred.resolve(mockCard);
                    $rootScope.$digest();
                });

                it("should call CardManager.fetchCard", function () {
                    expect(CardManager.fetchCard).toHaveBeenCalledWith(mockCardId);
                });

                it("should transition successfully", function () {
                    expect($state.current.name).toBe(stateName);
                });

                it("should resolve the card", () => {
                    $injector.invoke( $state.current.resolve.card )
                        .then( card => expect( card ).toEqual( mockCard ) );
                });

                it("should call this.AnalyticsUtil.trackView", function () {
                    expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.CARD_DETAIL.CONFIG.ANALYTICS.pageName);
                });

            });

        });

        describe("has a card.reissue state that", function () {
            var state,
                stateName = "card.reissue";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be defined", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should NOT be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should be abstract", function () {
                expect(state.abstract).toBeTruthy();
            });

            it("should have the expected URL", function () {
                expect(state.url).toEqual("/reissue/:cardId");
            });

            it("should define a view in the card view container", function () {
                expect(state.views).toBeDefined();
                expect(state.views["view@card"]).toBeDefined();
            });

            describe("when a child state is navigated to", function () {
                var childStateName = "card.reissue.form";

                beforeEach(function () {
                    CardManager.fetchCard.and.returnValue($q.when(mockCard));
                    AccountManager.fetchAccount.and.returnValue($q.when(mockAccount));
                });

                beforeEach(function () {
                    $state.go(childStateName, {cardId: mockCard.cardId});

                    $rootScope.$digest();
                });

                it("should resolve cardReissueDetails to a new CardReissueModel", function () {
                    expect($injector.invoke($state.$current.parent.resolve.cardReissueDetails)).toEqual(new CardReissueModel());
                });

                it("should resolve account to the expected account for the view", function () {
                    $injector.invoke($state.$current.parent.views["view@card"].resolve.account)
                        .then(function (account) {
                            expect(account).toEqual(mockAccount);
                        });
                });

                it("should resolve card to the expected card for the view", function () {
                    $injector.invoke($state.$current.parent.views["view@card"].resolve.card)
                        .then(function (card) {
                            expect(card).toEqual(mockCard);
                        });
                });
            });
        });

        describe("has a card.reissue.form state that", function () {
            var state,
                stateName = "card.reissue.form";

            beforeEach(function () {
                state = $state.get(stateName);
            });

            it("should be valid", function () {
                expect(state).toBeDefined();
                expect(state).not.toBeNull();
            });

            it("should not be abstract", function () {
                expect(state.abstract).toBeFalsy();
            });

            it("should not be cached", function () {
                expect(state.cache).toBeFalsy();
            });

            it("should use its parent's URL", function () {
                expect(state.url).toEqual("");
            });

            it("should respond to the URL", function () {
                expect($state.href(stateName, {cardId: mockCard.cardId})).toEqual("#/card/reissue/" + mockCard.cardId);
            });

            describe("when navigated to", function () {

                beforeEach(function () {
                    CardManager.fetchCard.and.returnValue($q.when(mockCard));
                    AccountManager.fetchAccount.and.returnValue($q.when(mockAccount));
                });

                beforeEach(function () {
                    $state.go(stateName, {cardId: mockCard.cardId});

                    $rootScope.$digest();
                });

                it("should call this.AnalyticsUtil.trackView", function () {
                    expect(this.AnalyticsUtil.trackView).toHaveBeenCalledWith(mockGlobals.CARD_REISSUE.CONFIG.ANALYTICS.pageName);
                });
            });
        });
    });
})();