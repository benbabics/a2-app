define(["Squire", "jasmine-jquery"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            loginView;

        describe("A Login View", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["views/LoginView"], function (LoginView) {
                    loginView = new LoginView();

                    done();
                });
            });

            it("is defined", function () {
                expect(loginView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(loginView instanceof Backbone.View).toBeTruthy();
            });

            describe("has events that", function () {
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(loginView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.constructor).toEqual(jasmine.any(Function));
                });
            });

            describe("has an initialize function that", function () {
                it("is defined", function () {
                    expect(loginView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call pageCreate()", function () {
                    spyOn(loginView, "pageCreate").andCallFake(function () { });
                    loginView.initialize();

                    expect(loginView.pageCreate).toHaveBeenCalledWith();
                });
            });

            describe("has a pageCreate function that", function () {
                it("is defined", function () {
                    expect(loginView.pageCreate).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.pageCreate).toEqual(jasmine.any(Function));
                });
            });

            describe("has a render function that", function () {
                it("is defined", function () {
                    expect(loginView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(loginView.render).toEqual(jasmine.any(Function));
                });
            });
        });
    });
