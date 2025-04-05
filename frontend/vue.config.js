const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  configureWebpack: {
    optimization: {
      minimize: false
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ],
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname)
      }
    }
  }
}) 