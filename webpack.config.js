const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

//what is the whole dist/bundle thing again? why is that the "output"?
module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  plugins: [new HtmlWebpackPlugin()],

  //why do we exclude node-modules here?
  
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,  
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    port: 8080,
    proxy: {
      '/': 'http://localhost:3000',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.ts', '.tsx'],
  },
}