const { merge } = require("webpack-merge")
const webpack = require("@nrwl/react/plugins/webpack")

module.exports = (config, context) => {
    return merge(webpack(config, context), {
        resolve: {
            fallback: {
                os: require.resolve("os-browserify/browser"),
                crypto: require.resolve("crypto-browserify"),
                assert: require.resolve("assert"),
                stream: require.resolve("stream-browserify")
            }
        }
    })
}
