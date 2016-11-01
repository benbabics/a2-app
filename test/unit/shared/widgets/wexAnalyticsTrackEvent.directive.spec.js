(function () {
    "use strict";

    var _,
        $rootScope,
        $compile,
        $q,
        wexAnalyticsTrackEvent,
        event;

    describe("A Wex Analytics Track Event Directive", function () {

        beforeEach(function () {
            inject(function (___, _$rootScope_, _$compile_, _$q_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $q = _$q_;
                _ = ___;
            });
        });

        describe("when the given event is an array", function () {

            describe("when the event array has 2 elements", function () {

                beforeEach(function () {
                    event = createEvent(2);

                    wexAnalyticsTrackEvent = createWexAnalyticsTrackEvent(event);
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

                describe("when the parent element is clicked", function () {

                    beforeEach(function () {
                        wexAnalyticsTrackEvent.element.triggerHandler("click");
                        $rootScope.$digest();
                    });

                    it("should call this.AnalyticsUtil.trackEvent with the expected values", function () {
                        expect(this.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
                    });
                });
            });

            describe("when the event array has 3 elements", function () {

                beforeEach(function () {
                    event = createEvent(3);

                    wexAnalyticsTrackEvent = createWexAnalyticsTrackEvent(event);
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

                describe("when the parent element is clicked", function () {

                    beforeEach(function () {
                        wexAnalyticsTrackEvent.element.triggerHandler("click");
                        $rootScope.$digest();
                    });

                    it("should call this.AnalyticsUtil.trackEvent with the expected values", function () {
                        expect(this.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
                    });
                });
            });

            describe("when the event array has 4 elements", function () {

                beforeEach(function () {
                    event = createEvent(4);

                    wexAnalyticsTrackEvent = createWexAnalyticsTrackEvent(event);
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

                describe("when the parent element is clicked", function () {

                    beforeEach(function () {
                        wexAnalyticsTrackEvent.element.triggerHandler("click");
                        $rootScope.$digest();
                    });

                    it("should call this.AnalyticsUtil.trackEvent with the expected values", function () {
                        expect(this.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
                    });
                });
            });

            describe("when the event array has greater than 4 elements", function () {

                beforeEach(function () {
                    event = createEvent(TestUtils.getRandomInteger(5, 10));

                    wexAnalyticsTrackEvent = createWexAnalyticsTrackEvent(event);
                });

                it("should NOT call this.AnalyticsUtil.trackEvent", function () {
                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });

                describe("when the parent element is clicked", function () {

                    beforeEach(function () {
                        wexAnalyticsTrackEvent.element.triggerHandler("click");
                        $rootScope.$digest();
                    });

                    it("should call this.AnalyticsUtil.trackEvent with the expected values", function () {
                        expect(this.AnalyticsUtil.trackEvent.calls.mostRecent().args).toEqual(event);
                    });
                });
            });

            describe("when the event array has less than 2 elements", function () {

                beforeEach(function () {
                    event = createEvent(TestUtils.getRandomInteger(0, 2));
                });

                it("should throw the expected error and not track the event", function () {
                    expect(function () {
                        createWexAnalyticsTrackEvent(event);
                    }).toThrowError("Malformed analytics tracking event arguments: " + event);

                    expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
                });
            });
        });

        describe("when the given event is NOT an array", function () {

            beforeEach(function () {
                event = TestUtils.getRandomStringThatIsAlphaNumeric(10);
            });

            it("should throw the expected error and not track the event", function () {
                expect(function () {
                    createWexAnalyticsTrackEvent(event);
                }).toThrowError("Malformed analytics tracking event arguments: " + event);

                expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
            });
        });

        describe("when the given event is null", function () {

            beforeEach(function () {
                event = null;
            });

            it("should throw the expected error and not track the event", function () {
                expect(function () {
                    createWexAnalyticsTrackEvent(event);
                }).toThrowError("Malformed analytics tracking event arguments: " + event);

                expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
            });
        });

        describe("when the given event is undefined", function () {

            beforeEach(function () {
                event = undefined;
            });

            it("should throw the expected error and not track the event", function () {
                expect(function () {
                    createWexAnalyticsTrackEvent(event);
                }).toThrowError("Malformed analytics tracking event arguments: " + event);

                expect(this.AnalyticsUtil.trackEvent).not.toHaveBeenCalled();
            });
        });
    });

    function createEvent(numElements) {
        return _.times(numElements, _.partial(TestUtils.getRandomStringThatIsAlphaNumeric, 10));
    }

    function createWexAnalyticsTrackEvent(event) {
        var scope = $rootScope.$new(),
            element;

        scope.event = event;

        element = $compile("<div wex-analytics-track-event='event'></div>")(scope);
        $rootScope.$digest();

        return {
            element: element,
            scope  : scope,
            vm     : element.scope()
        };
    }
})();