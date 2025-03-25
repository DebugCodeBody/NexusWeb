const WindiCSSWebpackPlugin = require("windicss-webpack-plugin");


module.exports = {
    configureWebpack(config) {
        config.plugins.push(new WindiCSSWebpackPlugin());
    }
}