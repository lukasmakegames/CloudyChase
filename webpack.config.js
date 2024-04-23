const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) =>  {
    const { mode } = argv;
    const isDevMode = mode !== 'production';
    return {
        mode,
        devtool: isDevMode ? 'source-map' : false,
        entry: './src/index.ts',
        output: {
            filename: '[name].[contenthash].js',
            assetModuleFilename: 'assets/[name].[hash][ext][query]',
            path: path.resolve(__dirname, 'dist/www'),
            clean: true,
        },
        optimization: {
            minimize: !isDevMode,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        mangle: false,
                        compress: false,
                        output: {
                            ascii_only: true
                        },
                    },
                })
            ],
        },
        resolve: {
            extensions: ['.js', '.ts'],
        },
        module: {
            rules: [{
                test: /\.(j|t)s$/,
                use: "ts-loader",
                exclude: /node_modules/
            }, {
                test: /\.(png|ttf|mp3|m4a|ogg|wav)/,
                type: 'asset/resource'
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'CloudyChase',
                template: path.resolve(__dirname, 'public', 'index.html'),
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "public/assets/",
                        to: "assets/",
                    },
                ],
            }),
        ],
    }
};