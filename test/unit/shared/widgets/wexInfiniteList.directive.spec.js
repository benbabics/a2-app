(function () {
    "use strict";

    var $rootScope,
        $compile,
        $q,
        wexInfiniteList,
        mockReloadCallback,
        DEFAULT_RELOAD_DISTANCE = "1%";

    describe("A WEX Infinite List Directive", function () {

        beforeEach(function () {
            module("app.shared");
            module("app.html");

            inject(function (_$rootScope_, _$compile_, _$q_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $q = _$q_;
            });

            mockReloadCallback = jasmine.createSpy("mockReloadCallback");

            wexInfiniteList = createWexInfiniteList({onReload: mockReloadCallback});
        });

        it("should initialize loadingComplete to false", function () {
            expect(wexInfiniteList.scope.loadingComplete).toBeFalsy();
        });

        describe("when a reload distance is specified", function () {
            var reloadDistance;

            beforeEach(function () {
                reloadDistance = String(TestUtils.getRandomInteger(1, 100));

                wexInfiniteList = createWexInfiniteList({
                    onReload      : mockReloadCallback,
                    reloadDistance: reloadDistance
                });
            });

            it("should initialize reloadDistance to the given value", function () {
                expect(wexInfiniteList.scope.reloadDistance).toEqual(reloadDistance);
            });
        });

        describe("when a reload distance is NOT specified", function () {

            beforeEach(function () {
                wexInfiniteList = createWexInfiniteList({onReload: mockReloadCallback});
            });

            it("should initialize reloadDistance to the default value", function () {
                expect(wexInfiniteList.scope.reloadDistance).toEqual(DEFAULT_RELOAD_DISTANCE);
            });
        });

        describe("has a loadMore function that", function () {

            beforeEach(function () {
                spyOn(wexInfiniteList.scope, "$broadcast");
            });

            describe("when loadingComplete is true", function () {

                beforeEach(function () {
                    wexInfiniteList.scope.loadingComplete = true;

                    wexInfiniteList.scope.loadMore();

                    $rootScope.$digest();
                });

                it("should NOT call onReload", function () {
                    expect(mockReloadCallback).not.toHaveBeenCalled();
                });

                it("should NOT change the value of loadingComplete", function () {
                    expect(wexInfiniteList.scope.loadingComplete).toBeTruthy();
                });

                it("should broadcast scroll.infiniteScrollComplete", function () {
                    expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                });
            });

            describe("when loadingComplete is false", function () {
                var reloadCallbackDeferred;

                beforeEach(function () {
                    reloadCallbackDeferred = $q.defer();
                    mockReloadCallback.and.returnValue(reloadCallbackDeferred.promise);
                });

                beforeEach(function () {
                    wexInfiniteList.scope.loadingComplete = false;

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

                    it("should set loadingComplete to true", function () {
                        expect(wexInfiniteList.scope.loadingComplete).toBeTruthy();
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

                    it("should set loadingComplete to false", function () {
                        expect(wexInfiniteList.scope.loadingComplete).toBeFalsy();
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

                    it("should set loadingComplete to false", function () {
                        expect(wexInfiniteList.scope.loadingComplete).toBeFalsy();
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

                    it("should NOT change the value of loadingComplete", function () {
                        expect(wexInfiniteList.scope.loadingComplete).toBeFalsy();
                    });

                    it("should broadcast scroll.infiniteScrollComplete", function () {
                        expect(wexInfiniteList.scope.$broadcast).toHaveBeenCalledWith("scroll.infiniteScrollComplete");
                    });
                });
            });
        });
    });

    function createWexInfiniteList(options) {
        var scope = $rootScope.$new(),
            element,
            createIonContent = function () {
                return $compile("<ion-content></ion-content>")(scope);
            };

        options = options || {};
        scope.onReload = options.onReload;
        scope.reloadDistance = options.reloadDistance;

        var markup = [];

        markup.push("<wex-infinite-list");
        if (scope.onReload) {
            markup.push(" on-reload='onReload'");
        }
        if (scope.reloadDistance) {
            markup.push(" reload-distance='reloadDistance'");
        }
        markup.push(">");
        markup.push("</wex-infinite-list>");

        element = $compile(markup.join(""))(scope);
        createIonContent().append(element);
        $rootScope.$digest();

        return {
            element: element,
            scope  : element.isolateScope()
        };
    }
})();