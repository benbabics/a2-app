define(["Squire"],
    function (Squire) {

        "use strict";

        var squire = new Squire(),
            companyModel;

        describe("A Company Model", function () {
            var jasmineAsync = new AsyncSpec(this);

            jasmineAsync.beforeEach(function (done) {
                squire.require(["models/CompanyModel"], function (CompanyModel) {
                    companyModel = new CompanyModel();

                    done();
                });
            });

            it("is defined", function () {
                expect(companyModel).toBeDefined();
            });

            it("looks like a Backbone model", function () {
                expect(companyModel instanceof Backbone.Model).toBeTruthy();
            });

            describe("has property defaults that", function () {
                it("should set name to default", function () {
                    expect(companyModel.defaults.name).toBeNull();
                });

                it("should set wexAccountNumber to default", function () {
                    expect(companyModel.defaults.wexAccountNumber).toBeNull();
                });

                it("should set driverIdLength to default", function () {
                    expect(companyModel.defaults.driverIdLength).toBeNull();
                });

                it("should set departments to default", function () {
                    expect(companyModel.defaults.departments).toBeNull();
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(companyModel, "set").andCallThrough();
                });

                it("is defined", function () {
                    expect(companyModel.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(companyModel.initialize).toEqual(jasmine.any(Function));
                });

                describe("when options are not provided", function () {
                    beforeEach(function () {
                        companyModel.initialize();
                    });

                    it("should NOT call set", function () {
                        expect(companyModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided without attributes", function () {
                    var options = {};

                    beforeEach(function () {
                        companyModel.initialize(options);
                    });

                    it("should NOT call set", function () {
                        expect(companyModel.set).not.toHaveBeenCalled();
                    });
                });

                describe("when options are provided", function () {
                    var options = {
                            name: "Beavis and Butthead Inc",
                            wexAccountNumber: "5764309",
                            driverIdLength: "4",
                            departments: [
                                {
                                    id: "134613456",
                                    displayValue: "UNASSIGNED",
                                    visible: true
                                },
                                {
                                    id: "2456724567",
                                    displayValue: "Dewey, Cheetum and Howe",
                                    visible: false
                                }
                            ]
                        };

                    beforeEach(function () {
                        companyModel.initialize(options);
                    });

                    it("should call set 4 times", function () {
                        expect(companyModel.set.calls.length).toEqual(4);
                    });

                    it("should set name", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("name", options.name);
                    });

                    it("should set wexAccountNumber", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("wexAccountNumber", options.wexAccountNumber);
                    });

                    it("should set driverIdLength", function () {
                        expect(companyModel.set).toHaveBeenCalledWith("driverIdLength", options.driverIdLength);
                    });

                    // TODO - Replace with something that verifies the correct parameter was passed to the
                    // DepartmentModel constructor and then set to "departments"
                    it("should set departments", function () {
                        var actualDepartments;

                        expect(companyModel.set.calls[3].args.length).toEqual(2);
                        expect(companyModel.set.calls[3].args[0]).toEqual("departments");

                        actualDepartments = companyModel.set.calls[3].args[1];
                        expect(actualDepartments[0].get("id")).toEqual(options.departments[0].id);
                        expect(actualDepartments[0].get("name")).toEqual(options.departments[0].displayValue);
                        expect(actualDepartments[0].get("visible")).toEqual(options.departments[0].visible);

                        expect(actualDepartments[1].get("id")).toEqual(options.departments[1].id);
                        expect(actualDepartments[1].get("name")).toEqual(options.departments[1].displayValue);
                        expect(actualDepartments[1].get("visible")).toEqual(options.departments[1].visible);
                    });
                });
            });
        });
    });
