module.exports = {
  egg: true,
  framework: 'react',
  // devtool: 'source-map',
  entry: {
    'ssr': 'app/web/ssr.jsx',
    'layout': 'app/web/framework/layout/layout.jsx'
  },
  alias: {
    asset: 'app/web/asset',
    component: 'app/web/component',
    framework: 'app/web/framework',
    view: 'app/web/view'
  },
  dll: ['react', 'react-dom'],
  loaders: {
    scss:{
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
    },
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
  devtool: 'cheap-module-eval-source-map',
  done() {
    console.log('---webpack compile finish---');
  }
}
