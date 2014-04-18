define(["Squire", "globals", "backbone"],
    function (Squire, globals, Backbone) {

        "use strict";

        var squire = new Squire(),
            mockFacade = {
                publish: function () { }
            },
            mockBackbone = Backbone,
            AjaxSearchCollection,
            ajaxSearchCollection;

        squire.mock("facade", mockFacade);
        squire.mock("backbone", mockBackbone);

        describe("An Ajax Search Collection", function () {
            beforeEach(function (done) {
                squire.require(["collections/AjaxSearchCollection"], function (JasmineAjaxSearchCollection) {
                    AjaxSearchCollection = JasmineAjaxSearchCollection;
                    ajaxSearchCollection = new AjaxSearchCollection();

                    done();
                });
            });

            it("is defined", function () {
                expect(ajaxSearchCollection).toBeDefined();
            });

            it("looks like a Backbone collection", function () {
                expect(ajaxSearchCollection instanceof Backbone.Collection).toBeTruthy();
            });

            describe("has a parse function that", function () {
                var mockResponse = {
                    data: {
                        totalResults: 123454,
                        searchResults: [
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
                        ]
                    }
                };

                it("is defined", function () {
                    expect(ajaxSearchCollection.parse).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxSearchCollection.parse).toEqual(jasmine.any(Function));
                });

                it("should set totalResults", function () {
                    ajaxSearchCollection.totalResults = null;

                    ajaxSearchCollection.parse(mockResponse);

                    expect(ajaxSearchCollection.totalResults).toEqual(mockResponse.data.totalResults);
                });

                it("should return searchResults", function () {
                    var actualReturnValue = ajaxSearchCollection.parse(mockResponse);

                    expect(actualReturnValue).toEqual(mockResponse.data.searchResults);
                });
            });

            describe("has a fetch function that", function () {
                var mockOptions = {
                    "firstName" : "Curly",
                    "lastName"  : "Howard",
                    "id"        : null,
                    "status"    : null,
                    "department": null
                };

                beforeEach(function () {
                    ajaxSearchCollection.totalResults = "fgasfdsgafgq";

                    spyOn(AjaxSearchCollection.__super__, "fetch").and.callFake(function () { });

                    ajaxSearchCollection.fetch(mockOptions);
                });

                it("is defined", function () {
                    expect(ajaxSearchCollection.fetch).toBeDefined();
                });

                it("is a function", function () {
                    expect(ajaxSearchCollection.fetch).toEqual(jasmine.any(Function));
                });

                it("should set totalResults to null", function () {
                    expect(ajaxSearchCollection.totalResults).toBeNull();
                });

                it("should call super", function () {
                    expect(AjaxSearchCollection.__super__.fetch).toHaveBeenCalledWith(mockOptions);
                });
            });
        });
    });
