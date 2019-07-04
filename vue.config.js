const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
    // 配置路径别名
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_c', resolve('src/components/'))
            .set('_as', resolve('src/assets/img/'))
    },
    productionSourceMap: false,
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
                threshold: 2048,
                minRatio: 0.8
            }))
        }
        config.externals = {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
            'vuescroll': 'vuescroll',
            'qs': 'Qs'
        }
    }
}
