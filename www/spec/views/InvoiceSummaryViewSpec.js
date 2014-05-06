define(["Squire", "backbone", "mustache", "text!tmpl/invoice/summary.html", "jasmine-jquery"],
    function (Squire, Backbone, Mustache, pageTemplate) {

        "use strict";

        var squire = new Squire(),
            mockBackbone = Backbone,
            mockMustache = Mustache,
            InvoiceSummaryView,
            invoiceSummaryView;

        squire.mock("backbone", mockBackbone);
        squire.mock("mustache", mockMustache);

        describe("An Invoice Summary View", function () {

            // Override the default fixture path which is spec/javascripts/fixtures
            // to instead point to our root where index.html resides
            jasmine.getFixtures().fixturesPath = "";

            beforeEach(function (done) {
                squire.require(["views/InvoiceSummaryView"],
                    function (JasmineInvoiceSummaryView) {
                        //TODO - Fix - Loading fixtures causes phantomjs to hang
                        if (window._phantom === undefined) {
                            loadFixtures("index.html");
                        }

                        InvoiceSummaryView = JasmineInvoiceSummaryView;

                        invoiceSummaryView =  new InvoiceSummaryView();

                        done();
                    });
            });

            it("is defined", function () {
                expect(invoiceSummaryView).toBeDefined();
            });

            it("looks like a Backbone View", function () {
                expect(invoiceSummaryView instanceof Backbone.View).toBeTruthy();
            });

            describe("has a constructor that", function () {
                it("is defined", function () {
                    expect(invoiceSummaryView.constructor).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryView.constructor).toEqual(jasmine.any(Function));
                });

                it("should set el", function () {
                    expect(invoiceSummaryView.el).toEqual("#invoiceSummary");
                });

                it("should set el nodeName", function () {
                    expect(invoiceSummaryView.el.nodeName).toEqual("DIV");
                });

                it("should set the template", function () {
                    expect(invoiceSummaryView.template).toEqual(pageTemplate);
                });
            });

            describe("has an initialize function that", function () {
                beforeEach(function () {
                    spyOn(mockMustache, "parse").and.callThrough();
                    spyOn(InvoiceSummaryView.__super__, "initialize").and.callThrough();

                    invoiceSummaryView.initialize();
                });

                it("is defined", function () {
                    expect(invoiceSummaryView.initialize).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryView.initialize).toEqual(jasmine.any(Function));
                });

                it("should call initialize on super", function () {
                    expect(InvoiceSummaryView.__super__.initialize).toHaveBeenCalledWith();
                });

                it("should parse the template", function () {
                    expect(mockMustache.parse).toHaveBeenCalledWith(invoiceSummaryView.template);
                });
            });

            describe("has a render function that", function () {
                var actualContent;

                beforeEach(function () {
                    actualContent = invoiceSummaryView.$el.find(":jqmData(role=content)");
                    spyOn(invoiceSummaryView.$el, "find").and.returnValue(actualContent);
                    spyOn(actualContent, "html").and.callThrough();
                    spyOn(actualContent, "trigger").and.callThrough();
                    spyOn(mockMustache, "render").and.callThrough();
                    invoiceSummaryView.render();
                });

                it("is defined", function () {
                    expect(invoiceSummaryView.render).toBeDefined();
                });

                it("is a function", function () {
                    expect(invoiceSummaryView.render).toEqual(jasmine.any(Function));
                });

                it("should call Mustache.render() on the template", function () {
                    expect(mockMustache.render).toHaveBeenCalledWith(invoiceSummaryView.template);
                });

                it("should call the html function on the content", function () {
                    var expectedContent = Mustache.render(pageTemplate);
                    expect(actualContent.html).toHaveBeenCalledWith(expectedContent);
                });

                it("should call the trigger function on the content", function () {
                    expect(actualContent.trigger).toHaveBeenCalledWith("create");
                });
            });
        });
    });
