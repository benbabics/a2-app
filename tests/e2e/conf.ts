// Because this file imports from  protractor, you'll need to have it as a
// project dependency. Please see the reference config: lib/config.ts for more
// information.
//
// To run this example, first transpile it to javascript with `npm run tsc`,
// then run `protractor conf.js`.
import { Config } from "protractor";

import { bootstrap } from "./main";

export let config: Config = {
  framework: "jasmine",
  capabilities: {
    browserName: "chrome"
  },
  specs: [ "./**/*.spec.js" ],
  seleniumAddress: "http://localhost:4444/wd/hub",

  // You could set no globals to true to avoid jQuery '$' and protractor '$'
  // collisions on the global namespace.
  noGlobals: true,

  beforeLaunch: bootstrap
};
