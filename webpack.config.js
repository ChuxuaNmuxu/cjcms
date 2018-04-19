module.exports = {
    egg: true,
    framework: 'react',
    // devtool: 'source-map',
    entry: {
        'ssr': 'app/web/framework/entry/entry.js',
        'layout': 'app/web/framework/layout/layout.js'
    },
    alias: {
        asset: 'app/web/asset',
        framework: 'app/web/framework',
        view: 'app/web/view',
        core: 'app/web/core',
        router: 'app/web/router'
    },
    dll: ['react', 'react-dom'],
    loaders: {
        scss: {
            enable: true,
            test: /\.scss$/,
            use: [{
                loader: 'css-loader',
                options: {
                    modules: true
                }
            }, {
                loader: 'sass-loader'
            }],
            postcss: true
        }
    // sass: {
    //   enable: false
    // },
    // css: {
    //   enable: false
    // }
    // sass:{
    //     enable: true,
    //     test: /\.scss$/,
    //     use: [{loader: 'css-loader'}, {
    //       loader: 'sass-loader'
    //   }],
    //   postcss: true
    // }
    },
    plugins: {
        ignore: false,
        modulereplacement: false
    },
    devtool:'source-map',
    done () {
        console.log('---webpack compile finish---');
    }
}
