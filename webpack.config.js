const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    // The entry point file described above
    entry: 
    {
        bundle: './src/user.js',
        createAcc: './src/createAcc.js',
    },
    // The location of the build folder described above
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }

};