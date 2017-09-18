import { WexPlatform } from "../providers/platform";
import { MyApp } from "../app/app.component";

const platform: () => WexPlatform = () => MyApp.injector.get(WexPlatform);

 /*
  * Function decorator for wrapping a function, fn, in a call to this.platform.ready(fn)
  * $class is only necessary if the target class is not an instantiation of the actually provided class
  * If the provider in the ngModule is a { provide: class, use: class }, $class should be the provide class
  */
export function PlatformReady ($class?: any) {
  return function(target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {
        key;
        const $this = () => MyApp.injector.get($class || target.constructor);

        let originalMethod = descriptor.value;

        descriptor.value = function (...args) {
          return platform().ready(() =>  originalMethod.apply($this(), args));
        };

        return descriptor;
    };
  }