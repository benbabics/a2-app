// Shims
import "../shims/promise-finally";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app.module";

platformBrowserDynamic().bootstrapModule(AppModule);
