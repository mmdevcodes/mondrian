const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");

const buildPath = path.resolve(__dirname, 'build');

module.exports = {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        filename: '[name].[hash:20].js',
        path: buildPath
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(scss|css|sass)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        // translates CSS into CommonJS
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // Runs compiled CSS through postcss for vendor prefixing
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // compiles Sass to CSS
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    }
                ]
            },
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[hash:20].[ext]',
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            // Inject the js bundle at the end of the body of the given template
            inject: 'body'
        }),
        new CleanWebpackPlugin(buildPath),
        new FaviconsWebpackPlugin({
            logo: './src/assets/logo.png',
            prefix: 'icons-[hash]/',
            persistentCache: true,
            inject: true,
            background: '#000',
            title: 'Mondrian Layout',
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'styles-[contenthash].css'
        }),
        new HtmlCriticalWebpackPlugin({
          base: path.resolve(__dirname, 'build'),
          src: 'index.html',
          dest: 'index.html',
          inline: true,
          extract: true,
          dimensions: [1300, 900],
          minify: true,
          penthouse: {
            blockJSRequests: false
          }
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    ]
};