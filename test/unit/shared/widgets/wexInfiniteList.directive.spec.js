(function () {
    "use strict";

    var $rootScope,
        $compile,
        $q,
        wexInfiniteList,
        mockPageLoadedCallback,
        mockReloadCallback,
        DEFAULT_RELOAD_DISTANCE = "20%";

    describe("A WEX Infinite List Directive", function () {

        beforeEach(function () {
            inject(function (_$rootScope_, _$compile_, _$q_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $q = _$q_;
            });

            mockPageLoadedCallback = jasmine.createSpy("mockPageLoadedCallback");
            mockReloadCallback = jasmine.createSpy("mockReloadCallback");

            wexInfiniteList = createWexInfiniteList({
                onPageLoaded: mockPageLoadedCallback,
                onReload    : mockReloadCallback
            });
        });

        afterEach(function() {
            wexInfiniteList.parentElement.remove();
        });

        it("should initialize allDataLoaded to false", function () {
            expect(wexInfiniteList.scope.allDataLoaded).toBeFalsy();
        });

        describe("when a reload distance is specified", function () {
            var reloadDistance;

            beforeEach(function () {
                reloadDistance = String(TestUtils.getRandomInteger(1, 100));

                wexInfiniteList = createWexInfiniteList({
                    onPageLoaded: mockPageLoadedCallback,
                    onReload      : mockReloadCallback,
                    reloadDistance: reloadDistance
                });
            });

            afterEach(function() {
                wexInfiniteList.parentElement.remove();
            });

            it("should initialize reloadDistance to the given value", function () {
                expect(wexInfiniteList.scope.reloadDistance).toEqual(reloadDistance);
            });
        });

        describe("when a reload distance is NOT specified", function () {

            beforeEach(function () {
                wexInfiniteList = createWexInfiniteList({
                    onPageLoaded: mockPageLoadedCallback,
                    onReload    : mockReloadCallback
                });
            });

            afterEach(function() {
                wexInfiniteList.parentElement.remove();
            });

            it("should initialize reloadDistance to the default value", function () {
                expect(wexInfiniteList.scope.reloadDistance).toEqual(DEFAULT_RELOAD_DISTANCE);
            });
        });

        describe("when a custom loading complete flag is specified", function () {
            var loadingComplete;

            beforeEach(function () {
                loadingComplete = TestUtils.getRandomBoolean();

                wexInfiniteList = createWexInfiniteList({
                    onPageLoaded: mockPageLoadedCallback,
                    onReload    : mockReloadCallback,
                    loadingComplete: loadingComplete
                });
            });

            afterEach(function() {
                wexInfiniteList.parentElement.remove();
            });

            it("should initialize loadingComplete to a getter for the given value", function () {
                expect(wexInfiniteList.scope.loadingComplete).toBeDefined();
                expect(wexInfiniteList.scope.loadingComplete()).toEqual(loadingComplete);
            });
        });

        describe("when a custom loading complete flag is NOT specified", function () {

            beforeEach(function () {
                wexInfiniteList = createWexInfiniteList({
                    onPageLoaded: mockPageLoadedCallback,
                    onReload    : mockReloadCallback
                });
            });

            afterEach(function() {
                wexInfiniteList.parentElement.remove();
            });

            it("should initialize loadingComplete to a getter for allDataLoaded", function () {
                expect(wexInfiniteList.scope.loadingComplete).toBeDefined();
                expect(wexInfiniteList.scope.loadingComplete()).toEqual(wexInfiniteList.scope.allDataLoaded);
            });
        });

        describe("has a loadMore function that", function () {

            describe("when custom loading complete flag is specified", function () {

                describe("when it is true", function () {

                    beforeEach(function () {
                        wexInfiniteList = createWexInfiniteList({
                            onPageLoaded: mockPageLoadedCallback,
                            onReload    : mockReloadCallback,
                            loadingComplete: true
                        });

                        spyOn(wexInfiniteList.scope, "$broadcast");
                    });

                    beforeEach(function () {
                        wexInfiniteList.scope.loadMore();

                        $rootScope.$digest();
                    });

                    afterEach(function() {
                        wexInfiniteList.parentElement.remove();
                    });

                    it("should NOT call onReload", function () {
                        expect(mockReloadCallback).not.toHaveBeenCalled();
                    });

                    it("should NOT change the value of allDataLoaded", function () {
                        expect(wexInfiniteList.scope.allDataLoaded).toBeTruthy();
                    });

                    it("should call onPageLoaded", function () {
                        expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                    });

                    it("should broadcast scroll.infiniteScrollComplete", function () {
                        expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                    });
                });

                describe("when it is false", function () {
                    var reloadCallbackDeferred;

                    beforeEach(function () {
                        wexInfiniteList = createWexInfiniteList({
                            onPageLoaded: mockPageLoadedCallback,
                            onReload       : mockReloadCallback,
                            loadingComplete: false
                        });

                        spyOn(wexInfiniteList.scope, "$broadcast");
                        reloadCallbackDeferred = $q.defer();
                        mockReloadCallback.and.returnValue(reloadCallbackDeferred.promise);
                    });

                    beforeEach(function () {
                        wexInfiniteList.scope.loadMore();

                        $rootScope.$digest();
                    });

                    afterEach(function() {
                        wexInfiniteList.parentElement.remove();
                    });

                    it("should call onReload", function () {
                        expect(mockReloadCallback).toHaveBeenCalledWith();
                    });

                    describe("when the reload callback promise resolves with true", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.resolve(true);

                            $rootScope.$digest();
                        });

                        it("should set allDataLoaded to true", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeTruthy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });

                    describe("when the reload callback promise resolves with false", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.resolve(false);

                            $rootScope.$digest();
                        });

                        it("should set allDataLoaded to false", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeFalsy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });

                    describe("when the reload callback promise resolves with no value", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.resolve();

                            $rootScope.$digest();
                        });

                        it("should set allDataLoaded to false", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeFalsy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });

                    describe("when the reload callback promise rejects", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.reject();

                            $rootScope.$digest();
                        });

                        it("should NOT change the value of allDataLoaded", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeFalsy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });
                });
            });

            describe("when custom loading complete flag is NOT specified", function () {

                beforeEach(function () {
                    wexInfiniteList = createWexInfiniteList({
                        onPageLoaded: mockPageLoadedCallback,
                        onReload    : mockReloadCallback
                    });
                });

                beforeEach(function () {
                    spyOn(wexInfiniteList.scope, "$broadcast");
                });

                afterEach(function() {
                    wexInfiniteList.parentElement.remove();
                });

                describe("when allDataLoaded is true", function () {

                    beforeEach(function () {
                        wexInfiniteList.scope.allDataLoaded = true;

                        wexInfiniteList.scope.loadMore();

                        $rootScope.$digest();
                    });

                    it("should NOT call onReload", function () {
                        expect(mockReloadCallback).not.toHaveBeenCalled();
                    });

                    it("should NOT change the value of allDataLoaded", function () {
                        expect(wexInfiniteList.scope.allDataLoaded).toBeTruthy();
                    });

                    it("should call onPageLoaded", function () {
                        expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                    });

                    it("should broadcast scroll.infiniteScrollComplete", function () {
                        expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                    });
                });

                describe("when allDataLoaded is false", function () {
                    var reloadCallbackDeferred;

                    beforeEach(function () {
                        reloadCallbackDeferred = $q.defer();
                        mockReloadCallback.and.returnValue(reloadCallbackDeferred.promise);
                    });

                    beforeEach(function () {
                        wexInfiniteList.scope.allDataLoaded = false;

                        wexInfiniteList.scope.loadMore();
                    });

                    it("should call onReload", function () {
                        expect(mockReloadCallback).toHaveBeenCalledWith();
                    });

                    describe("when the reload callback promise resolves with true", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.resolve(true);

                            $rootScope.$digest();
                        });

                        it("should set allDataLoaded to true", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeTruthy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });

                    describe("when the reload callback promise resolves with false", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.resolve(false);

                            $rootScope.$digest();
                        });

                        it("should set allDataLoaded to false", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeFalsy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });

                    describe("when the reload callback promise resolves with no value", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.resolve();

                            $rootScope.$digest();
                        });

                        it("should set allDataLoaded to false", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeFalsy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });

                    describe("when the reload callback promise rejects", function () {

                        beforeEach(function () {
                            reloadCallbackDeferred.reject();

                            $rootScope.$digest();
                        });

                        it("should NOT change the value of allDataLoaded", function () {
                            expect(wexInfiniteList.scope.allDataLoaded).toBeFalsy();
                        });

                        it("should call onPageLoaded", function () {
                            expect(mockPageLoadedCallback).toHaveBeenCalledWith();
                        });

                        it("should broadcast scroll.infiniteScrollComplete", function () {
                            expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                        });
                    });
                });
            });
        });
    });

    function createWexInfiniteList(options) {
        var scope = $rootScope.$new(),
            element,
            parent,
            createIonContent = function () {
                return $compile("<ion-content></ion-content>")(scope);
            };

        options = options || {};
        scope.onPageLoaded = options.onPageLoaded;
        scope.onReload = options.onReload;
        scope.reloadDistance = options.reloadDistance;
        scope.loadingComplete = options.loadingComplete;

        var markup = [];

        markup.push("<wex-infinite-list");
        if (scope.onPageLoaded) {
            markup.push(" on-page-loaded='onPageLoaded'");
        }
        if (scope.onReload) {
            markup.push(" on-reload='onReload'");
        }
        if (scope.reloadDistance) {
            markup.push(" reload-distance='reloadDistance'");
        }

        if (scope.loadingComplete) {
            markup.push(" loading-complete='loadingComplete'");
        }
        markup.push(">");
        markup.push("</wex-infinite-list>");

        element = $compile(markup.join(""))(scope);
        parent = createIonContent().append(element);
        $rootScope.$digest();

        return {
            parentElement : parent,
            element: element,
            scope  : element.isolateScope()
        };
    }
})();