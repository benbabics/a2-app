(function () {
    "use strict";

    var FormEncoder,
        _;

    describe("A Form Encoder", function () {

        beforeEach(inject(function (___, _FormEncoder_) {
            _ = ___;
            FormEncoder = _FormEncoder_;
        }));

        describe("has an encode function that", function () {

            it("should return a form encoded string", function () {
                var rawData = {
                        param1: "param1",
                        param2: "param2",
                        param3: "param3"
                    },
                    encodedData = "param1=param1&param2=param2&param3=param3";

                expect(FormEncoder.encode(rawData)).toEqual(encodedData);
            });

            it("should URI Encode all the components", function () {
                var rawData = {
                        "a!s@d#f$g%h^j": "k&l*q(w)e_r+t",
                        "<q>w?e,r.t/y": "1;2'3[4]5",
                        "\\7{8}9|": "z:xg*\"-."
                    },
                    rawObject,
                    encodedData,
                    components;

                _.forEach(rawData, function (value, key) {
                    rawObject = {};
                    rawObject[key] = value;

                    encodedData = FormEncoder.encode(rawObject);
                    components = encodedData.split("=");

                    expect(components[0]).toEqual(encodeURIComponent(key));
                    expect(components[1]).toEqual(encodeURIComponent(value));
                });

            });

            it("should replace all space characters with + characters", function () {
                var rawObject = {},
                    encodedData,
                    components;

                rawObject["this property has spaces"] = "this value has spaces";

                encodedData = FormEncoder.encode(rawObject);
                components = encodedData.split("=");

                expect(components[0]).toEqual("this+property+has+spaces");
                expect(components[1]).toEqual("this+value+has+spaces");
            });

            it("should use = and & as delimiters for names, values and the pairs respectively", function () {
                var rawData = {
                        param1: "param1",
                        param2: "param2",
                        param3: "param3"
                    },
                    encodedData = {},
                    encodedString,
                    pairs,
                    components;

                encodedString = FormEncoder.encode(rawData);
                pairs = encodedString.split("&");

                _.forEach(pairs, function (value) {
                    components = value.split("=");
                    encodedData[decodeURIComponent(components[0])] = decodeURIComponent(components[1]);
                });

                expect(rawData).toEqual(encodedData);
            });

        });

    });

})();