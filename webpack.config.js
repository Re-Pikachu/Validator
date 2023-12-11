const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

//what is the whole dist/bundle thing again? why is that the "output"?
module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"), ///removed /dist to just dist. I still dont know why
    filename: "bundle.js", //changed name to bundle
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html", //we needed to add a template
    }),
  ],

  //why do we exclude node-modules here?
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: [/node_modules/, /dist/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
          "ts-loader", //ts-loader will be read first but we need babel loader too, read second. Transpile from TS to JS, then babel from JS to browser language
        ], // Use ts-loader for TypeScript files
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /dist/],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, /dist/],
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    proxy: {
      "/api/**": `http://localhost:3010/`, // changed our proxy, for all requests coming to the root directory api to be proxied to 3010 (instead of 8080)
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss", ".ts", ".tsx"],
  },
};
