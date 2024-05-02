const path = require('path');

module.exports = {
    entry: './src/server.js',
    target: 'node',
    mode: 'production',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'bin'),
    },
    optimization: {
        minimize: false,
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [[
                        '@babel/preset-env',
                        {
                            targets: {
                                chrome: 68,
                            },
                        },
                    ]],
                    comments: false,
                    compact: true,
                },
            },
        }],
    },
};