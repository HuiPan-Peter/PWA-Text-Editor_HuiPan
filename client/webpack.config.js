const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

//Add and configure workbox plugins for a service worker and manifest file.
//Add CSS loaders and babel to webpack.
module.exports = () => {
  return {
    mode: 'development',
    // Specifies entry points
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    // Specifies where to output the bundled code
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    
    plugins: [
      // Generates an HTML file from a template
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Just Another Text Editor'
      }),
      // Uses Workbox to inject a service worker into the app, which will enable offline functionality
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js'
      }),
      // Generates a manifest.json file that contains information about the app
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Just Another Text Editor',
        short_name: 'J.A.T.E.',
        description: 'Text Editor',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],
    // Specifies the rules for processing different file types
    module: {
      rules: [
        {
          // CSS files are processed, bundled, and added to the DOM as a style tag, with the use of style-loader and css-loader
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          // JS files are processed with babel-loader, transpiling modern JS to ES5 and allowing for cross-browser compatibility
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime']
            }
          }
        }
      ],
    },
  };
};
