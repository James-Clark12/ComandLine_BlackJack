const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/app.js",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
};
