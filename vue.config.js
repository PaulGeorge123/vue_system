module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port:8088,
        // 跨域
        proxy: {
            '/api':{  //代理标识
                target:'http://localhost:8081',  //指向的实际地址
                changeOrigin:true,  // 允许跨域
                secure:false,
                pathRewrite:{
                    // 标识替换
                    // 原请求地址为 /api/getData 将'/api'替换''时，
                    // 代理后的请求地址为： http://xxx.xxx.xxx/getData
                    // 若替换为'/other',则代理后的请求地址为 http://xxx.xxx.xxx/other/getData
                    '/api':''
                }
            }
        }
    }
};