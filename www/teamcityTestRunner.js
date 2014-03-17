console.log("PhantomJS started TestRunner which loads a web page with a TeamCity Reporter...");
var page = require("webpage").create();
var system = require("system");

//Open local TeamcityReporter.html
var url = system.args[1];
phantom.viewportSize = {width: 800, height: 600};
//Required because PhantomJS sandboxes the website and does not show up the console messages form that page by default
page.onConsoleMessage = function (msg) {
    console.log(msg);   // Pass all page logs to stdout

    if (msg && msg.indexOf("##jasmine.reportRunnerResults") !== -1) {
        page.evaluate(function () {
            jscoverage_report();
        });
        phantom.exit();
    }
};
//Open the website with the teamcity reporter
page.open(url, function (status) {
    //Page is loaded!
    if (status !== "success") {
        console.log("Unable to load the address!");
        phantom.exit();
    }
});