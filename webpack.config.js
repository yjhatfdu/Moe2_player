const path = require('path');
module.exports = {

    mode: 'development',
    entry: {
        'moe2player': path.resolve('./app/src/player/Player.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'moe2player',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: 'source-map',
    plugins: [
        // new DeclarationBundlerPlugin({
        //     moduleName:'./app/src/player/Player.ts',
        //     out:'./dist/bundle.d.ts',
        // })
    ],
    module: {
        rules: [
            {
                exclude: path.join(__dirname, 'node_modules'),
                test: /\.css$/, loader: [
                    'style-loader', 'css-loader'

                ]
            },
            {
                exclude: path.join(__dirname, 'node_modules'),
                test: /\.(ts|js)?$/,
                use: 'ts-loader',

            },
            {
                test: /\.(png|svg|jpg|gif|eot|woff2|woff|ttf)$/,
                use: [
                    'base64-inline-loader'
                ]
            }
        ]
    },
};