(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to define functions after they're used

    describe("An ElementUtil service", function () {

        var mocks = {};

        module.sharedInjector();

        beforeAll(function () {
            this.includeDependencies({
                includeAppDependencies: false,
                mocks: mocks
            }, this);

            inject(function (_, $compile, $rootScope, ElementUtil) {
                mocks._ = _;
                mocks.$compile = $compile;
                mocks.$rootScope = $rootScope;
                mocks.ElementUtil = ElementUtil;
            });
        });

        beforeEach(function () {
            if (!mocks.navBar) {
                mocks.navBar = mocks.$compile("<ion-nav-bar class='bar-wex'></ion-nav-bar>")(mocks.$rootScope);
                angular.element(document.body).append(mocks.navBar);
            }

            if (!mocks.rootNavView) {
                mocks.rootNavView = mocks.$compile("<ion-nav-view class='nav-view-root'></ion-nav-view>")(mocks.$rootScope);
                angular.element(document.body).append(mocks.rootNavView);
            }

            mocks.$rootScope.$digest();
        });
        
        afterEach(function () {
            //reset all mocks
            mocks._.forEach(mocks, TestUtils.resetMock);
        });

        afterAll(function () {
            if (mocks.navBar) {
                mocks.navBar.remove();
            }

            if (mocks.rootNavView) {
                mocks.rootNavView.remove();
            }

            mocks = null;
        });

        describe("has a fieldHasError function that", function () {
            var field;

            afterAll(function () {
                field = null;
            });

            describe("when the field is not defined", function () {

                it("should return false", function () {
                    expect(mocks.ElementUtil.fieldHasError(field)).toBeFalsy();
                });
            });

            describe("when the field is null", function () {

                it("should return false", function () {
                    field = null;

                    expect(mocks.ElementUtil.fieldHasError(field)).toBeFalsy();
                });
            });

            describe("when the field is a valid object", function () {

                describe("when field.$error is undefined", function () {

                    it("should return false", function () {
                        field = {};

                        expect(mocks.ElementUtil.fieldHasError(field)).toBeFalsy();
                    });
                });

                describe("when field.$error is null", function () {

                    beforeAll(function () {
                        field.$error = null;
                    });

                    it("should return false", function () {
                        expect(mocks.ElementUtil.fieldHasError(field)).toBeFalsy();
                    });
                });

                describe("when field.$error is a valid object", function () {

                    beforeAll(function () {
                        field.$error = {};
                    });

                    describe("when field.$error is empty", function () {
                        it("should return false", function () {
                            expect(mocks.ElementUtil.fieldHasError(field)).toBeFalsy();
                        });
                    });

                    describe("when field.$error contains properties", function () {

                        beforeAll(function () {
                            field.$error.mockProperty = "Mock property value";
                        });

                        it("should return true", function () {
                            expect(mocks.ElementUtil.fieldHasError(field)).toBeTruthy();
                        });
                    });
                });
            });
        });

        describe("has a pageHasNavBar function that", function () {

            describe("when the nav bar is hidden", function () {

                beforeEach(function () {
                    mocks.navBar.addClass("hide");

                    mocks.$rootScope.$digest();
                });

                afterEach(function () {
                    mocks.navBar.remove();
                    mocks.navBar = null;

                    mocks.$rootScope.$digest();
                });

                it("should return false", function () {
                    expect(mocks.ElementUtil.pageHasNavBar()).toBeFalsy();
                });
            });

            describe("when the nav bar is NOT hidden", function () {

                beforeEach(function () {
                    mocks.navBar.removeClass("hide");

                    mocks.$rootScope.$digest();
                });

                it("should return true", function () {
                    expect(mocks.ElementUtil.pageHasNavBar()).toBeTruthy();
                });
            });

            describe("when there is no nav bar", function () {

                beforeEach(function () {
                    mocks.navBar.remove();

                    mocks.$rootScope.$digest();
                });

                afterEach(function () {
                    mocks.navBar = null;
                });

                it("should return false", function () {
                    expect(mocks.ElementUtil.pageHasNavBar()).toBeFalsy();
                });
            });
        });

        describe("has a getActiveNavView function that", function () {

            describe("when there is a nav view", function () {

                it("should return the nav view", function () {
                    expect(mocks.ElementUtil.getActiveNavView()).toEqual(mocks.rootNavView);
                });
            });

            describe("when there is NOT a nav view", function () {

                beforeEach(function () {
                    mocks.rootNavView.remove();

                    mocks.$rootScope.$digest();
                });

                afterEach(function () {
                    mocks.rootNavView = null;
                });

                it("should return null", function () {
                    expect(mocks.ElementUtil.getActiveNavView()).toEqual(null);
                });
            });
        });

        describe("has a findViews function that", function () {

            describe("given a predicate that selects for views with a specific state", function () {
                var state = "mockState",
                    predicate = function (view) {
                        return view.attr("nav-view") === state;
                    };

                afterAll(function () {
                    state = null;
                    predicate = null;
                });

                describe("when there is no view at the root", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(mocks.ElementUtil.findViews(predicate, true)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(mocks.ElementUtil.findViews(predicate, false)).toEqual([]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return null", function () {
                                expect(mocks.ElementUtil.findViews(predicate, true)).toEqual(null);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an empty array", function () {
                                expect(mocks.ElementUtil.findViews(predicate, false)).toEqual([]);
                            });
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state);

                        mocks.rootNavView.append(view);

                        mocks.$rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();
                        view = null;

                        mocks.$rootScope.$digest();
                    });

                    describe("when firstView is true", function () {

                        it("should return the view", function () {
                            expect(mocks.ElementUtil.findViews(predicate, true)).toEqual(view);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an array containing the view", function () {
                            expect(mocks.ElementUtil.findViews(predicate, false)).toEqual([view]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the specified view", function () {
                                expect(mocks.ElementUtil.findViews(predicate, true)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing only the specified view", function () {
                                expect(mocks.ElementUtil.findViews(predicate, false)).toEqual([view]);
                            });
                        });
                    });
                });

                describe("when there is a nav-view with the specified state at the root with an embedded view",
                    function () {

                        var navView,
                            embeddedView;

                        beforeEach(function () {
                            navView = createNavView(state);
                            embeddedView = createView(state, navView);

                            mocks.rootNavView.append(navView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();
                            navView = null;

                            embeddedView.remove();
                            embeddedView = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the embedded view", function () {
                                expect(mocks.ElementUtil.findViews(predicate, true)).toEqual(embeddedView);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the embedded view", function () {
                                expect(mocks.ElementUtil.findViews(predicate, false)).toEqual([embeddedView]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                mocks.rootNavView.append(decoyView);

                                mocks.$rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();
                                decoyView = null;

                                mocks.$rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the specified view", function () {
                                    expect(mocks.ElementUtil.findViews(predicate, true)).toEqual(embeddedView);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing only the specified view", function () {
                                    expect(mocks.ElementUtil.findViews(predicate, false)).toEqual([embeddedView]);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(mocks.ElementUtil.findViews(predicate, true, null)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(mocks.ElementUtil.findViews(predicate, false, null)).toEqual([]);
                        });
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state);

                            mocks.rootNavView.append(view);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();
                            view = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the view", function () {
                                expect(mocks.ElementUtil.findViews(predicate, true, mocks.rootNavView)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the view", function () {
                                expect(mocks.ElementUtil.findViews(predicate, false, mocks.rootNavView)).toEqual([view]);
                            });
                        });
                    });
                });
            });
        });

        describe("has a findViewsMatching function that", function () {

            describe("when searching for a single state", function () {
                var states = [],
                    state1 = "state1";

                beforeEach(function () {
                    states.push(state1);
                });

                afterEach(function () {
                    states.pop();
                });

                afterAll(function () {
                    states = null;
                    state1 = null;
                });

                describe("when there is no view at the root", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return null", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(null);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an empty array", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([]);
                            });
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state1);

                        mocks.rootNavView.append(view);

                        mocks.$rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();
                        view = null;

                        mocks.$rootScope.$digest();
                    });

                    describe("when firstView is true", function () {

                        it("should return the view", function () {
                            expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(view);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an array containing the view", function () {
                            expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([view]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the specified view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing only the specified view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([view]);
                            });
                        });
                    });
                });

                describe("when there is a nav-view with the specified state at the root with an embedded view",
                    function () {

                        var navView,
                            embeddedView;

                        beforeEach(function () {
                            navView = createNavView(state1);
                            embeddedView = createView(state1, navView);

                            mocks.rootNavView.append(navView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();
                            navView = null;

                            embeddedView.remove();
                            embeddedView = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the embedded view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the embedded view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([embeddedView]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                mocks.rootNavView.append(decoyView);

                                mocks.$rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();
                                decoyView = null;

                                mocks.$rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the specified view", function () {
                                    expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing only the specified view", function () {
                                    expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([embeddedView]);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(mocks.ElementUtil.findViewsMatching(states, true, null)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(mocks.ElementUtil.findViewsMatching(states, false, null)).toEqual([]);
                        });
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state1);

                            mocks.rootNavView.append(view);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();
                            view = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, true, mocks.rootNavView)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, false, mocks.rootNavView)).toEqual([view]);
                            });
                        });
                    });
                });

                describe("when also searching for a second state", function () {
                    var state2 = "state2";

                    beforeEach(function () {
                        states.push(state2);
                    });

                    afterEach(function () {
                        states.pop();
                    });

                    afterAll(function () {
                        state2 = null;
                    });

                    describe("when views with both specified states are present on the root", function () {
                        var view1, view2;

                        beforeEach(function () {
                            view1 = createView(state1);
                            view2 = createView(state2);

                            mocks.rootNavView.append(view1);
                            mocks.rootNavView.append(view2);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            view1.remove();
                            view2.remove();

                            view1 = null;
                            view2 = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the first view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(view1);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the first and second views", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([view1, view2]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                mocks.rootNavView.append(decoyView);

                                mocks.$rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();
                                decoyView = null;

                                mocks.$rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the first view", function () {
                                    expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(view1);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing the first and second views", function () {
                                    expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([view1, view2]);
                                });
                            });
                        });
                    });

                    describe([
                        "when there is a nav-view at the root that has the first specified state with an embedded view",
                        "and there is a nav-view at the root that has the second specified state with an embedded view"
                    ].join(), function () {
                        var navView1,
                            embeddedView1,
                            navView2,
                            embeddedView2;

                        beforeEach(function () {
                            navView1 = createNavView(state1);
                            embeddedView1 = createView(state1, navView1);

                            navView2 = createNavView(state2);
                            embeddedView2 = createView(state2, navView2);

                            mocks.rootNavView.append(navView1);
                            mocks.rootNavView.append(navView2);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            navView1.remove();
                            navView2.remove();

                            navView1 = null;
                            navView2 = null;
                            embeddedView1 = null;
                            embeddedView2 = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the first embedded view", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView1);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the first and second embedded views", function () {
                                expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([
                                    embeddedView1,
                                    embeddedView2
                                ]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                mocks.rootNavView.append(decoyView);

                                mocks.$rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();
                                decoyView = null;

                                mocks.$rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the first embedded view", function () {
                                    expect(mocks.ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView1);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing the first and second embedded views", function () {
                                    expect(mocks.ElementUtil.findViewsMatching(states, false)).toEqual([
                                        embeddedView1,
                                        embeddedView2
                                    ]);
                                });
                            });
                        });
                    });

                    //TODO tests for when there is no stage view on the root nav-view

                    //TODO tests for when there is no active view on the root nav-view

                    //TODO tests for when passing the navView argument
                });
            });
        });

        describe("has a findViewByState function that", function () {
            var state = "mockState";

            afterAll(function () {
                state = null;
            });

            describe("when searching for the specified state", function () {

                describe("when there is no view at the root", function () {

                    it("should return null", function () {
                        expect(mocks.ElementUtil.findViewByState(state)).toEqual(null);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return null", function () {
                            expect(mocks.ElementUtil.findViewByState(state)).toEqual(null);
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state);

                        mocks.rootNavView.append(view);

                        mocks.$rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();
                        view = null;

                        mocks.$rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(mocks.ElementUtil.findViewByState(state)).toEqual(view);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(mocks.ElementUtil.findViewByState(state)).toEqual(view);
                        });

                    });
                });

                describe("when there is a nav-view with the specified state at the root with an embedded view",

                    function () {
                        var navView,
                            embeddedView;

                        beforeEach(function () {
                            navView = createNavView(state);
                            embeddedView = createView(state, navView);

                            mocks.rootNavView.append(navView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();
                            navView = null;
                            embeddedView = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return the embedded view", function () {
                            expect(mocks.ElementUtil.findViewByState(state)).toEqual(embeddedView);
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                mocks.rootNavView.append(decoyView);

                                mocks.$rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();
                                decoyView = null;

                                mocks.$rootScope.$digest();
                            });

                            it("should return the specified view", function () {
                                expect(mocks.ElementUtil.findViewByState(state)).toEqual(embeddedView);
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    it("should return null", function () {
                        expect(mocks.ElementUtil.findViewByState(state, null)).toEqual(null);
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state);

                            mocks.rootNavView.append(view);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();
                            view = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return the view", function () {
                            expect(mocks.ElementUtil.findViewByState(state, mocks.rootNavView)).toEqual(view);
                        });
                    });
                });
            });
        });

        describe("has a findViewByStatesInOrder function that", function () {

            describe("when searching for two states", function () {
                var state1 = "state1",
                    state2 = "state2",
                    states = [state1, state2];

                afterAll(function () {
                    states = null;
                    state1 = null;
                    state2 = null;
                });

                describe("when there is no view at the root", function () {

                    it("should return null", function () {
                        expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(null);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return null", function () {
                            expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(null);
                        });
                    });
                });

                describe("when only a view with the first state is present", function () {
                    var view1;

                    beforeEach(function () {
                        view1 = createView(state1);

                        mocks.rootNavView.append(view1);

                        mocks.$rootScope.$digest();
                    });

                    afterEach(function () {
                        view1.remove();
                        view1 = null;

                        mocks.$rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
                        });
                    });
                });

                describe("when only a view with the second state is present", function () {
                    var view2;

                    beforeEach(function () {
                        view2 = createView(state2);

                        mocks.rootNavView.append(view2);

                        mocks.$rootScope.$digest();
                    });

                    afterEach(function () {
                        view2.remove();
                        view2 = null;

                        mocks.$rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(view2);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(view2);
                        });
                    });
                });

                describe("when views with both states are present", function () {
                    var view1, view2;

                    beforeEach(function () {
                        view1 = createView(state1);
                        view2 = createView(state2);

                        mocks.rootNavView.append(view1);
                        mocks.rootNavView.append(view2);

                        mocks.$rootScope.$digest();
                    });

                    afterEach(function () {
                        view1.remove();
                        view2.remove();
                        view1 = view2 = null;

                        mocks.$rootScope.$digest();
                    });

                    it("should return the first view", function () {
                        expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            mocks.rootNavView.append(decoyView);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();
                            decoyView = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return the first specified view", function () {
                            expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
                        });
                    });
                });

                describe("when there are nav-views with both specified states at the root with embedded views",

                    function () {
                        var navView1,
                            embeddedView1,
                            navView2,
                            embeddedView2;

                        beforeEach(function () {
                            navView1 = createNavView(state1);
                            navView2 = createNavView(state2);

                            mocks.rootNavView.append(navView1);
                            mocks.rootNavView.append(navView2);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            navView1.remove();
                            navView2.remove();
                            navView1 = navView2 = null;
                            embeddedView1 = embeddedView2 = null;

                            mocks.$rootScope.$digest();
                        });

                        describe("when the embedded views contain the same state types", function () {

                            beforeEach(function () {
                                embeddedView1 = createView(state1, navView1);
                                embeddedView2 = createView(state2, navView2);

                                mocks.$rootScope.$digest();
                            });

                            it("should return the first embedded view", function () {
                                expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView1);
                            });

                            describe("when there is a view with a state we aren't looking for on the root", function () {
                                var decoyView;

                                beforeEach(function () {
                                    decoyView = createView("decoyState");

                                    mocks.rootNavView.append(decoyView);

                                    mocks.$rootScope.$digest();
                                });

                                afterEach(function () {
                                    decoyView.remove();
                                    decoyView = null;

                                    mocks.$rootScope.$digest();
                                });

                                it("should return the first specified view", function () {
                                    expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView1);
                                });
                            });
                        });

                        describe("when the embedded views contain 'opposite' state types", function () {

                            beforeEach(function () {
                                embeddedView1 = createView(state2, navView1);
                                embeddedView2 = createView(state1, navView2);

                                mocks.$rootScope.$digest();
                            });

                            it("should return the second opposite embedded view", function () {
                                expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView2);
                            });

                            describe("when there is a view with a state we aren't looking for on the root", function () {
                                var decoyView;

                                beforeEach(function () {
                                    decoyView = createView("decoyState");

                                    mocks.rootNavView.append(decoyView);

                                    mocks.$rootScope.$digest();
                                });

                                afterEach(function () {
                                    decoyView.remove();
                                    decoyView = null;

                                    mocks.$rootScope.$digest();
                                });

                                it("should return the second specified opposite view", function () {
                                    expect(mocks.ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView2);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    it("should return null", function () {
                        expect(mocks.ElementUtil.findViewByStatesInOrder(states, null)).toEqual(null);
                    });
                });

                describe("given a valid navView", function () {

                    describe("when only a view with the first state is present", function () {
                        var view1;

                        beforeEach(function () {
                            view1 = createView(state1);

                            mocks.rootNavView.append(view1);

                            mocks.$rootScope.$digest();
                        });

                        afterEach(function () {
                            view1.remove();
                            view1 = null;

                            mocks.$rootScope.$digest();
                        });

                        it("should return the view", function () {
                            expect(mocks.ElementUtil.findViewByStatesInOrder(states, mocks.rootNavView)).toEqual(view1);
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                mocks.rootNavView.append(decoyView);

                                mocks.$rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();
                                decoyView = null;

                                mocks.$rootScope.$digest();
                            });

                            it("should return the specified view", function () {
                                expect(mocks.ElementUtil.findViewByStatesInOrder(states, mocks.rootNavView)).toEqual(view1);
                            });
                        });
                    });

                    //TODO additional tests for when passed a navView
                });

                //TODO tests for when there is only an embedded view for the first state

                //TODO tests for when there is only an embedded view for the second state
            });
        });

        describe("has a getFocusedView function that", function () {

            //TODO figure out a way to test this
            xit("should call findViewByStatesInOrder with the expected values", function () {
            });

            //TODO additional tests
        });

        describe("has a getViewContent function that", function () {

            describe("when the focused view has no content", function () {
                var view;

                beforeEach(function () {
                    view = createView("active", mocks.rootNavView);
                });

                afterEach(function () {
                    view.remove();
                    view = null;
                });

                it("should return null", function () {
                    expect(mocks.ElementUtil.getViewContent()).toEqual(null);
                });
            });

            describe("when the focused view has content", function () {
                var view,
                    content;

                beforeEach(function () {
                    view = createView("active", mocks.rootNavView);
                    content = mocks.$compile("<ion-content></ion-content>")(mocks.$rootScope);

                    view.append(content);

                    mocks.$rootScope.$digest();
                });

                afterEach(function () {
                    view.remove();
                    view = null;

                    content = null;

                    mocks.$rootScope.$digest();
                });

                it("should return the content", function () {
                    expect(mocks.ElementUtil.getViewContent()[0].outerHTML).toEqual(content[0].outerHTML);
                });
            });

            describe("when passed a null view", function () {

                it("should return null", function () {
                    expect(mocks.ElementUtil.getViewContent(null)).toEqual(null);
                });
            });

            describe("when passed a valid view", function () {
                var view;

                describe("when the view has no content", function () {

                    beforeEach(function () {
                        view = createView("mockState");
                    });

                    afterEach(function () {
                        view.remove();
                        view = null;
                    });

                    it("should return null", function () {
                        expect(mocks.ElementUtil.getViewContent(view)).toEqual(null);
                    });
                });

                describe("when the view has content", function () {
                    var content;

                    beforeEach(function () {
                        view = createView("mockState");
                        content = mocks.$compile("<ion-content></ion-content>")(mocks.$rootScope);

                        view.append(content);

                        mocks.$rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();
                        view = null;
                        content = null;

                        mocks.$rootScope.$digest();
                    });

                    it("should return the content", function () {
                        expect(mocks.ElementUtil.getViewContent(view)[0].outerHTML).toEqual(content[0].outerHTML);
                    });
                });
            });
        });

        //TODO
        xdescribe("has a findActiveBackButton function that", function () {
        });

        //TODO
        xdescribe("has a findBackButton function that", function () {
        });

        //TODO
        xdescribe("has a findCachedBackButton function that", function () {
        });

        //TODO
        xdescribe("has a findNavBarByStatesInOrder function that", function () {
        });

        describe("has a getFocusedNavBar function that", function () {

            beforeEach(function () {
                mocks.ElementUtil.getFocusedNavBar();
            });

            //TODO figure out how to test this
            xit("should call findNavBarByStatesInOrder with the expected values", function () {
            });
        });

        describe("has a getUnfocusedNavBar function that", function () {

            beforeEach(function () {
                mocks.ElementUtil.getUnfocusedNavBar();
            });

            //TODO figure out how to test this
            xit("should call findNavBarByStatesInOrder with the expected values", function () {
            });
        });

        describe("has a getUnfocusedView function that", function () {

            describe("when passed a navView", function () {
                var mockNavView;

                beforeEach(function () {
                    mockNavView = TestUtils.getRandomStringThatIsAlphaNumeric(10);

                    mocks.ElementUtil.getUnfocusedView(mockNavView);
                });

                afterAll(function () {
                    mockNavView = null;
                });

                //TODO figure out how to test this
                xit("should call findViewByStatesInOrder with the expected values", function () {
                });
            });

            describe("when NOT passed a navView", function () {
                beforeEach(function () {
                    mocks.ElementUtil.getUnfocusedView();
                });

                //TODO figure out how to test this
                xit("should call findViewByStatesInOrder with the expected values", function () {
                });
            });
        });

        describe("has a getSideMenu function that", function () {

            beforeEach(function () {
                spyOn(document, "querySelector");
            });

            describe("when given a side", function () {
                var side;

                beforeEach(function () {
                    side = TestUtils.getRandomStringThatIsAlphaNumeric(10);
                });

                afterAll(function () {
                    side = null;
                });

                describe("when there is a menu with the given side", function () {
                    var sideMenu,
                        result;

                    beforeEach(function () {
                        sideMenu = createSideMenu(side);
                        document.querySelector.and.returnValue(sideMenu);

                        result = mocks.ElementUtil.getSideMenu(side);
                    });

                    afterEach(function () {
                        sideMenu.remove();
                        sideMenu = null;
                        result = null;
                    });

                    it("should return the side menu", function () {
                        expect(result).toEqual(angular.element(sideMenu));
                    });
                });

                describe("when there is NOT a menu with the given side", function () {
                    var result;

                    beforeEach(function () {
                        result = mocks.ElementUtil.getSideMenu(side);
                    });

                    afterAll(function () {
                        result = null;
                    });

                    it("should return the side menu", function () {
                        expect(result).toBeNull();
                    });
                });
            });

            describe("when NOT given a side", function () {

                describe("when there is a menu", function () {
                    var sideMenu,
                        result;

                    beforeEach(function () {
                        sideMenu = createSideMenu();
                        document.querySelector.and.returnValue(sideMenu);

                        result = mocks.ElementUtil.getSideMenu();
                    });

                    afterEach(function () {
                        sideMenu.remove();
                        sideMenu = null;
                        result = null;
                    });

                    it("should return the side menu", function () {
                        expect(result).toEqual(angular.element(sideMenu));
                    });
                });

                describe("when there is NOT a menu", function () {
                    var result;

                    beforeEach(function () {
                        result = mocks.ElementUtil.getSideMenu();
                    });

                    afterAll(function () {
                        result = null;
                    });

                    it("should return the side menu", function () {
                        expect(result).toBeNull();
                    });
                });
            });
        });

        function createNavView(state) {
            return mocks.$compile("<ion-nav-view nav-view='" + state + "'></ion-nav-view>")(mocks.$rootScope);
        }

        function createSideMenu(side) {
            var template;

            if (side) {
                template = "<ion-side-menus><ion-side-menu side='" + side + "'></ion-side-menu></ion-side-menus>";
            }
            else {
                template = "<ion-side-menus><ion-side-menu></ion-side-menu></ion-side-menus>";
            }

            return mocks.$compile(template)(mocks.$rootScope).find("ion-side-menu");
        }

        function createView(state, parent) {
            var view = mocks.$compile("<ion-view nav-view='" + state + "'></ion-view>")(mocks.$rootScope);

            if (parent) {
                parent.append(view);
            }

            mocks.$rootScope.$digest();

            return view;
        }
    });
})();
