define(["backbone", "Squire"],
    function (Backbone, Squire) {

        "use strict";

        var squire = new Squire(),
            CompanyAjaxModel,
            companyAjaxModel;

        squire.mock("backbone", Backbone);

        describe("A Company Ajax Model", function () {
            beforeEach(function (done) {
                squire.require(["models/CompanyAjaxModel"], function (JasmineCompanyAjaxModel) {
                    CompanyAjaxModel = JasmineCompanyAjaxModel;
                    companyAjaxModel = new CompanyAjaxModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(companyAjaxModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(companyAjaxModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set accountId to default", function () {
                    expect(companyAjaxModel.defaults.accountId).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(CompanyAjaxModel.__super__, "initialize").and.callFake(function () { });
                    spyOn(companyAjaxModel, "set").and.callThrough();
                });

                it("is defined", function () {
                    expect(companyAjaxModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyAjaxModel.initialize).toEqual(jasmine.any(Function));
                });

                it("should call super", function () {
                    companyAjaxModel.initialize();

                    expect(CompanyAjaxModel.__super__.initialize).toHaveBeenCalledWith();
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        companyAjaxModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(companyAjaxModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        companyAjaxModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(companyAjaxModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                        accountId: "13465134561"
                    };

                    beforeEach(function () {
                        companyAjaxModel.initialize(options);
                    });

                    it("should call set 1 time", function () {
                        expect(companyAjaxModel.set.calls.count()).toEqual(1);
                    });

                    it("should set accountId", function () {
                        expect(companyAjaxModel.set).toHaveBeenCalledWith("accountId", options.accountId);
                    });
                });
            });
        });
    });
