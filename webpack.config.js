const path              = require('path');
const webpack           = require('webpack');
const merge             = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer      = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log('Start Webpack process...');

// Determine build env by npm command options
const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? 'production' : 'development';

// Common webpack config
const commonConfig = {

  // Directory to output compiled files
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name]-[hash].js',
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js'],
  },

  module: {
    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2|svg|png|jpg)$/,
        loader: 'file-loader',
        query: { name: "[name]-[hash].[ext]" }
      },
      {
        test: /\.pug$/,
        loader: 'pug',
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        loader: 'url'
      },
    ]
  },

  plugins: [
    // Compile end-user related pages
    new HtmlWebpackPlugin({
      template: 'src/pug/index.pug',
      inject:   'body',
      filename: 'index.html',
    }),

    // Inject variables to JS file.
    new webpack.DefinePlugin({
    }),
  ],

  postcss: () => [
    require('stylelint'),
    autoprefixer({ browsers: ['last 2 versions'] }),
    require('postcss-flexbugs-fixes'),
    require('postcss-reporter')({ clearMessages: true }),
  ],

}

// Additional webpack settings for local env (when invoked by 'npm start')
if (TARGET_ENV === 'development') {
  console.log('Serving locally...');

  module.exports = merge(commonConfig, {

    entry: {
      index: [
        'webpack-dev-server/client?http://localhost:8080',
        path.join( __dirname, 'src/index.js' )
      ],
    },

    devServer: {
      contentBase: 'src',
      inline:   true,
      progress: true,
    },

    module: {
      loaders: [
        {
          test: /\.(css|scss)$/,
          loaders: [
            'style-loader',
            'css-loader',
            'sass-loader',
            'postcss-loader',
          ]
        }
      ]
    }
  });
}

// Additional webpack settings for prod env (when invoked via 'npm run build')
if (TARGET_ENV === 'production') {
  console.log('Building for prod...');

  module.exports = merge(commonConfig, {

    entry: {
      index: [
        path.join( __dirname, 'src/index.js' )
      ],
    },

    module: {
      loaders: [
        {
          test: /\.(css|scss)$/,
          loader: ExtractTextPlugin.extract('style-loader', [
            'css-loader',
            'sass-loader',
            'postcss-loader',
          ])
        }
      ]
    },

    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'src/favicon.ico'
        },
      ]),

      new webpack.optimize.OccurenceOrderPlugin(),

      // Extract CSS into a separate file
      new ExtractTextPlugin( '[name]-[hash].css', { allChunks: true } ),

      // Minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
          minimize:   true,
          compressor: { warnings: false }
          // mangle:  true
      }),
    ]
  });
}
