(function () {
    "use strict";

    describe("A status bar service", function() {
        var self;

        beforeEach(function() {
            self = this;

            inject(function (StatusBar) {
                self.StatusBar = StatusBar;
            });
        });

        afterEach(function() {
            angular.element(document.querySelector("#status-bar-overlay")).remove();
        });

        describe("has a setOverlaysApp function that", function() {
            describe("when the 'overlaying' class is on the status bar element", function() {
                beforeEach(function() {
                    var statusBarHtml = '<div class="overlaying" id="status-bar-overlay"></div>';
                    angular.element(document.body).append(statusBarHtml);
                });

                describe("when passed TRUE", function() {
                    it("leaves the 'overlaying' class on the element", function() {
                        this.StatusBar.setOverlaysApp(true);
                        expect(hasOverlayingClass()).toBe(true);
                    });
                });

                describe("when passed FALSE", function() {
                    it("removes the 'overlaying' class from the element", function() {
                        this.StatusBar.setOverlaysApp(false);
                        expect(hasOverlayingClass()).toBe(false);
                    });
                });
            });

            describe("when the 'overlaying' class is NOT on the status bar element", function() {
                beforeEach(function() {
                    var statusBarHtml = '<div id="status-bar-overlay"></div>';
                    angular.element(document.body).append(statusBarHtml);
                });

                describe("when passed TRUE", function() {
                    it("adds the 'overlaying' class to the element", function() {
                        this.StatusBar.setOverlaysApp(true);
                        expect(hasOverlayingClass()).toBe(true);
                    })
                });

                describe("when passed FALSE", function() {
                    it("leaves the 'overlaying' class off the element", function() {
                        this.StatusBar.setOverlaysApp(false);
                        expect(hasOverlayingClass()).toBe(false);
                    });
                });
            });
        });

        function hasOverlayingClass() {
            return angular.element(document.querySelector("#status-bar-overlay")).hasClass("overlaying");
        }
    });
})();