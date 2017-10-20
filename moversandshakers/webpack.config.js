var webpack = require('webpack');
var path = require('path');


var BUILD_DIR = path.resolve(__dirname, 'bin/js');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
    entry: SRC_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: SRC_DIR
            }
        ]
    }
};

module.exports = config;