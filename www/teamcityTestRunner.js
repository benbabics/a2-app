console.log("PhantomJS started TestRunner which loads a web page with a TeamCity Reporter...");
var page = require("webpage").create();
var system = require("system");
var checkout_dir = system.args[1]; // pass checkout_dir parameter

//Open local TeamcityReporter.html
var url = "file:///" + checkout_dir + "/teamcityReporter.html";
phantom.viewportSize = {width: 800, height: 600};
//Required because PhantomJS sandboxes the website and does not show up the console messages form that page by default
page.onConsoleMessage = function (msg) {
    console.log(msg);   // Pass all page logs to stdout

    if (msg && msg.indexOf("##jasmine.reportRunnerResults") !== -1) {
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