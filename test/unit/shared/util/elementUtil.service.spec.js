(function () {
    "use strict";

    /* jshint -W003, -W026 */ // These allow us to define functions after they're used

    describe("An ElementUtil service", function () {

        var _,
            $compile,
            $rootScope,
            ElementUtil,
            navBar,
            rootNavView;

        beforeEach(function () {

            module("app.shared");

            inject(function (___, _$compile_, _$rootScope_, _ElementUtil_) {
                _ = ___;
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                ElementUtil = _ElementUtil_;

                navBar = $compile("<ion-nav-bar class='bar-wex'></ion-nav-bar>")($rootScope);
                rootNavView = $compile("<ion-nav-view class='nav-view-root'></ion-nav-view>")($rootScope);

                angular.element(document.body).append(navBar);
                angular.element(document.body).append(rootNavView);

                $rootScope.$digest();
            });
        });

        afterEach(function () {
            navBar.remove();
            rootNavView.remove();

            $rootScope.$digest();
        });

        describe("has a fieldHasError function that", function () {

            describe("when the field is not defined", function () {
                var field;

                it("should return false", function () {
                    expect(ElementUtil.fieldHasError(field)).toBeFalsy();
                });
            });

            describe("when the field is null", function () {
                var field = null;

                it("should return false", function () {
                    expect(ElementUtil.fieldHasError(field)).toBeFalsy();
                });
            });

            describe("when the field is a valid object", function () {
                var field = {};

                describe("when field.$error is undefined", function () {
                    it("should return false", function () {
                        expect(ElementUtil.fieldHasError(field)).toBeFalsy();
                    });
                });

                describe("when field.$error is null", function () {
                    beforeAll(function () {
                        field.$error = null;
                    });

                    it("should return false", function () {
                        expect(ElementUtil.fieldHasError(field)).toBeFalsy();
                    });
                });

                describe("when field.$error is a valid object", function () {
                    beforeAll(function () {
                        field.$error = {};
                    });

                    describe("when field.$error is empty", function () {
                        it("should return false", function () {
                            expect(ElementUtil.fieldHasError(field)).toBeFalsy();
                        });
                    });

                    describe("when field.$error contains properties", function () {
                        beforeAll(function () {
                            field.$error.mockProperty = "Mock property value";
                        });

                        it("should return true", function () {
                            expect(ElementUtil.fieldHasError(field)).toBeTruthy();
                        });
                    });
                });
            });
        });

        describe("has a pageHasNavBar function that", function () {

            describe("when the nav bar is hidden", function () {

                beforeEach(function () {
                    navBar.addClass("hide");

                    $rootScope.$digest();
                });

                it("should return false", function () {
                    expect(ElementUtil.pageHasNavBar()).toBeFalsy();
                });
            });

            describe("when the nav bar is NOT hidden", function () {

                beforeEach(function () {
                    navBar.removeClass("hide");

                    $rootScope.$digest();
                });

                it("should return true", function () {
                    expect(ElementUtil.pageHasNavBar()).toBeTruthy();
                });
            });

            describe("when there is no nav bar", function () {

                beforeEach(function () {
                    navBar.remove();

                    $rootScope.$digest();
                });

                it("should return false", function () {
                    expect(ElementUtil.pageHasNavBar()).toBeFalsy();
                });
            });
        });

        describe("has a getActiveNavView function that", function () {

            describe("when there is a nav view", function () {

                it("should return the nav view", function () {
                    expect(ElementUtil.getActiveNavView()).toEqual(rootNavView);
                });
            });

            describe("when there is NOT a nav view", function () {

                beforeEach(function () {
                    rootNavView.remove();

                    $rootScope.$digest();
                });

                it("should return null", function () {
                    expect(ElementUtil.getActiveNavView()).toEqual(null);
                });
            });
        });

        describe("has a findViews function that", function () {

            describe("given a predicate that selects for views with a specific state", function () {
                var state = "mockState",
                    predicate = function (view) {
                        return view.attr("nav-view") === state;
                    };

                describe("when there is no view at the root", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(ElementUtil.findViews(predicate, true)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(ElementUtil.findViews(predicate, false)).toEqual([]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return null", function () {
                                expect(ElementUtil.findViews(predicate, true)).toEqual(null);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an empty array", function () {
                                expect(ElementUtil.findViews(predicate, false)).toEqual([]);
                            });
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state);

                        rootNavView.append(view);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    describe("when firstView is true", function () {

                        it("should return the view", function () {
                            expect(ElementUtil.findViews(predicate, true)).toEqual(view);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an array containing the view", function () {
                            expect(ElementUtil.findViews(predicate, false)).toEqual([view]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the specified view", function () {
                                expect(ElementUtil.findViews(predicate, true)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing only the specified view", function () {
                                expect(ElementUtil.findViews(predicate, false)).toEqual([view]);
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

                            rootNavView.append(navView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the embedded view", function () {
                                expect(ElementUtil.findViews(predicate, true)).toEqual(embeddedView);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the embedded view", function () {
                                expect(ElementUtil.findViews(predicate, false)).toEqual([embeddedView]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the specified view", function () {
                                    expect(ElementUtil.findViews(predicate, true)).toEqual(embeddedView);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing only the specified view", function () {
                                    expect(ElementUtil.findViews(predicate, false)).toEqual([embeddedView]);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(ElementUtil.findViews(predicate, true, null)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(ElementUtil.findViews(predicate, false, null)).toEqual([]);
                        });
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state);

                            rootNavView.append(view);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the view", function () {
                                expect(ElementUtil.findViews(predicate, true, rootNavView)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the view", function () {
                                expect(ElementUtil.findViews(predicate, false, rootNavView)).toEqual([view]);
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

                describe("when there is no view at the root", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(ElementUtil.findViewsMatching(states, true)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(ElementUtil.findViewsMatching(states, false)).toEqual([]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return null", function () {
                                expect(ElementUtil.findViewsMatching(states, true)).toEqual(null);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an empty array", function () {
                                expect(ElementUtil.findViewsMatching(states, false)).toEqual([]);
                            });
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state1);

                        rootNavView.append(view);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    describe("when firstView is true", function () {

                        it("should return the view", function () {
                            expect(ElementUtil.findViewsMatching(states, true)).toEqual(view);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an array containing the view", function () {
                            expect(ElementUtil.findViewsMatching(states, false)).toEqual([view]);
                        });
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the specified view", function () {
                                expect(ElementUtil.findViewsMatching(states, true)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing only the specified view", function () {
                                expect(ElementUtil.findViewsMatching(states, false)).toEqual([view]);
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

                            rootNavView.append(navView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the embedded view", function () {
                                expect(ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the embedded view", function () {
                                expect(ElementUtil.findViewsMatching(states, false)).toEqual([embeddedView]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the specified view", function () {
                                    expect(ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing only the specified view", function () {
                                    expect(ElementUtil.findViewsMatching(states, false)).toEqual([embeddedView]);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    describe("when firstView is true", function () {

                        it("should return null", function () {
                            expect(ElementUtil.findViewsMatching(states, true, null)).toEqual(null);
                        });
                    });

                    describe("when firstView is false", function () {

                        it("should return an empty array", function () {
                            expect(ElementUtil.findViewsMatching(states, false, null)).toEqual([]);
                        });
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state1);

                            rootNavView.append(view);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the view", function () {
                                expect(ElementUtil.findViewsMatching(states, true, rootNavView)).toEqual(view);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the view", function () {
                                expect(ElementUtil.findViewsMatching(states, false, rootNavView)).toEqual([view]);
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

                    describe("when views with both specified states are present on the root", function () {
                        var view1, view2;

                        beforeEach(function () {
                            view1 = createView(state1);
                            view2 = createView(state2);

                            rootNavView.append(view1);
                            rootNavView.append(view2);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view1.remove();
                            view2.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the first view", function () {
                                expect(ElementUtil.findViewsMatching(states, true)).toEqual(view1);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the first and second views", function () {
                                expect(ElementUtil.findViewsMatching(states, false)).toEqual([view1, view2]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the first view", function () {
                                    expect(ElementUtil.findViewsMatching(states, true)).toEqual(view1);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing the first and second views", function () {
                                    expect(ElementUtil.findViewsMatching(states, false)).toEqual([view1, view2]);
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

                            rootNavView.append(navView1);
                            rootNavView.append(navView2);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView1.remove();
                            navView2.remove();

                            $rootScope.$digest();
                        });

                        describe("when firstView is true", function () {

                            it("should return the first embedded view", function () {
                                expect(ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView1);
                            });
                        });

                        describe("when firstView is false", function () {

                            it("should return an array containing the first and second embedded views", function () {
                                expect(ElementUtil.findViewsMatching(states, false)).toEqual([
                                    embeddedView1,
                                    embeddedView2
                                ]);
                            });
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            describe("when firstView is true", function () {

                                it("should return the first embedded view", function () {
                                    expect(ElementUtil.findViewsMatching(states, true)).toEqual(embeddedView1);
                                });
                            });

                            describe("when firstView is false", function () {

                                it("should return an array containing the first and second embedded views", function () {
                                    expect(ElementUtil.findViewsMatching(states, false)).toEqual([
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

            describe("when searching for the specified state", function () {

                describe("when there is no view at the root", function () {

                    it("should return null", function () {
                        expect(ElementUtil.findViewByState(state)).toEqual(null);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return null", function () {
                            expect(ElementUtil.findViewByState(state)).toEqual(null);
                        });
                    });
                });

                describe("when there is a view with the specified state at the root", function () {
                    var view;

                    beforeEach(function () {
                        view = createView(state);

                        rootNavView.append(view);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(ElementUtil.findViewByState(state)).toEqual(view);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(ElementUtil.findViewByState(state)).toEqual(view);
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

                            rootNavView.append(navView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the embedded view", function () {
                            expect(ElementUtil.findViewByState(state)).toEqual(embeddedView);
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            it("should return the specified view", function () {
                                expect(ElementUtil.findViewByState(state)).toEqual(embeddedView);
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    it("should return null", function () {
                        expect(ElementUtil.findViewByState(state, null)).toEqual(null);
                    });
                });

                describe("given a valid navView", function () {

                    describe("when there is a view with the specified state in the navView", function () {
                        var view;

                        beforeEach(function () {
                            view = createView(state);

                            rootNavView.append(view);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view.remove();

                            $rootScope.$digest();
                        });

                        it("should return the view", function () {
                            expect(ElementUtil.findViewByState(state, rootNavView)).toEqual(view);
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

                describe("when there is no view at the root", function () {

                    it("should return null", function () {
                        expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(null);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return null", function () {
                            expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(null);
                        });
                    });
                });

                describe("when only a view with the first state is present", function () {
                    var view1;

                    beforeEach(function () {
                        view1 = createView(state1);

                        rootNavView.append(view1);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view1.remove();

                        $rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
                        });
                    });
                });

                describe("when only a view with the second state is present", function () {
                    var view2;

                    beforeEach(function () {
                        view2 = createView(state2);

                        rootNavView.append(view2);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view2.remove();

                        $rootScope.$digest();
                    });

                    it("should return the view", function () {
                        expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(view2);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the specified view", function () {
                            expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(view2);
                        });
                    });
                });

                describe("when views with both states are present", function () {
                    var view1, view2;

                    beforeEach(function () {
                        view1 = createView(state1);
                        view2 = createView(state2);

                        rootNavView.append(view1);
                        rootNavView.append(view2);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view1.remove();
                        view2.remove();

                        $rootScope.$digest();
                    });

                    it("should return the first view", function () {
                        expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
                    });

                    describe("when there is a view with a state we aren't looking for on the root", function () {
                        var decoyView;

                        beforeEach(function () {
                            decoyView = createView("decoyState");

                            rootNavView.append(decoyView);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            decoyView.remove();

                            $rootScope.$digest();
                        });

                        it("should return the first specified view", function () {
                            expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(view1);
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

                            rootNavView.append(navView1);
                            rootNavView.append(navView2);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            navView1.remove();
                            navView2.remove();

                            $rootScope.$digest();
                        });

                        describe("when the embedded views contain the same state types", function () {

                            beforeEach(function () {
                                embeddedView1 = createView(state1, navView1);
                                embeddedView2 = createView(state2, navView2);

                                $rootScope.$digest();
                            });

                            it("should return the first embedded view", function () {
                                expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView1);
                            });

                            describe("when there is a view with a state we aren't looking for on the root", function () {
                                var decoyView;

                                beforeEach(function () {
                                    decoyView = createView("decoyState");

                                    rootNavView.append(decoyView);

                                    $rootScope.$digest();
                                });

                                afterEach(function () {
                                    decoyView.remove();

                                    $rootScope.$digest();
                                });

                                it("should return the first specified view", function () {
                                    expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView1);
                                });
                            });
                        });

                        describe("when the embedded views contain 'opposite' state types", function () {

                            beforeEach(function () {
                                embeddedView1 = createView(state2, navView1);
                                embeddedView2 = createView(state1, navView2);

                                $rootScope.$digest();
                            });

                            it("should return the second opposite embedded view", function () {
                                expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView2);
                            });

                            describe("when there is a view with a state we aren't looking for on the root", function () {
                                var decoyView;

                                beforeEach(function () {
                                    decoyView = createView("decoyState");

                                    rootNavView.append(decoyView);

                                    $rootScope.$digest();
                                });

                                afterEach(function () {
                                    decoyView.remove();

                                    $rootScope.$digest();
                                });

                                it("should return the second specified opposite view", function () {
                                    expect(ElementUtil.findViewByStatesInOrder(states)).toEqual(embeddedView2);
                                });
                            });
                        });
                    });

                describe("given a navView that is null", function () {

                    it("should return null", function () {
                        expect(ElementUtil.findViewByStatesInOrder(states, null)).toEqual(null);
                    });
                });

                describe("given a valid navView", function () {

                    describe("when only a view with the first state is present", function () {
                        var view1;

                        beforeEach(function () {
                            view1 = createView(state1);

                            rootNavView.append(view1);

                            $rootScope.$digest();
                        });

                        afterEach(function () {
                            view1.remove();

                            $rootScope.$digest();
                        });

                        it("should return the view", function () {
                            expect(ElementUtil.findViewByStatesInOrder(states, rootNavView)).toEqual(view1);
                        });

                        describe("when there is a view with a state we aren't looking for on the root", function () {
                            var decoyView;

                            beforeEach(function () {
                                decoyView = createView("decoyState");

                                rootNavView.append(decoyView);

                                $rootScope.$digest();
                            });

                            afterEach(function () {
                                decoyView.remove();

                                $rootScope.$digest();
                            });

                            it("should return the specified view", function () {
                                expect(ElementUtil.findViewByStatesInOrder(states, rootNavView)).toEqual(view1);
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
                    view = createView("active", rootNavView);
                });

                afterEach(function () {
                    view.remove();
                });

                it("should return null", function () {
                    expect(ElementUtil.getViewContent()).toEqual(null);
                });
            });

            describe("when the focused view has content", function () {
                var view,
                    content;

                beforeEach(function () {
                    view = createView("active", rootNavView);
                    content = $compile("<ion-content></ion-content>")($rootScope);

                    view.append(content);

                    $rootScope.$digest();
                });

                afterEach(function () {
                    view.remove();

                    $rootScope.$digest();
                });

                it("should return the content", function () {
                    expect(ElementUtil.getViewContent()).toEqual(content);
                });
            });

            describe("when passed a null view", function () {

                it("should return null", function () {
                    expect(ElementUtil.getViewContent(null)).toEqual(null);
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
                    });

                    it("should return null", function () {
                        expect(ElementUtil.getViewContent(view)).toEqual(null);
                    });
                });

                describe("when the view has content", function () {
                    var content;

                    beforeEach(function () {
                        view = createView("mockState");
                        content = $compile("<ion-content></ion-content>")($rootScope);

                        view.append(content);

                        $rootScope.$digest();
                    });

                    afterEach(function () {
                        view.remove();

                        $rootScope.$digest();
                    });

                    it("should return the content", function () {
                        expect(ElementUtil.getViewContent(view)).toEqual(content);
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
                ElementUtil.getFocusedNavBar();
            });

            //TODO figure out how to test this
            xit("should call findNavBarByStatesInOrder with the expected values", function () {
            });
        });

        describe("has a getUnfocusedNavBar function that", function () {

            beforeEach(function () {
                ElementUtil.getUnfocusedNavBar();
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

                    ElementUtil.getUnfocusedView(mockNavView);
                });

                //TODO figure out how to test this
                xit("should call findViewByStatesInOrder with the expected values", function () {
                });
            });

            describe("when NOT passed a navView", function () {
                beforeEach(function () {
                    ElementUtil.getUnfocusedView();
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

                describe("when there is a menu with the given side", function () {
                    var sideMenu,
                        result;

                    beforeEach(function () {
                        sideMenu = createSideMenu(side);
                        document.querySelector.and.returnValue(sideMenu);

                        result = ElementUtil.getSideMenu(side);
                    });

                    it("should return the side menu", function () {
                        expect(result).toEqual(angular.element(sideMenu));
                    });
                });

                describe("when there is NOT a menu with the given side", function () {
                    var result;

                    beforeEach(function () {
                        result = ElementUtil.getSideMenu(side);
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

                        result = ElementUtil.getSideMenu();
                    });

                    it("should return the side menu", function () {
                        expect(result).toEqual(angular.element(sideMenu));
                    });
                });

                describe("when there is NOT a menu", function () {
                    var result;

                    beforeEach(function () {
                        result = ElementUtil.getSideMenu();
                    });

                    it("should return the side menu", function () {
                        expect(result).toBeNull();
                    });
                });
            });
        });

        function createNavView(state) {
            return $compile("<ion-nav-view nav-view='" + state + "'></ion-nav-view>")($rootScope);
        }

        function createSideMenu(side) {
            var template;

            if (side) {
                template = "<ion-side-menus><ion-side-menu side='" + side + "'></ion-side-menu></ion-side-menus>";
            }
            else {
                template = "<ion-side-menus><ion-side-menu></ion-side-menu></ion-side-menus>";
            }

            return $compile(template)($rootScope).find("ion-side-menu");
        }

        function createView(state, parent) {
            var view = $compile("<ion-view nav-view='" + state + "'></ion-view>")($rootScope);

            if (parent) {
                parent.append(view);
            }

            $rootScope.$digest();

            return view;
        }
    });
})();
