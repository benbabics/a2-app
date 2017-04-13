(function () {
    "use strict";

    var $rootScope,
        $scope,
        $q,
        $timeout,
        _,
        filter,
        ElementUtil,
        CardManager,
        UserManager,
        UserModel,
        UserAccountModel,
        CardModel,
        Logger,
        ctrl,
        resolveHandler,
        rejectHandler,
        mockUser,
        globals,
        config,
        self,
        fetchCardsDeferred,
        cardsActive,
        cardsSuspended,
        cardsTerminated;

    describe("A Card List Controller", () => {

        beforeEach(() => {
            self = this;

            // mock deps
            CardManager = jasmine.createSpyObj( "CardManager", [ "fetchCards", "getCards" ] );
            UserManager   = jasmine.createSpyObj( "UserManager", [ "getUser" ] );
            ElementUtil   = jasmine.createSpyObj( "ElementUtil", [ "getFocusedView", "resetInfiniteList" ] );

            // stub the routing and template loading
            module( "app.shared" );
            module( "app.components", $provide => {} );

            // stub the routing and template loading
            module( $urlRouterProvider => $urlRouterProvider.deferIntercept() );

            module($provide => {
                $provide.value( "$ionicTemplateCache", () => {} );
            });

            inject((___, _$q_, _$rootScope_, _$timeout_, $controller, _globals_, _UserModel_, _UserAccountModel_, _CardModel_, _filterFilter_, _Logger_) => {
                _                = ___;
                $q               = _$q_;
                $timeout         = _$timeout_;
                $rootScope       = _$rootScope_;
                globals          = _globals_;
                config           = globals.CARD_LIST.CONFIG;
                UserModel        = _UserModel_;
                UserAccountModel = _UserAccountModel_;
                CardModel        = _CardModel_;
                filter           = _filterFilter_;
                Logger           = _Logger_;

                // create a scope object for us to use.
                $scope = $rootScope.$new();

                ctrl = $controller("CardListController", {
                    _:             _,
                    $scope:        $scope,
                    globals:       globals,
                    UserManager:   UserManager,
                    CardManager:   CardManager,
                    Logger:        Logger
                });
            });

            // setup spies
            resolveHandler = jasmine.createSpy( "resolveHandler" );
            rejectHandler  = jasmine.createSpy( "rejectHandler" );

            // setup mocks
            mockUser = TestUtils.getRandomUser( UserModel, UserAccountModel );
            UserManager.getUser.and.returnValue( mockUser );

            fetchCardsDeferred = $q.defer();
            CardManager.fetchCards.and.returnValue( fetchCardsDeferred.promise );

            // mock data
            cardsActive = populateCards([
                { embossedCardNumber: "0001", embossingValue2: "abc-Value2-Active", embossingValue1: "abc-Value1-Active", status: "ACTIVE" },
                { embossedCardNumber: "0002", embossingValue2: "def-Value2-Active", embossingValue1: "def-Value1-Active", status: "ACTIVE" },
                { embossedCardNumber: "0003", embossingValue2: "xyz-Value2-Active", embossingValue1: "xyz-Value1-Active", status: "ACTIVE" }
            ]);

            cardsSuspended = populateCards([
                { embossedCardNumber: "0001", embossingValue2: "abc-Value2-Suspended", embossingValue1: "abc-Value1-Suspended", status: "SUSPENDED" },
                { embossedCardNumber: "0002", embossingValue2: "def-Value2-Suspended", embossingValue1: "def-Value1-Suspended", status: "SUSPENDED" },
                { embossedCardNumber: "0003", embossingValue2: "xyz-Value2-Suspended", embossingValue1: "xyz-Value1-Suspended", status: "SUSPENDED" }
            ]);

            cardsTerminated = populateCards([
                { embossedCardNumber: "0001", embossingValue2: "abc-Value2-Terminated", embossingValue1: "abc-Value1-Terminated", status: "TERMINATED" },
                { embossedCardNumber: "0002", embossingValue2: "def-Value2-Terminated", embossingValue1: "def-Value1-Terminated", status: "TERMINATED" },
                { embossedCardNumber: "0003", embossingValue2: "xyz-Value2-Terminated", embossingValue1: "xyz-Value1-Terminated", status: "TERMINATED" }
            ]);
        });

        afterEach(() => {
            $rootScope =
            $scope =
            $q =
            $timeout =
            filter =
            ElementUtil =
            CardManager =
            UserManager =
            UserModel =
            UserAccountModel =
            CardModel =
            ctrl =
            resolveHandler =
            rejectHandler =
            mockUser =
            globals =
            config =
            self =
            fetchCardsDeferred =
            cardsActive =
            cardsSuspended =
            cardsTerminated = null;
        });

        describe("has an activate function that", () => {
            it("should have infiniteListController methods on $scope", () => {
                expect( $scope.loadNextPage ).toBeDefined();
                expect( $scope.resetSearchResults ).toBeDefined();
            });

            it("should have infiniteScrollService defined on $scope", () => {
                expect( $scope.infiniteScrollService ).toBeDefined();
            });

            it("should have vm.cards equal model", () => {
                expect( ctrl.cards ).toEqual( $scope.infiniteScrollService.model );
            });

            it("should have vm.cards divided into 'active', 'suspended' and 'terminated' collections", () => {
                expect( ctrl.cards.active ).toEqual( [] );
                expect( ctrl.cards.suspended ).toEqual( [] );
                expect( ctrl.cards.terminated ).toEqual( [] );
            });
        });

        describe("has a handleMakeRequest function that", () => {
            beforeEach(() => {
                $scope.loadNextPage().then( resolveHandler );
                fetchCardsDeferred.resolve([ ...cardsActive, ...cardsSuspended, ...cardsTerminated ]);
                $rootScope.$digest();
            });

            it("should send a message to CardManager.fetchCards with the expected params", () => {
                // Todo: update once service makes these optional
                expect( CardManager.fetchCards ).toHaveBeenCalledWith( mockUser.billingCompany.accountId );
            });

            it("should call resolveHandler when resolved", () => {
                expect( resolveHandler ).toHaveBeenCalled();
            });
        });

        describe("has divided cards into 'active', 'suspended' and 'terminated' collections", () => {
            beforeEach(() => {
                fetchCardsDeferred.resolve([ ...cardsActive, ...cardsSuspended, ...cardsTerminated ]);
                CardManager.getCards.and.returnValue([ ...cardsActive, ...cardsSuspended, ...cardsTerminated ]);
                $scope.loadNextPage();
                $rootScope.$digest();
                $timeout.flush();
            });

            it("should have populated the vm.cards.active collection", () => {
                expect( ctrl.cards.active.length ).toEqual( cardsActive.length );
                expect( getCardsDetails(ctrl.cards.active) ).toEqual( getCardsDetails(cardsActive) );
            });

            it("should have populated the vm.cards.suspended collection", () => {
                expect( ctrl.cards.suspended.length ).toEqual( cardsSuspended.length );
                expect( getCardsDetails(ctrl.cards.suspended) ).toEqual( getCardsDetails(cardsSuspended) );
            });

            it("should have populated the vm.cards.terminated collection", () => {
                expect( ctrl.cards.terminated.length ).toEqual( cardsTerminated.length );
                expect( getCardsDetails(ctrl.cards.terminated) ).toEqual( getCardsDetails(cardsTerminated) );
            });
        });

        describe("has cardsComparator function that", () => {
            it("should filter search term by embossedCardNumber", () => {
                // Embossed Card Number: 0001, 0002, 0003
                let results = filter( cardsActive, '0', ctrl.cardsComparator );
                expect( getCardsDetails(results) ).toEqual( getCardsDetails(cardsActive) );

                results = filter( cardsActive, '01', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsActive[0]) );

                results = filter( cardsSuspended, '002', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsSuspended[1]) );

                results = filter( cardsTerminated, '0003', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsTerminated[2]) );

                results = filter( cardsActive, ' 000 3 ', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsActive[2]) );

                results = filter( cardsActive, '****0003', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsActive[2]) );

                results = filter( cardsActive, '99', ctrl.cardsComparator );
                expect( results ).toEqual( [] );
            });

            it("should filter search term by embossingValue2", () => {
                // Embossing Value 2: abc-Value2-Active, def-Value2-Active, xyz-Value2-Active
                let results = filter( cardsActive, 'Value2-ACTIVE', ctrl.cardsComparator );
                expect( getCardsDetails(results) ).toEqual( getCardsDetails(cardsActive) );

                results = filter( cardsActive, 'abc-Value2', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsActive[0]) );

                results = filter( cardsSuspended, 'def-Value2', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsSuspended[1]) );

                results = filter( cardsTerminated, 'xyz-Value2', ctrl.cardsComparator );

                results = filter( cardsActive, 'xxx-Value2', ctrl.cardsComparator );
                expect( results ).toEqual( [] );
            });

            it("should filter search term by embossingValue1", () => {
                // Embossing Value 1: abc-Value1-Active, def-Value1-Active, xyz-Value1-Active
                let results = filter( cardsActive, 'Value1-ACTIVE', ctrl.cardsComparator );
                expect( getCardsDetails(results) ).toEqual( getCardsDetails(cardsActive) );

                results = filter( cardsActive, 'abc-Value1', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsActive[0]) );

                results = filter( cardsSuspended, 'def-Value1', ctrl.cardsComparator );
                expect( getCardDetails(results[0]) ).toEqual( getCardDetails(cardsSuspended[1]) );

                results = filter( cardsTerminated, 'xyz-Value1', ctrl.cardsComparator );

                results = filter( cardsActive, 'xxx-Value1', ctrl.cardsComparator );
                expect( results ).toEqual( [] );
            });
        });
    });


    // helper methods
    function populateCards(attrs = []) {
        return attrs.map( populateCard );
    }
    function populateCard(data = {}) {
        let model = new CardModel();
        model.set( data );
        return model;
    }

    function getCardsDetails(cards = []) {
        return _.map( cards, getCardDetails );
    }
    function getCardDetails(card = {}) {
        return _.pick( card, 'embossedCardNumber', 'embossingValue2', 'embossingValue1' );
    }
}());
