const webpackConfig = require("../node_modules/@ionic/app-scripts/config/webpack.config");
const webpack = require("webpack");


/**
 * Plugin: DefinePlugin
 * Description: Replace environment.ts file based on env.
 * Useful for having builds with global constants based on env.
 *
 * Environment helpers
 *
 * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
 */

webpackConfig.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/\.\.\/\environments\/environment/,
        function(result) {
            result.request = result.request.replace(/\.\.\/\environments\/environment/, `../environments/environment.${process.env.ENV || "local"}.ts`);
        }
    )
);
