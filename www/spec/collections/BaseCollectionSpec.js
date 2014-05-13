define(["backbone", "Squire"],
    function (Backbone, Squire) {
        "use strict";

        var squire = new Squire(),
            baseCollection;

        squire.mock("backbone", Backbone);

        describe("A Base Collection", function () {
            beforeEach(function(done) {
                squire.require(["collections/BaseCollection"], function(BaseCollection) {
                    baseCollection = new BaseCollection();
                    done();
                });
            });

            it("is defined", function () {
                expect(baseCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(baseCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(baseCollection.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseCollection.constructor).toEqual(jasmine.any(Function));
                });
            });

            describe("has a toJSON function that", function () {
                it("is defined", function () {
                    expect(baseCollection.toJSON).toBeDefined();
                });

                it("is a function", function () {
                    expect(baseCollection.toJSON).toEqual(jasmine.any(Function));
                });

                describe("when the list of models is null", function () {
                    var actualValue;

                    beforeEach(function () {
                        baseCollection.reset();

                        actualValue = baseCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                describe("when the list of models is empty", function () {
                    var actualValue;

                    beforeEach(function () {
                        baseCollection.reset();

                        actualValue = baseCollection.toJSON();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toBeNull();
                    });
                });

                describe("when there are models in the collection", function () {
                    var mockModels,
                        model1,
                        model2,
                        actualValue;

                    beforeEach(function () {
                        mockModels = [
                            {
                                id: "134613456",
                                name: "UNASSIGNED",
                                visible: true
                            },
                            {
                                id: "2456724567",
                                name: "Dewey, Cheetum and Howe",
                                visible: false
                            }
                        ];

                        baseCollection.set(mockModels);

                        model1 = baseCollection.at(0);
                        model2 = baseCollection.at(1);

                        spyOn(model1, "toJSON").and.callThrough();
                        spyOn(model2, "toJSON").and.callThrough();

                        actualValue = baseCollection.toJSON();
                    });

                    it("should call toJSON on model1", function () {
                        expect(model1.toJSON).toHaveBeenCalledWith();
                    });

                    it("should call toJSON on model2", function () {
                        expect(model2.toJSON).toHaveBeenCalledWith();
                    });

                    it("should return the expected value", function () {
                        expect(actualValue).toEqual(mockModels);
                    });
                });
            });
        });
    });
