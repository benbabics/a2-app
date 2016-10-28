(function () {
    "use strict";

    var DEFAULT_TIMEOUT = 3000,
        $rootScope,
        $compile,
        $interval,
        wexToastTimer,
        timeout;

    describe("A Wex Toast Timer Directive", function () {

        beforeEach(function () {

            inject(function (_$rootScope_, _$compile_, _$interval_) {
                $rootScope = _$rootScope_;
                $compile = _$compile_;
                $interval = _$interval_;
            });
        });

        afterEach(function () {
            if (wexToastTimer) {
                wexToastTimer.remove();
            }
        });

        describe("when given a hide function", function () {
            var onHide;

            beforeEach(function () {
                onHide = jasmine.createSpy("onHide");
            });

            describe("when given a timeout", function () {

                beforeEach(function () {
                    wexToastTimer = createWexToastTimer({
                        timeout: timeout = TestUtils.getRandomInteger(1, 2000),
                        onHide: onHide
                    });
                });

                describe("will behave such that", commonTimeoutTests);

                describe("when the given timeout elapses", function () {

                    beforeEach(function () {
                        $interval.flush(timeout);
                        $rootScope.$digest();
                    });

                    it("should call onHide", function () {
                        expect(onHide).toHaveBeenCalledWith();
                    });
                });

                describe("when the given timeout has NOT elapsed", function () {

                    beforeEach(function () {
                        $rootScope.$digest();
                    });

                    it("should NOT call onHide", function () {
                        expect(onHide).not.toHaveBeenCalled();
                    });
                });
            });

            describe("when NOT given a timeout", function () {

                beforeEach(function () {
                    timeout = DEFAULT_TIMEOUT;

                    wexToastTimer = createWexToastTimer({onHide: onHide});
                });

                describe("will behave such that", commonTimeoutTests);

                describe("when the default timeout elapses", function () {

                    beforeEach(function () {
                        $interval.flush(timeout);
                        $rootScope.$digest();
                    });

                    it("should call onHide", function () {
                        expect(onHide).toHaveBeenCalledWith();
                    });
                });

                describe("when the given timeout has NOT elapsed", function () {

                    beforeEach(function () {
                        $rootScope.$digest();
                    });

                    it("should NOT call onHide", function () {
                        expect(onHide).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe("when NOT given a hide function", function () {

            describe("when given a timeout", function () {

                beforeEach(function () {
                    wexToastTimer = createWexToastTimer({timeout: timeout = TestUtils.getRandomInteger(1, 2000)});
                });

                describe("will behave such that", commonTimeoutTests);
            });

            describe("when NOT given a timeout", function () {

                beforeEach(function () {
                    timeout = DEFAULT_TIMEOUT;

                    wexToastTimer = createWexToastTimer();
                });

                describe("will behave such that", commonTimeoutTests);
            });
        });
    });

    function commonTimeoutTests() {

        describe("when the given timeout elapses", function () {

            beforeEach(function () {
                $interval.flush(timeout);
                $rootScope.$digest();
            });

            it("should hide the element", function () {
                expect(wexToastTimer.hasClass("hide")).toBeTruthy();
            });
        });

        describe("when the given timeout has NOT elapsed", function () {

            beforeEach(function () {
                $rootScope.$digest();
            });

            it("should NOT hide the element", function () {
                expect(wexToastTimer.hasClass("hide")).toBeFalsy();
            });
        });
    }

    function createWexToastTimer(options) {
        var scope = $rootScope.$new(),
            template = [],
            element;

        options = options || {};

        _.extend(scope, options);

        template.push("<div wex-toast-timer");

        if (options.timeout) {
            template.push("='{{timeout}}'");
        }

        if (options.onHide) {
            template.push(" wex-toast-on-hide='onHide()'");
        }

        template.push("></div>");

        element = $compile(template.join(""))(scope);

        $rootScope.$digest();

        return element;
    }
})();
