define(["Squire", "backbone"],
    function (Squire, Backbone) {

        "use strict";

        var squire = new Squire(),
            bankAccountModel;

        squire.mock("backbone", Backbone);

        describe("A Bank Account Model", function () {
            beforeEach(function (done) {
                squire.require(["models/BankAccountModel"], function (BankAccountModel) {
                    bankAccountModel = new BankAccountModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(bankAccountModel).toBeDefined();
            });

            it("looks like a Backbone Model", function () {
                expect(bankAccountModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set id to default", function () {
                    expect(bankAccountModel.defaults.id).toBeNull();
                });

                it("should set name to default", function () {
                    expect(bankAccountModel.defaults.name).toBeNull();
                });

                it("should set defaultBank to default", function () {
                    expect(bankAccountModel.defaults.defaultBank).toBeFalsy();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(bankAccountModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(bankAccountModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(bankAccountModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        bankAccountModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(bankAccountModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        bankAccountModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(bankAccountModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        id         : "2457624567",
                        name       : "Mock Name",
                        defaultBank: true
                    };

                    beforeEach(function () {
                        bankAccountModel.initialize(options);
                    });

                    it("should call set 3 times", function () {
                        expect(bankAccountModel.set.calls.count()).toEqual(3);
                    });

                    it("should set id", function () {
                        expect(bankAccountModel.set).toHaveBeenCalledWith("id", options.id);
                    });

                    it("should set name", function () {
                        expect(bankAccountModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set defaultBank", function () {
                        expect(bankAccountModel.set).toHaveBeenCalledWith("defaultBank", options.defaultBank);
                    });
                });
            });
        });
    });
